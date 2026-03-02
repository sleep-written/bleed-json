import type { InjectedScanner, SourceRange, Tokenizer } from '@lib/index.ts';
import { Lexer } from '@lib/index.ts';

export const DefaultTokenizer = Lexer.tokenizer('default', class implements Tokenizer {
    test(s: InjectedScanner): SourceRange | undefined {
        return s.peekIf('default');
    }
});

export default DefaultTokenizer;