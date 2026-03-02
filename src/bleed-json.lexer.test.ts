import { BleedJSONLexer } from './bleed-json.lexer.ts';
import test from 'node:test';

test('Tokenize simple function call', (t: test.TestContext) => {
    const lexer = new BleedJSONLexer();
    const tokens = lexer.tokenize(`addNumber("Cosme \\"Fulanito\\"", 666, true)`);
    t.assert.deepStrictEqual(tokens, [
        {
            value:  'addNumber',
            type:   'identifier',
            from:   { index: 0, line: 1, col: 1 },
            to:     { index: 9, line: 1, col: 10 }
        },
        {
            value:  '(',
            type:   'parenthesis-open',
            from:   { index: 9, line: 1, col: 10 },
            to:     { index: 10, line: 1, col: 11 }
        },
        {
            value:  '"Cosme \\"Fulanito\\""',
            type:   'string',
            from:   { index: 10, line: 1, col: 11 },
            to:     { index: 30, line: 1, col: 31 }
        },
        {
            value:  ', ',
            type:   'param-separator',
            from:   { index: 30, line: 1, col: 31 },
            to:     { index: 32, line: 1, col: 33 }
        },
        {
            value:  '666',
            type:   'number',
            from:   { index: 32, line: 1, col: 33 },
            to:     { index: 35, line: 1, col: 36 }
        },
        {
            value:  ', ',
            type:   'param-separator',
            from:   { index: 35, line: 1, col: 36 },
            to:     { index: 37, line: 1, col: 38 }
        },
        {
            value:  'true',
            type:   'identifier',
            from:   { index: 37, line: 1, col: 38 },
            to:     { index: 41, line: 1, col: 42 }
        },
        {
            value:  ')',
            type:   'parenthesis-close',
            from:   { index: 41, line: 1, col: 42 },
            to:     { index: 42, line: 1, col: 43 }
        }
    ]);
});

test('Tokenize multiline object', (t: test.TestContext) => {
    const lexer = new BleedJSONLexer();
    const tokens = lexer.tokenize(`{
        id: 666,
        isPendejo: true,
        signature: "el bastardo ctm jaja"
    }`);
    t.assert.deepStrictEqual(tokens, [
        {
            value: '{\n        ',
            type: 'bracets-open',
            from: { index: 0, line: 1, col: 1 },
            to: { index: 10, line: 2, col: 9 }
        },
        {
            value: 'id',
            type: 'identifier',
            from: { index: 10, line: 2, col: 9 },
            to: { index: 12, line: 2, col: 11 }
        },
        {
            value: ': ',
            type: 'property-separator',
            from: { index: 12, line: 2, col: 11 },
            to: { index: 14, line: 2, col: 13 }
        },
        {
            value: '666',
            type: 'number',
            from: { index: 14, line: 2, col: 13 },
            to: { index: 17, line: 2, col: 16 }
        },
        {
            value: ',\n        ',
            type: 'param-separator',
            from: { index: 17, line: 2, col: 16 },
            to: { index: 27, line: 3, col: 9 }
        },
        {
            value: 'isPendejo',
            type: 'identifier',
            from: { index: 27, line: 3, col: 9 },
            to: { index: 36, line: 3, col: 18 }
        },
        {
            value: ': ',
            type: 'property-separator',
            from: { index: 36, line: 3, col: 18 },
            to: { index: 38, line: 3, col: 20 }
        },
        {
            value: 'true',
            type: 'identifier',
            from: { index: 38, line: 3, col: 20 },
            to: { index: 42, line: 3, col: 24 }
        },
        {
            value: ',\n        ',
            type: 'param-separator',
            from: { index: 42, line: 3, col: 24 },
            to: { index: 52, line: 4, col: 9 }
        },
        {
            value: 'signature',
            type: 'identifier',
            from: { index: 52, line: 4, col: 9 },
            to: { index: 61, line: 4, col: 18 }
        },
        {
            value: ': ',
            type: 'property-separator',
            from: { index: 61, line: 4, col: 18 },
            to: { index: 63, line: 4, col: 20 }
        },
        {
            value: '"el bastardo ctm jaja"',
            type: 'string',
            from: { index: 63, line: 4, col: 20 },
            to: { index: 85, line: 4, col: 42 }
        },
        {
            value: '}',
            type: 'bracets-close',
            from: { index: 90, line: 5, col: 5 },
            to: { index: 91, line: 5, col: 6 }
        }
    ]);
});

