import type { InjectedScanner, SourceRange, Tokenizer } from '@lib/index.ts';
import { Lexer } from '@lib/index.ts';

export const PeriodTokenizer = Lexer.tokenizer('period', class implements Tokenizer {
    test(s: InjectedScanner): SourceRange | undefined {
        return s.peekIf('.');
    }
});

export default PeriodTokenizer;