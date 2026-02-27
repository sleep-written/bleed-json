import { Scanner } from './scanner.ts';
import test from 'node:test';

test('Scanner.peekIf', (t: test.TestContext) => {
    const scanner = new Scanner('666999');
    t.assert.deepStrictEqual(
        scanner.peekIf('666'),
        {
            value:  '666',
            from:   { index: 0, line: 1, col: 1 },
            to:     { index: 3, line: 1, col: 4 }
        }
    );

    t.assert.strictEqual(scanner.index, 0);
});

test('Scanner.peekWhile', (t: test.TestContext) => {
    const scanner = new Scanner('666hhh');
    t.assert.deepStrictEqual(
        scanner.peekWhile(c => c >= '0' && c <= '9'),
        {
            value:  '666',
            from:   { index: 0, line: 1, col: 1 },
            to:     { index: 3, line: 1, col: 4 }
        }
    );

    t.assert.strictEqual(scanner.index, 0);
});

test('Scanner.peekWhile (with validation)', (t: test.TestContext) => {
    const scanner = new Scanner('666hhh');
    t.assert.deepStrictEqual(
        scanner.peekWhile(
            c => c >= '0' && c <= '9',
            v => parseInt(v) > 111
        ),
        {
            value:  '666',
            from:   { index: 0, line: 1, col: 1 },
            to:     { index: 3, line: 1, col: 4 }
        }
    );

    t.assert.strictEqual(scanner.index, 0);

    t.assert.deepStrictEqual(
        scanner.peekWhile(
            c => c >= '0' && c <= '9',
            v => parseInt(v) > 999
        ),
        undefined
    );

    t.assert.strictEqual(scanner.index, 0);
});

test('Scanner.consume', (t: test.TestContext) => {
    const scanner = new Scanner('666hhh');
    t.assert.deepStrictEqual(
        scanner.consume(3),
        {
            value:  '666',
            from:   { index: 0, line: 1, col: 1 },
            to:     { index: 3, line: 1, col: 4 }
        }
    );

    t.assert.deepStrictEqual(
        scanner.consume(3),
        {
            value:  'hhh',
            from:   { index: 3, line: 1, col: 4 },
            to:     { index: 6, line: 1, col: 7 }
        }
    );

    t.assert.ok(scanner.eof);

    t.assert.deepStrictEqual(
        scanner.consume(-3),
        {
            value:  'hhh',
            from:   { index: 6, line: 1, col: 7 },
            to:     { index: 3, line: 1, col: 4 }
        }
    );

    t.assert.strictEqual(scanner.index, 3);
});