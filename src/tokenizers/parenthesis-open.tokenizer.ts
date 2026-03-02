import type { InjectedScanner, SourceRange, Tokenizer } from '@lib/index.ts';
import { Lexer } from '@lib/index.ts';

export const ParenthesisOpenTokenizer = Lexer.tokenizer('parenthesis-open', class implements Tokenizer {
    while(c: string): boolean {
        return /[\(\s]/.test(c);
    }

    validate(v: string): boolean {
        return /^\(\s*/.test(v);
    }

    test(s: InjectedScanner): SourceRange | undefined {
        return s.peekWhile(
            c => this.while(c),
            v => this.validate(v)
        );
    }
});

export default ParenthesisOpenTokenizer;