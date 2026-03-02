import { Lexer, Source } from '@lib/index.ts';

const tokenizerConstructors = await Promise.all([
    import('@tokenizers/bracets-open.tokenizer.ts').then(x => x.default),
    import('@tokenizers/bracets-close.tokenizer.ts').then(x => x.default),
    import('@tokenizers/brackets-open.tokenizer.ts').then(x => x.default),
    import('@tokenizers/brackets-close.tokenizer.ts').then(x => x.default),
    import('@tokenizers/parenthesis-open.tokenizer.ts').then(x => x.default),
    import('@tokenizers/parenthesis-close.tokenizer.ts').then(x => x.default),
    import('@tokenizers/colon.tokenizer.ts').then(x => x.default),
    import('@tokenizers/comma.tokenizer.ts').then(x => x.default),
    import('@tokenizers/period.tokenizer.ts').then(x => x.default),
    import('@tokenizers/semicolon.tokenizer.ts').then(x => x.default),
    import('@tokenizers/export.tokenizer.ts').then(x => x.default),
    import('@tokenizers/default.tokenizer.ts').then(x => x.default),
    import('@tokenizers/type.tokenizer.ts').then(x => x.default),
    import('@tokenizers/interface.tokenizer.ts').then(x => x.default),
    import('@tokenizers/boolean.tokenizer.ts').then(x => x.default),
    import('@tokenizers/identifier.tokenizer.ts').then(x => x.default),
    import('@tokenizers/string.tokenizer.ts').then(x => x.default),
    import('@tokenizers/number.tokenizer.ts').then(x => x.default),
    import('@tokenizers/trivia.tokenizer.ts').then(x => x.default),
]);

export class BleedJSONLexer extends Lexer<typeof tokenizerConstructors> {
    constructor() {
        super(tokenizerConstructors);
    }

    override tokenize(source: string | Source) {
        return super
            .tokenize(source)
            .filter(x => x.type !== 'trivia');
    }
}