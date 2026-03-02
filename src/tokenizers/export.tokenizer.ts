import type { InjectedScanner, SourceRange, Tokenizer } from '@lib/index.ts';
import { Lexer } from '@lib/index.ts';

export const ExportTokenizer = Lexer.tokenizer('export', class implements Tokenizer {
    test(s: InjectedScanner): SourceRange | undefined {
        return s.peekIf('export');
    }
});

export default ExportTokenizer;