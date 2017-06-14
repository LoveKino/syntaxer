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
        assert.deepEqual(item, buildClosure([
            LR1Grammer.fromList(item[0], grammer)
        ], grammer, LR1Grammer).map(v => {
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

        let LR1Grammer = LR1Itemer(grammer);
        let ret = buildClosure([
            LR1Grammer.fromList(['S`', ['E'], 0, ['$']], grammer)
        ], grammer, LR1Grammer);

        assert.deepEqual([
            ['S`', ['E'], 0, ['$']],
            ['E', ['num'], 0, ['$', '+']],
            ['E', ['E', '+', 'num'], 0, ['$', '+']]
        ], ret.map(v => v.list()));
    });

    it('deep', () => {
        let grammer = ctxFreeGrammer(leftRecursion2.grammer);

        let LR1Grammer = LR1Itemer(grammer);

        let ret = buildClosure([
            LR1Grammer.fromList(['S`', ['S'], 0, ['$']], grammer)
        ], grammer, LR1Grammer);

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
