import type { SourceRange } from './source.ts';
import { Source } from './source.ts';

export class SourceScanner {
    #source: Source;

    #index = 0;
    get index(): number {
        return this.#index;
    }

    get eofIndex(): number {
        return this.#source.length;
    }

    get eof(): boolean {
        return this.#index >= this.#source.length;
    }

    constructor(source: string | Source) {
        this.#source = typeof source === 'string'
        ?   new Source(source)
        :   source;
    }

    peek(length: number): SourceRange {
        if (!Number.isInteger(length)) {
            length = Math.trunc(length);
        }
        
        if (length >= 0) {
            return this.#source.sub(this.#index, length);
        } else {
            const { value, from, to } = this.#source.sub(
                this.#index + length,
                Math.abs(length)
            );

            return {
                value,
                from: to,
                to: from
            };
        }
    }

    peekIf(v: string): SourceRange | undefined {
        let i = 0;
        let value = '';
        while (this.#index + i < this.#source.length) {
            value += this.#source
                .at(this.#index + i++, true)
                .char;

            if (v === value) {
                return this.#source.sub(this.#index, i);

            } else if (!v.startsWith(value)) {
                break;
            }
        }
        
        return undefined;
    }

    peekWhile(
        callback: (char: string) => boolean,
        validate?: (v: string) => boolean
    ): SourceRange | undefined {
        let i = 0;
        let value = '';
        while (this.#index + i < this.#source.length) {
            const char = this.#source
                .at(this.#index + i, true)
                .char;

            if (callback(char)) {
                value += char;
                i++;
            } else {
                break;
            }
        }

        if (i > 0 && (!validate || (validate && validate(value)))) {
            return this.#source.sub(this.#index, i);
        }
        
        return undefined;
    }

    move(length: number): SourceScanner {
        if (!Number.isInteger(length)) {
            length = !isNaN(length)
            ?   Math.trunc(length)
            :   0;
        }

        this.#index += length;
        if (this.#index > this.#source.length) {
            this.#index = this.#source.length;
        } else if (this.#index < 0) {
            this.#index = 0;
        }

        return this;
    }

    consume(length: number): SourceRange {
        const i = this.#index;
        this.move(length);

        if (length >= 0) {
            return this.#source.sub(i, length);
        } else {
            const { value, from, to } = this.#source.sub(this.#index, Math.abs(length));
            return {
                value,
                from: to,
                to: from
            };
        }
    }
}