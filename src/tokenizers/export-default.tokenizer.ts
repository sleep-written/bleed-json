import type { InjectedScanner, SourceRange, Tokenizer } from '@lib/index.ts';
import { Lexer } from '@lib/index.ts';

export const ExportDefaultTokenizer = Lexer.tokenizer('export-default', class implements Tokenizer {
    #acum = '';

    while(c: string): boolean {
        this.#acum += c;
        this.#acum = this.#acum.replace(/\s+/gi, ' ');
        return 'export default'.startsWith(this.#acum);
    }

    validate(v: string): boolean {
        return /^export\s+default\s*$/.test(v);
    }

    test(s: InjectedScanner): SourceRange | undefined {
        return s.peekWhile(
            c => this.while(c),
            v => this.validate(v)
        )
    }
});

export default ExportDefaultTokenizer;