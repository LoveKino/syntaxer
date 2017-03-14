'use strict';

let follow = require('../../src/base/follow');

let g1 = require('../fixture/grammer1');

let ctxFreeGrammer = require('../../src/base/ctxFreeGrammer');

let assert = require('assert');

describe('follow', () => {
    it('index', () => {
        let grammer = ctxFreeGrammer(g1);
        let map = follow(grammer);

        assert.deepEqual(map, {
            E: ['$', ')'],
            T: ['+', '$', ')'],
            'E`': ['$', ')'],
            F: ['*', '+', '$', ')'],
            'T`': ['+', '$', ')']
        });
    });
});
