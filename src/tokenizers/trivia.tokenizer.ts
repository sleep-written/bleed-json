import type { InjectedScanner, SourceRange, Tokenizer } from '@lib/index.ts';
import { Lexer } from '@lib/index.ts';

export const TriviaTokenizer = Lexer.tokenizer('trivia', class implements Tokenizer {
    while(c: string): boolean {
        return /[\n\s\t]/.test(c);
    }

    test(s: InjectedScanner): SourceRange | undefined {
        return s.peekWhile(c => this.while(c));
    }
});

export default TriviaTokenizer;