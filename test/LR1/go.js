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

    let go = GO(grammer, LR1Grammer);
    assert.deepEqual(
        go({
            items: LR1C[from].map(list => getLR1Item(grammer, LR1Grammer, list))
        }, X).items.map(v => v.list()),

        LR1C[to]
    );
};

let getLR1Item = (grammer, LR1Grammer, firstItem) => {
    let index = getProductionIndex(grammer, firstItem);
    return LR1Grammer.fromList(
        index,
        firstItem[2],
        firstItem[3]);
};

let getProductionIndex = (grammer, firstItem) => {
    return grammer.productions.findIndex((v) => {
        return firstItem[0] === v[0] && JSON.stringify(firstItem[1]) === JSON.stringify(v[1])
    });
};

let getClosureItem = (grammer, firstItem) => {
    let LR1Grammer = LR1Itemer(grammer);
    return buildClosure([
        getLR1Item(grammer, LR1Grammer, firstItem)
    ], grammer, LR1Grammer);
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

        let ret = getClosureItem(grammer, ['S`', ['S'], 0, ['$']]);

        let newState = GO(grammer, LR1Grammer)(ret, '*');
        assert.deepEqual(newState.items.map(item => item.list()), [
            ['STATEMENT', ['*', 'LETTER'], 1, ['$', ';']],
            ['LETTER', ['a'], 0, ['$', ';']]
        ]);
    });
});
