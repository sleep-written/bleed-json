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
            to:     { index: 3, line: 1, col: 4 },
        },
        {
            value:  '666',
            type:   'number',
            from:   { index: 3, line: 1, col: 4 },
            to:     { index: 6, line: 1, col: 7 },
        }
    ]);
});