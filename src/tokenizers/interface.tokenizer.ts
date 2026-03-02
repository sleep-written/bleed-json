import type { InjectedScanner, SourceRange, Tokenizer } from '@lib/index.ts';
import { Lexer } from '@lib/index.ts';

export const InterfaceTokenizer = Lexer.tokenizer('interface', class implements Tokenizer {
    test(s: InjectedScanner): SourceRange | undefined {
        return s.peekIf('interface');
    }
});

export default InterfaceTokenizer;