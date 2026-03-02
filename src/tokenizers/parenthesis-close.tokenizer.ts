import type { InjectedScanner, SourceRange, Tokenizer } from '@lib/index.ts';
import { Lexer } from '@lib/index.ts';

export const ParenthesisCloseTokenizer = Lexer.tokenizer('parenthesis-close', class implements Tokenizer {
    test(s: InjectedScanner): SourceRange | undefined {
        return s.peekIf(')');
    }
});

export default ParenthesisCloseTokenizer;