test('Tokenize an function call as nested property', (t: test.TestContext) => {
    const lexer = new BleedJSONLexer();
    const tokens = lexer.tokenize(`JSON.stringify({
        where: {
            id: greaterThan(666)
        }
        sort: {
            cod: desc()
        }
    })`);
    t.assert.deepStrictEqual(tokens, [
        {
            value:  'JSON',
            type:   'identifier',
            from:   { index: 0, line: 1, col: 1 },
            to:     { index: 4, line: 1, col: 5 }
        },
        {
            value:  '.stringify',
            type:   'property',
            from:   { index: 4, line: 1, col: 5 },
            to:     { index: 14, line: 1, col: 15 }
        },
        {
            value:  '(',
            type:   'parenthesis-open',
            from:   { index: 14, line: 1, col: 15 },
            to:     { index: 15, line: 1, col: 16 }
        },
        {
            value:  '{\n        ',
            type:   'bracets-open',
            from:   { index: 15, line: 1, col: 16 },
            to:     { index: 25, line: 2, col: 9 }
        },
        {
            value:  'where',
            type:   'identifier',
            from:   { index: 25, line: 2, col: 9 },
            to:     { index: 30, line: 2, col: 14 }
        },
        {
            value:  ': ',
            type:   'property-separator',
            from:   { index: 30, line: 2, col: 14 },
            to:     { index: 32, line: 2, col: 16 }
        },
        {
            value:  '{\n            ',
            type:   'bracets-open',
            from:   { index: 32, line: 2, col: 16 },
            to:     { index: 46, line: 3, col: 13 }
        },
        {
            value:  'id',
            type:   'identifier',
            from:   { index: 46, line: 3, col: 13 },
            to:     { index: 48, line: 3, col: 15 }
        },
        {
            value:  ': ',
            type:   'property-separator',
            from:   { index: 48, line: 3, col: 15 },
            to:     { index: 50, line: 3, col: 17 }
        },
        {
            value:  'greaterThan',
            type:   'identifier',
            from:   { index: 50, line: 3, col: 17 },
            to:     { index: 61, line: 3, col: 28 }
        },
        {
            value:  '(',
            type:   'parenthesis-open',
            from:   { index: 61, line: 3, col: 28 },
            to:     { index: 62, line: 3, col: 29 }
        },
        {
            value:  '666',
            type:   'number',
            from:   { index: 62, line: 3, col: 29 },
            to:     { index: 65, line: 3, col: 32 }
        },
        {
            value:  ')\n        ',
            type:   'parenthesis-close',
            from:   { index: 65, line: 3, col: 32 },
            to:     { index: 75, line: 4, col: 9 }
        },
        {
            value:  '}\n        ',
            type:   'bracets-close',
            from:   { index: 75, line: 4, col: 9 },
            to:     { index: 85, line: 5, col: 9 }
        },
        {
            value:  'sort',
            type:   'identifier',
            from:   { index: 85, line: 5, col: 9 },
            to:     { index: 89, line: 5, col: 13 }
        },
        {
            value:  ': ',
            type:   'property-separator',
            from:   { index: 89, line: 5, col: 13 },
            to:     { index: 91, line: 5, col: 15 }
        },
        {
            value:  '{\n            ',
            type:   'bracets-open',
            from:   { index: 91, line: 5, col: 15 },
            to:     { index: 105, line: 6, col: 13 }
        },
        {
            value:  'cod',
            type:   'identifier',
            from:   { index: 105, line: 6, col: 13 },
            to:     { index: 108, line: 6, col: 16 }
        },
        {
            value:  ': ',
            type:   'property-separator',
            from:   { index: 108, line: 6, col: 16 },
            to:     { index: 110, line: 6, col: 18 }
        },
        {
            value:  'desc',
            type:   'identifier',
            from:   { index: 110, line: 6, col: 18 },
            to:     { index: 114, line: 6, col: 22 }
        },
        {
            value:  '(',
            type:   'parenthesis-open',
            from:   { index: 114, line: 6, col: 22 },
            to:     { index: 115, line: 6, col: 23 }
        },
        {
            value:  ')\n        ',
            type:   'parenthesis-close',
            from:   { index: 115, line: 6, col: 23 },
            to:     { index: 125, line: 7, col: 9 }
        },
        {
            value:  '}\n    }',
            type:   'bracets-close',
            from:   { index: 125, line: 7, col: 9 },
            to:     { index: 132, line: 8, col: 6 }
        },
        {
            value:  ')',
            type:   'parenthesis-close',
            from:   { index: 132, line: 8, col: 6 },
            to:     { index: 133, line: 8, col: 7 }
        }
    ]);
});

test('Tokenize an object exported', (t: test.TestContext) => {
    const lexer = new BleedJSONLexer();
    const tokens = lexer.tokenize(`
    export default {
        id: 666,
        active: true
    };`);

    t.assert.deepStrictEqual(tokens, [
        {
            value:  'export default',
            type:   'export-default',
            from:   { index: 5, line: 2, col: 5 },
            to:     { index: 19, line: 2, col: 19 }
        },
        {
            value:  '{\n        ',
            type:   'bracets-open',
            from:   { index: 20, line: 2, col: 20 },
            to:     { index: 30, line: 3, col: 9 }
        },
        {
            value:  'id',
            type:   'identifier',
            from:   { index: 30, line: 3, col: 9 },
            to:     { index: 32, line: 3, col: 11 }
        },
        {
            value:  ': ',
            type:   'property-separator',
            from:   { index: 32, line: 3, col: 11 },
            to:     { index: 34, line: 3, col: 13 }
        },
        {
            value:  '666',
            type:   'number',
            from:   { index: 34, line: 3, col: 13 },
            to:     { index: 37, line: 3, col: 16 }
        },
        {
            value:  ',\n        ',
            type:   'param-separator',
            from:   { index: 37, line: 3, col: 16 },
            to:     { index: 47, line: 4, col: 9 }
        },
        {
            value:  'active',
            type:   'identifier',
            from:   { index: 47, line: 4, col: 9 },
            to:     { index: 53, line: 4, col: 15 }
        },
        {
            value:  ': ',
            type:   'property-separator',
            from:   { index: 53, line: 4, col: 15 },
            to:     { index: 55, line: 4, col: 17 }
        },
        {
            value:  'true',
            type:   'identifier',
            from:   { index: 55, line: 4, col: 17 },
            to:     { index: 59, line: 4, col: 21 }
        },
        {
            value:  '}',
            type:   'bracets-close',
            from:   { index: 64, line: 5, col: 5 },
            to:     { index: 65, line: 5, col: 6 }
        },
        {
            value:  ';',
            type:   'sentence-end',
            from:   { index: 65, line: 5, col: 6 },
            to:     { index: 66, line: 5, col: 7 }
        }
        ]);
});