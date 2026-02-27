import type { InjectedScanner, Tokenizer } from './lexer.ts';
import { Lexer } from './lexer.ts';
import test from 'node:test';
import type { SourceRange } from './source.ts';

test('Basic Lexer', (t: test.TestContext) => {
    const BooleanTokenizer = Lexer.tokenizer('boolean', class implements Tokenizer {
        test(s: InjectedScanner): SourceRange | undefined {
            return s.peekIf('true') ?? s.peekIf('false');
        }
    });
    
    const NumberTokenizer = Lexer.tokenizer('number', class implements Tokenizer {
        test(s: InjectedScanner): SourceRange | undefined {
            return s.peekWhile(c => c >= '0' && c <= '9');
        }
    });

    const lexer = new Lexer([
        BooleanTokenizer,
        NumberTokenizer,
    ]);

    const tokens = lexer.tokenize('false666');
    t.assert.deepStrictEqual(tokens, [
        {
            value:  'false',
            type:   'boolean',
            from:   { index: 0, line: 1, col: 1 },
            to:     { index: 5, line: 1, col: 6 },
        },
        {
            value:  '666',
            type:   'number',
            from:   { index: 5, line: 1, col: 6 },
            to:     { index: 8, line: 1, col: 9 },
        }
    ]);
});

test('Complex Lexer', (t: test.TestContext) => {
    const ParenthesisOpenTokenizer = Lexer.tokenizer('parenthesis-open', class implements Tokenizer {
        while(c: string): boolean {
            return /[\(\s]/.test(c);
        }

        validate(v: string): boolean {
            return /^\(\s*/.test(v);
        }

        test(s: InjectedScanner): SourceRange | undefined {
            return s.peekWhile(
                c => this.while(c),
                v => this.validate(v)
            );
        }
    });
    
    const ParenthesisCloseTokenizer = Lexer.tokenizer('parenthesis-close', class implements Tokenizer {
        while(c: string): boolean {
            return /[\)\s]/.test(c);
        }

        validate(v: string): boolean {
            return /^\)\s*/.test(v);
        }

        test(s: InjectedScanner): SourceRange | undefined {
            return s.peekWhile(
                c => this.while(c),
                v => this.validate(v)
            );
        }
    });
    
    const ParamSeparatorCloseTokenizer = Lexer.tokenizer('param-separator', class implements Tokenizer {
        while(c: string): boolean {
            return /[,\s]/.test(c);
        }

        validate(v: string): boolean {
            return /^,\s*/.test(v);
        }

        test(s: InjectedScanner): SourceRange | undefined {
            return s.peekWhile(
                c => this.while(c),
                v => this.validate(v)
            );
        }
    });

    const BooleanTokenizer = Lexer.tokenizer('boolean', class implements Tokenizer {
        test(s: InjectedScanner): SourceRange | undefined {
            return s.peekIf('true') ?? s.peekIf('false');
        }
    });
    
    const NumberTokenizer = Lexer.tokenizer('number', class implements Tokenizer {
        while(c: string): boolean {
            return /[0-9\.\+\-e]/.test(c);
        }

        validate(v: string): boolean {
            return /^(?:\+6|-)?[0-9]+(?:\.[0-9]+)?(?:e[0-9]+)?$/.test(v);
        }

        test(s: InjectedScanner): SourceRange | undefined {
            return s.peekWhile(
                c => this.while(c),
                v => this.validate(v)
            );
        }
    });
    
    const IdentifierTokenizer = Lexer.tokenizer('identifier', class implements Tokenizer {
        while(c: string): boolean {
            return /[a-z0-9_]/i.test(c);
        }

        validate(v: string): boolean {
            return /^[a-z_][a-z0-9_]*$/i.test(v);
        }

        test(s: InjectedScanner): SourceRange | undefined {
            return s.peekWhile(
                c => this.while(c),
                v => this.validate(v)
            );
        }
    });

    const lexer = new Lexer([
        ParamSeparatorCloseTokenizer,
        ParenthesisOpenTokenizer,
        ParenthesisCloseTokenizer,
        IdentifierTokenizer,
        BooleanTokenizer,
        NumberTokenizer,
    ]);

    const tokens = lexer.tokenize('addElement(-5.15, false)');
    t.assert.deepStrictEqual(tokens, [
        {
            value:  'addElement',
            type:   'identifier',
            from:   { index: 0, line: 1, col: 1 },
            to:     { index: 10, line: 1, col: 11 },
        },
        {
            value:  '(',
            type:   'parenthesis-open',
            from:   { index: 10, line: 1, col: 11 },
            to:     { index: 11, line: 1, col: 12 },
        },
        {
            value:  '-5.15',
            type:   'number',
            from:   { index: 11, line: 1, col: 12 },
            to:     { index: 16, line: 1, col: 17 },
        },
        {
            value:  ', ',
            type:   'param-separator',
            from:   { index: 16, line: 1, col: 17 },
            to:     { index: 18, line: 1, col: 19 },
        },
        {
            value:  'false',
            type:   'identifier',
            from:   { index: 18, line: 1, col: 19 },
            to:     { index: 23, line: 1, col: 24 },
        },
        {
            value:  ')',
            type:   'parenthesis-close',
            from:   { index: 23, line: 1, col: 24 },
            to:     { index: 24, line: 1, col: 25 },
        }
    ]);
});