import type { InjectedScanner, SourceRange, Tokenizer } from '@lib/index.ts';
import { Lexer } from '@lib/index.ts';

export const SentenceEndTokenizer = Lexer.tokenizer('sentence-end', class implements Tokenizer {
    while(c: string): boolean {
        return /[;\s]/i.test(c);
    }

    validate(v: string): boolean {
        return /^;\s*$/i.test(v);
    }

    test(s: InjectedScanner): SourceRange | undefined {
        return s.peekWhile(
            c => this.while(c),
            v => this.validate(v)
        );
    }
});

export default SentenceEndTokenizer;