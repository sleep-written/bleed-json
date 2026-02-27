export interface SourcePosition {
    index: number;
    line: number;
    col:  number;
}

export interface SourcePositionCharacter extends SourcePosition {
    char: string;
}

export interface SourceRange {
    value: string;
    from:  SourcePosition;
    to:    SourcePosition;
}

export class Source {
    #content: string;
    get content(): string {
        return this.#content;
    }

    // Code points (emoji-safe indexing).
    #chars: string[];

    // Cursor positions for every code point index: 0..length (inclusive).
    // cursor[i] is the position *before* consuming chars[i].
    #cursor: SourcePosition[];

    get length(): number {
        return this.#chars.length;
    }

    constructor(content: string) {
        this.#content = content
            .replace(/\r\n/g, '\n')
            .replace(/\r/g, '\n');

        this.#chars = Array.from(this.#content);
        this.#cursor = this.#buildCursor(this.#chars);
    }

    /**
     * Gets the character at the given code point index, including its 1-based line and column.
     *
     * Indexing rules:
     * - Uses Unicode code point indexing (e.g. an emoji counts as a single character).
     * - Negative indexes are supported (Python-style):
     *   - `-1` is the last character
     *   - `-length` is the first character
     * - Out of bounds returns `undefined`.
     *
     * Line and column are 1-based.
     */
    at(i: number, strict?: false): SourcePositionCharacter | undefined;
    at(i: number, strict: true): SourcePositionCharacter;
    at(i: number, strict?: boolean): SourcePositionCharacter | undefined {
        if (strict) {
            const v = this.at(i);
            if (!v) {
                throw new Error(`Character not found at position ${i}`);
            }

            return v;
        }

        if (!Number.isInteger(i)) {
            return undefined;
        }

        const length = this.length;
        const target = i < 0 ? length + i : i;

        if (target < 0 || target >= length) {
            return undefined;
        }

        const pos = this.#cursor[target];

        // Return a fresh object to avoid leaking internal references.
        return {
            index: target,
            line: pos.line,
            col:  pos.col,
            char: this.#chars[target]
        };
    }

    /**
     * Slices the source by Unicode code point indexes, like `Array.prototype.slice`.
     *
     * Semantics:
     * - `start` is inclusive, `end` is exclusive.
     * - Both accept negative indexes (relative to the end).
     * - Both are clamped to the [0, length] range.
     * - If `end < start`, the result is an empty range.
     *
     * The returned `from` and `to` positions behave like cursors:
     * - `from` is the position at `start`
     * - `to` is the position at `end` (cursor right after the last included char)
     */
    slice(start?: number, end?: number): SourceRange {
        const length = this.length;

        const rawStart = start ?? 0;
        const rawEnd = end ?? length;

        const s = this.#clampSliceIndex(rawStart, length);
        const e = this.#clampSliceIndex(rawEnd, length);

        const fromIndex = s;
        const toIndex = e < s ? s : e;

        const fromPos = this.#cursor[fromIndex];
        const toPos = this.#cursor[toIndex];

        return {
            value: this.#chars.slice(fromIndex, toIndex).join(''),
            from:  { index: fromPos.index, line: fromPos.line, col: fromPos.col },
            to:    { index: toPos.index,   line: toPos.line,   col: toPos.col }
        };
    }

    /**
     * Returns a substring using Unicode code point indexing, but the second parameter
     * is the desired length (not an end index).
     *
     * This behaves similarly to the classic `substr(start, length)` idea, but:
     * - Indexing is by Unicode code points (emoji count as 1).
     * - `start` supports negative indexes (Python-style) and is clamped to [0, total].
     * - `length` is clamped to [0, remaining]. Non-finite or non-integer values yield an empty range.
     * - Internally delegates to `slice` to avoid duplicating logic.
     */
    sub(start?: number, length?: number): SourceRange {
        const total = this.length;

        const rawStart = start ?? 0;
        const s = this.#clampSliceIndex(rawStart, total);

        if (length === undefined) {
            return this.slice(s);
        }

        if (!Number.isFinite(length) || !Number.isInteger(length)) {
            return this.slice(s, s);
        }

        const len = Math.max(0, length);
        return this.slice(s, s + len);
    }

    /**
     * Builds cursor positions for each code point index.
     * The resulting array has length = chars.length + 1.
     */
    #buildCursor(chars: string[]): SourcePosition[] {
        const out: SourcePosition[] = new Array(chars.length + 1);

        let line = 1;
        let col = 1;

        // Cursor at index 0.
        out[0] = { index: 0, line, col };

        for (let i = 0; i < chars.length; i += 1) {
            const ch = chars[i];

            // Advance cursor after consuming this character.
            if (ch === '\n') {
                line += 1;
                col = 1;
            } else {
                col += 1;
            }

            out[i + 1] = { index: i + 1, line, col };
        }

        return out;
    }

    /**
     * Normalizes an index like Array.prototype.slice does, but in code points.
     */
    #clampSliceIndex(i: number, length: number): number {
        // JS slice uses ToIntegerOrInfinity semantics.
        if (!Number.isFinite(i)) {
            return i === Infinity ? length : 0;
        }

        const n = Math.trunc(i);
        const resolved = n < 0 ? length + n : n;
        return Math.max(0, Math.min(resolved, length));
    }
}