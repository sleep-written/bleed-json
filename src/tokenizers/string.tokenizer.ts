import type { InjectedScanner, SourceRange, Tokenizer } from '@lib/index.ts';
import { Lexer } from '@lib/index.ts';

export const StringTokenizer = Lexer.tokenizer('string', class implements Tokenizer {
    #quote?: string;
    #escape = false;
    #closed = false;

    while(c: string): boolean {
        if (this.#closed) {
            return false;

        } else if (typeof this.#quote !== 'string') {
            switch (c) {
                case '`':
                case '"':
                case "'": {
                    this.#quote = c;
                    return true;
                }

                default: {
                    return false;
                }
            }

        } else if (this.#escape) {
            this.#escape = false;

        } else if (c === '\\') {
            this.#escape = true;

        } else if (c === this.#quote) {
            this.#closed = true;

        }

        return true;
    }

    validate(v: string): boolean {
        return v.length >= 2 && v.at(0) === v.at(-1);
    }

    test(s: InjectedScanner): SourceRange | undefined {
        return s.peekWhile(
            c => this.while(c),
            v => this.validate(v)
        );
    }
});

export default StringTokenizer;