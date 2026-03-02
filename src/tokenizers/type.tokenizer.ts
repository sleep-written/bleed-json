import type { InjectedScanner, SourceRange, Tokenizer } from '@lib/index.ts';
import { Lexer } from '@lib/index.ts';

export const TypeTokenizer = Lexer.tokenizer('type', class implements Tokenizer {
    test(s: InjectedScanner): SourceRange | undefined {
        return s.peekIf('type');
    }
});

export default TypeTokenizer;