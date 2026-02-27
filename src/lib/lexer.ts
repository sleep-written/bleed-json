import type { Source, SourceRange } from './source.ts';

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
        throw new Error('Not implemented yet');
    }
}