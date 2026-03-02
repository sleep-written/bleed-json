import type { InjectedScanner, SourceRange, Tokenizer } from '@lib/index.ts';
import { Lexer } from '@lib/index.ts';

export const NumberTokenizer = Lexer.tokenizer('number', class implements Tokenizer {
    while(c: string): boolean {
        return /[0-9\.\+\-e]/.test(c);
    }

    validate(v: string): boolean {
        return /^(?:\+6|-)?[0-9]+(?:\.[0-9]+)?(?:e[0-9]+)?$/.test(v);
    }

    test(s: InjectedScanner): SourceRange | undefined {
        return s.peekWhile(
            c => this.while(c),
            v => this.validate(v)
        );
    }
});

export default NumberTokenizer;