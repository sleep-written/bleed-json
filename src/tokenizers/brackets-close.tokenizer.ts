import type { InjectedScanner, SourceRange, Tokenizer } from '@lib/index.ts';
import { Lexer } from '@lib/index.ts';

export const BracketsCloseTokenizer = Lexer.tokenizer('brackets-close', class implements Tokenizer {
    test(s: InjectedScanner): SourceRange | undefined {
        return s.peekIf(']');
    }
});

export default BracketsCloseTokenizer;