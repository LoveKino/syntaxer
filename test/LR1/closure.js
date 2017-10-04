'use strict';

let g2 = require('../fixture/grammer2');
let g3 = require('../fixture/grammer3');
let leftRecursion2 = require('../fixture/leftRecursion2');
let assert = require('assert');
let {
    forEach
} = require('bolzano');
let {
    buildClosure
} = require('../../src/LR/LR1/closure');
let ctxFreeGrammer = require('../../src/base/ctxFreeGrammer');
let {
    LR1Itemer
} = require('../../src/base/LR1Item');

let testClosure = (g) => {
    let grammer = ctxFreeGrammer(g.grammer);
    let LR1Grammer = LR1Itemer(grammer);

    forEach(g.LR1C, (item) => {
        let firstItem = item[0];
        let index = getProductionIndex(grammer, firstItem);
        assert.deepEqual(item, getClosureItem(grammer, firstItem).items.map(v => {
            return v.list();
        }));
    });
};

let getClosureItem = (grammer, firstItem) => {
    let LR1Grammer = LR1Itemer(grammer);
    return buildClosure([
        getLR1Item(grammer, LR1Grammer, firstItem)
    ], grammer, LR1Grammer);
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

describe('LR1-closure', () => {
    it('index', () => {
        testClosure(g2);
    });

    it('g3:+', () => {
        let grammer = ctxFreeGrammer(g3.grammer);
        let ret = getClosureItem(grammer, ['S`', ['E'], 0, ['$']]).items;

        assert.deepEqual([
            ['S`', ['E'], 0, ['$']],
            ['E', ['num'], 0, ['$', '+']],
            ['E', ['E', '+', 'num'], 0, ['$', '+']]
        ], ret.map(v => v.list()));
    });

    it('deep', () => {
        let grammer = ctxFreeGrammer(leftRecursion2.grammer);
        let ret = getClosureItem(grammer, ['S`', ['S'], 0, ['$']]).items;

        assert.deepEqual(ret.map((v) => v.list()), [
            ['S`', ['S'], 0, ['$']],
            ['S', ['STATEMENTS'], 0, ['$']],
            ['STATEMENTS', ['STATEMENT'], 0, ['$']],
            ['STATEMENTS', ['STATEMENT', ';', 'STATEMENT'], 0, ['$']],
            ['STATEMENT', ['LETTER'], 0, ['$', ';']],
            ['STATEMENT', [], 0, ['$', ';']],
            ['LETTER', ['a'], 0, ['$', ';']]
        ]);
    });
});
