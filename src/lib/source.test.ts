import test from 'node:test';
import { Source } from './source.ts';

test('new Source(...);', (t: test.TestContext) => {
    const source = new Source('fo🫠\nbar');
    t.assert.deepStrictEqual(source.at(0),  { index: 0, line: 1, col: 1, char: 'f', });
    t.assert.deepStrictEqual(source.at(1),  { index: 1, line: 1, col: 2, char: 'o', });
    t.assert.deepStrictEqual(source.at(2),  { index: 2, line: 1, col: 3, char: '🫠' });
    t.assert.deepStrictEqual(source.at(3),  { index: 3, line: 1, col: 4, char: '\n' });
    t.assert.deepStrictEqual(source.at(4),  { index: 4, line: 2, col: 1, char: 'b', });
    t.assert.deepStrictEqual(source.at(5),  { index: 5, line: 2, col: 2, char: 'a', });
    t.assert.deepStrictEqual(source.at(6),  { index: 6, line: 2, col: 3, char: 'r', });
    t.assert.deepStrictEqual(source.at(7),  undefined);
    
    t.assert.deepStrictEqual(source.at(-8), undefined);
    t.assert.deepStrictEqual(source.at(-7), { index: 0, line: 1, col: 1, char: 'f', });
    t.assert.deepStrictEqual(source.at(-6), { index: 1, line: 1, col: 2, char: 'o', });
    t.assert.deepStrictEqual(source.at(-5), { index: 2, line: 1, col: 3, char: '🫠' });
    t.assert.deepStrictEqual(source.at(-4), { index: 3, line: 1, col: 4, char: '\n' });
    t.assert.deepStrictEqual(source.at(-3), { index: 4, line: 2, col: 1, char: 'b', });
    t.assert.deepStrictEqual(source.at(-2), { index: 5, line: 2, col: 2, char: 'a', });
    t.assert.deepStrictEqual(source.at(-1), { index: 6, line: 2, col: 3, char: 'r', });
});

test('Source.slice', (t: test.TestContext) => {
    const source = new Source('fo🫠\nbar');
    t.assert.deepStrictEqual(source.slice(0, 3), {
        value:  'fo🫠',
        from:   { index: 0, line: 1, col: 1 },
        to:     { index: 3, line: 1, col: 4 }
    });

    t.assert.deepStrictEqual(source.slice(0, 666), {
        value:  'fo🫠\nbar',
        from:   { index: 0, line: 1, col: 1 },
        to:     { index: 7, line: 2, col: 4 }
    });

    t.assert.deepStrictEqual(source.slice(0), {
        value:  'fo🫠\nbar',
        from:   { index: 0, line: 1, col: 1 },
        to:     { index: 7, line: 2, col: 4 }
    });

    t.assert.deepStrictEqual(source.slice(0, -666), {
        value:  '',
        from:   { index: 0, line: 1, col: 1 },
        to:     { index: 0, line: 1, col: 1 }
    });

    t.assert.deepStrictEqual(source.slice(4, 7), {
        value:  'bar',
        from:   { index: 4, line: 2, col: 1 },
        to:     { index: 7, line: 2, col: 4 }
    });

    t.assert.deepStrictEqual(source.slice(4, 666), {
        value:  'bar',
        from:   { index: 4, line: 2, col: 1 },
        to:     { index: 7, line: 2, col: 4 }
    });

    t.assert.deepStrictEqual(source.slice(4), {
        value:  'bar',
        from:   { index: 4, line: 2, col: 1 },
        to:     { index: 7, line: 2, col: 4 }
    });

    t.assert.deepStrictEqual(source.slice(4, -666), {
        value:  '',
        from:   { index: 4, line: 2, col: 1 },
        to:     { index: 4, line: 2, col: 1 }
    });

    t.assert.deepStrictEqual(source.slice(-3, 7), {
        value:  'bar',
        from:   { index: 4, line: 2, col: 1 },
        to:     { index: 7, line: 2, col: 4 }
    });

    t.assert.deepStrictEqual(source.slice(-3, 666), {
        value:  'bar',
        from:   { index: 4, line: 2, col: 1 },
        to:     { index: 7, line: 2, col: 4 }
    });

    t.assert.deepStrictEqual(source.slice(-3), {
        value:  'bar',
        from:   { index: 4, line: 2, col: 1 },
        to:     { index: 7, line: 2, col: 4 }
    });

    t.assert.deepStrictEqual(source.slice(-3, -666), {
        value:  '',
        from:   { index: 4, line: 2, col: 1 },
        to:     { index: 4, line: 2, col: 1 }
    });

    t.assert.deepStrictEqual(source.slice(666), {
        value:  '',
        from:   { index: 7, line: 2, col: 4 },
        to:     { index: 7, line: 2, col: 4 }
    });

    t.assert.deepStrictEqual(source.slice(666, 999), {
        value:  '',
        from:   { index: 7, line: 2, col: 4 },
        to:     { index: 7, line: 2, col: 4 }
    });
});

test('Source.sub', (t: test.TestContext) => {
    const source = new Source('fo🫠\nbar');

    t.assert.deepStrictEqual(source.sub(0, 3), {
        value:  'fo🫠',
        from:   { index: 0, line: 1, col: 1 },
        to:     { index: 3, line: 1, col: 4 }
    });

    t.assert.deepStrictEqual(source.sub(0, 666), {
        value:  'fo🫠\nbar',
        from:   { index: 0, line: 1, col: 1 },
        to:     { index: 7, line: 2, col: 4 }
    });

    t.assert.deepStrictEqual(source.sub(0), {
        value:  'fo🫠\nbar',
        from:   { index: 0, line: 1, col: 1 },
        to:     { index: 7, line: 2, col: 4 }
    });

    t.assert.deepStrictEqual(source.sub(0, -666), {
        value:  '',
        from:   { index: 0, line: 1, col: 1 },
        to:     { index: 0, line: 1, col: 1 }
    });

    t.assert.deepStrictEqual(source.sub(4, 3), {
        value:  'bar',
        from:   { index: 4, line: 2, col: 1 },
        to:     { index: 7, line: 2, col: 4 }
    });

    t.assert.deepStrictEqual(source.sub(4, 666), {
        value:  'bar',
        from:   { index: 4, line: 2, col: 1 },
        to:     { index: 7, line: 2, col: 4 }
    });

    t.assert.deepStrictEqual(source.sub(4), {
        value:  'bar',
        from:   { index: 4, line: 2, col: 1 },
        to:     { index: 7, line: 2, col: 4 }
    });

    t.assert.deepStrictEqual(source.sub(-3, 3), {
        value:  'bar',
        from:   { index: 4, line: 2, col: 1 },
        to:     { index: 7, line: 2, col: 4 }
    });

    t.assert.deepStrictEqual(source.sub(-666, 3), {
        value:  'fo🫠',
        from:   { index: 0, line: 1, col: 1 },
        to:     { index: 3, line: 1, col: 4 }
    });

    t.assert.deepStrictEqual(source.sub(666, 3), {
        value:  '',
        from:   { index: 7, line: 2, col: 4 },
        to:     { index: 7, line: 2, col: 4 }
    });

    t.assert.deepStrictEqual(source.sub(666, 999), {
        value:  '',
        from:   { index: 7, line: 2, col: 4 },
        to:     { index: 7, line: 2, col: 4 }
    });

    // Sanity check: weird lengths are treated as empty.
    t.assert.deepStrictEqual(source.sub(0, Number.NaN), {
        value:  '',
        from:   { index: 0, line: 1, col: 1 },
        to:     { index: 0, line: 1, col: 1 }
    });
});