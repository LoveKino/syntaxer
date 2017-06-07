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
let LR1Item = require('../../src/base/LR1Item');

let testClosure = (g) => {
    let grammer = ctxFreeGrammer(g.grammer);

    forEach(g.LR1C, (item) => {
        assert.deepEqual(item, buildClosure([
            LR1Item.fromList(item[0], grammer)
        ], grammer).map(v => {
            return v.list();
        }));
    });
};

describe('LR1-closure', () => {
    it('index', () => {
        testClosure(g2);
    });

    it('g3:+', () => {
        let grammer = ctxFreeGrammer(g3.grammer);

        let ret = buildClosure([
            LR1Item.fromList(['S`', ['E'], 0, ['$']], grammer)
        ], grammer);

        assert.deepEqual([
            ['S`', ['E'], 0, ['$']],
            ['E', ['num'], 0, ['$', '+']],
            ['E', ['E', '+', 'num'], 0, ['$', '+']]
        ], ret.map(v => v.list()));
    });

    it('deep', () => {
        let grammer = ctxFreeGrammer(leftRecursion2.grammer);

        let ret = buildClosure([
            LR1Item.fromList(['S`', ['S'], 0, ['$']], grammer)
        ], grammer);

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
