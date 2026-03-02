import type { InjectedScanner, SourceRange, Tokenizer } from '@lib/index.ts';
import { Lexer } from '@lib/index.ts';

export const ParamSeparatorTokenizer = Lexer.tokenizer('param-separator', class implements Tokenizer {
    while(c: string): boolean {
        return /[,\s]/.test(c);
    }

    validate(v: string): boolean {
        return /^,\s*/.test(v);
    }

    test(s: InjectedScanner): SourceRange | undefined {
        return s.peekWhile(
            c => this.while(c),
            v => this.validate(v)
        );
    }
});

export default ParamSeparatorTokenizer;