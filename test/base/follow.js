'use strict';

let follow = require('../../src/base/follow');
let First = require('../../src/base/first');

let g1 = require('../fixture/grammer1');

let ctxFreeGrammer = require('../../src/base/ctxFreeGrammer');

let assert = require('assert');

describe('follow', () => {
    it('index', () => {
        let grammer = ctxFreeGrammer(g1);
        let first = First(grammer);
        let map = follow(grammer, first);

        assert.deepEqual(map, {
            E: {
                '$': 1,
                ')': 1
            },
            T: {
                '+': 1,
                '$': 1,
                ')': 1
            },
            'E`': {
                '$': 1,
                ')': 1
            },
            F: {
                '*': 1,
                '+': 1,
                '$': 1,
                ')': 1
            },
            'T`': {
                '+': 1,
                '$': 1,
                ')': 1
            }
        });
    });
});
