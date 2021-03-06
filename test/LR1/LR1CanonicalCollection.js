'use strict';

let LR1C = require('../../src/LR/LR1/LR1CanonicalCollection');
let {
    LR1Itemer
} = require('../../src/base/LR1Item');
let GO = require('../../src/LR/LR1/go');

let g2 = require('../fixture/grammer2');

let assert = require('assert');

let {
    forEach, contain
} = require('bolzano');

let jsoneq = require('cl-jsoneq');

let ctxFreeGrammer = require('../../src/base/ctxFreeGrammer');

describe('LR1CanonicalCollection', () => {
    it('index', () => {
        let grammer = ctxFreeGrammer(g2.grammer);
        let LR1Grammer = LR1Itemer(grammer);

        let ret = LR1C(grammer, LR1Grammer, GO(grammer, LR1Grammer));

        ret = ret.map(({items}) => items.map((v) => v.list()));

        assert.deepEqual(ret.length, g2.LR1C.length);

        forEach(ret, (item) => {
            assert.deepEqual(true, contain(g2.LR1C, item, {
                eq: jsoneq
            }));
        });
    });
});
