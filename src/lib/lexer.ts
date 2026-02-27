import { Scanner } from './scanner.ts';
import { Source, type SourceRange } from './source.ts';

export interface InjectedScanner {
    peek(length: number): SourceRange;
    peekIf(v: string): SourceRange | undefined;
    peekWhile(
        callback: (char: string) => boolean,
        validate?: (value: string) => boolean
    ): SourceRange | undefined;
}

export interface Tokenizer {
    test(s: InjectedScanner): SourceRange | undefined;
}

export interface TokenizerConstructor<T extends string> {
    new(): Tokenizer;
    type: T;
}

export interface Token<T extends string> extends SourceRange {
    type: T;
}

export class Lexer<C extends TokenizerConstructor<string>[]> {
    static tokenizer<T extends string>(
        type: T,
        target: new() => Tokenizer
    ): TokenizerConstructor<T> {
        const constructor = target as TokenizerConstructor<T>;
        constructor.type = type;
        return constructor;
    }

    #constructors: C;

    constructor(constructors: C) {
        this.#constructors = constructors;
    }

    tokenize(source: string | Source): C extends TokenizerConstructor<infer T>[]
    ?   Token<T>[]
    :   never {
        const realSource = typeof source === 'string'
        ?   new Source(source)
        :   source;

        const scanner = new Scanner(realSource);
        const tokenizers = this.#constructors.map(c => ({
            type: c.type,
            tokenizer: new c()
        }));

        const injected: InjectedScanner = {
            peek: (length: number) => realSource.sub(scanner.index, length),
            peekIf: (v: string) => scanner.peekIf(v),
            peekWhile: (
                callback: (char: string) => boolean,
                validate?: (value: string) => boolean
            ) => scanner.peekWhile(callback, validate)
        };

        const out: Token<string>[] = [];
        while (!scanner.eof) {
            let consumed = false;

            for (const { type, tokenizer } of tokenizers) {
                const range = tokenizer.test(injected);
                if (!range) {
                    continue;
                }

                const length = range.to.index - range.from.index;
                if (length <= 0) {
                    continue;
                }

                out.push({ ...range, type });
                scanner.move(length);
                consumed = true;
                break;
            }

            if (!consumed) {
                throw new Error(`No tokenizer matched at index ${scanner.index}`);
            }
        }

        return out as C extends TokenizerConstructor<infer T>[]
        ?   Token<T>[]
        :   never;
    }
}
