import type { InjectedScanner, SourceRange, Tokenizer } from '@lib/index.ts';
import { Lexer } from '@lib/index.ts';

export const BooleanTokenizer = Lexer.tokenizer('boolean', class implements Tokenizer {
    test(s: InjectedScanner): SourceRange | undefined {
        return s.peekIf('true') ?? s.peekIf('false');
    }
});

export default BooleanTokenizer;