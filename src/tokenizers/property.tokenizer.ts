import type { InjectedScanner, SourceRange, Tokenizer } from '@lib/index.ts';
import { Lexer } from '@lib/index.ts';

export const PropertySeparatorTokenizer = Lexer.tokenizer('property', class implements Tokenizer {
    while(c: string): boolean {
        return /[a-z0-9_\.]/i.test(c);
    }

    validate(v: string): boolean {
        return /^\.[a-z_][a-z0-9_]*$/i.test(v);
    }

    test(s: InjectedScanner): SourceRange | undefined {
        return s.peekWhile(
            c => this.while(c),
            v => this.validate(v)
        );
    }
});

export default PropertySeparatorTokenizer;