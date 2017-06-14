'use strict';

let {
    LR1Itemer
} = require('../../src/base/LR1Item');
let GO = require('../../src/LR/LR1/go');
let g2 = require('../fixture/grammer2');
let leftRecursion3 = require('../fixture/leftRecursion3');
let ctxFreeGrammer = require('../../src/base/ctxFreeGrammer');
let {
    buildClosure
} = require('../../src/LR/LR1/closure');

let assert = require('assert');

let state = (g, X, from, to) => {
    let grammer = ctxFreeGrammer(g.grammer);

    let {
        LR1C
    } = g;

    let LR1Grammer = LR1Itemer(grammer);

    assert.deepEqual(
        GO(
            LR1C[from].map(list => LR1Grammer.fromList(list, grammer)),
            X, grammer, LR1Grammer
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

        let LR1Grammer = LR1Itemer(grammer);

        let ret = buildClosure([
            LR1Grammer.fromList(['S`', ['S'], 0, ['$']], grammer)
        ], grammer, LR1Grammer);

        let newState = GO(ret, '*', grammer, LR1Grammer);
        assert.deepEqual(newState.map(item => item.list()), [
            ['STATEMENT', ['*', 'LETTER'], 1, ['$', ';']],
            ['LETTER', ['a'], 0, ['$', ';']]
        ]);
    });
});
