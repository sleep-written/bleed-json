import type { InjectedScanner, SourceRange, Tokenizer } from '@lib/index.ts';
import { Lexer } from '@lib/index.ts';

export const ExportDefaultTokenizer = Lexer.tokenizer('export-default', class implements Tokenizer {
    while(acum: string, c: string): string | undefined {
        const next = `${acum}${c}`.replace(/\s+/gi, ' ');
        return 'export default'.startsWith(next)
        ?   next
        :   undefined;
    }

    validate(v: string): boolean {
        return /^export\s+default\s*$/.test(v);
    }

    test(s: InjectedScanner): SourceRange | undefined {
        let acum = '';

        return s.peekWhile(
            c => {
                const next = this.while(acum, c);
                if (!next) {
                    return false;
                }

                acum = next;
                return true;
            },
            v => this.validate(v)
        );
    }
});

export default ExportDefaultTokenizer;
