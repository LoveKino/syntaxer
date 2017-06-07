'use strict';

let GO = require('../../src/LR/LR1/go');
let g2 = require('../fixture/grammer2');
let leftRecursion3 = require('../fixture/leftRecursion3');
let ctxFreeGrammer = require('../../src/base/ctxFreeGrammer');
let LR1Item = require('../../src/base/LR1Item');
let {
    buildClosure
} = require('../../src/LR/LR1/closure');

let assert = require('assert');

let state = (g, X, from, to) => {
    let grammer = ctxFreeGrammer(g.grammer);

    let {
        LR1C
    } = g;

    assert.deepEqual(
        GO(
            LR1C[from].map(list => LR1Item.fromList(list, grammer)),
            X, grammer
        ).map(v => v.list()),

        LR1C[to]
    );
};

describe('LR(1):go', () => {
    it('index', () => {
        state(g2, 'c', 0, 1);
        state(g2, 'S', 0, 3);
        state(g2, 'C', 0, 4);
        state(g2, 'd', 0, 2);

        state(g2, 'C', 1, 5);
        state(g2, 'd', 1, 2);

        state(g2, 'C', 4, 8);
        state(g2, 'c', 4, 6);
        state(g2, 'd', 4, 7);

        state(g2, 'C', 1, 5);
        state(g2, 'd', 1, 2);
    });

    it('deep', () => {
        let grammer = ctxFreeGrammer(leftRecursion3.grammer);

        let ret = buildClosure([
            LR1Item.fromList(['S`', ['S'], 0, ['$']], grammer)
        ], grammer);

        let newState = GO(ret, '*', grammer);
        assert.deepEqual(newState.map(item => item.list()), [
            ['STATEMENT', ['*', 'LETTER'], 1, ['$', ';']],
            ['LETTER', ['a'], 0, ['$', ';']]
        ]);
    });
});
