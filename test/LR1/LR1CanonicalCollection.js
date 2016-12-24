'use strict';

let LR1C = require('../../src/LR/LR1/LR1CanonicalCollection');

let g2 = require('../fixture/grammer2');

let assert = require('assert');

let {
    forEach, contain
} = require('bolzano');

let jsoneq = require('cl-jsoneq');

describe('LR1CanonicalCollection', () => {
    it('index', () => {
        let {
            N, T, productions, start
        } = g2.grammer;

        let ret = LR1C({
            start,
            T, N,
            productions
        });

        assert.deepEqual(ret.length, g2.LR1C.length);

        forEach(ret, (item) => {
            assert.deepEqual(true, contain(g2.LR1C, item, {
                eq: jsoneq
            }));
        });
    });
});
