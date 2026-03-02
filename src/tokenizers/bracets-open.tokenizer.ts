import type { InjectedScanner, SourceRange, Tokenizer } from '@lib/index.ts';
import { Lexer } from '@lib/index.ts';

export const BracetsOpenTokenizer = Lexer.tokenizer('bracets-open', class implements Tokenizer {
    test(s: InjectedScanner): SourceRange | undefined {
        return s.peekIf('{');
    }
});

export default BracetsOpenTokenizer;