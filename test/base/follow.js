'use strict';

let follow = require('../../src/base/follow');

let g1 = require('../fixture/grammer1');

let assert = require('assert');

describe('follow', () => {
    it('index', () => {
        let map = follow(g1.startSymbol, g1.T, g1.N, g1.productions);

        assert.deepEqual(map, {
            E: ['$', ')'],
            T: ['+', '$', ')'],
            'E`': ['$', ')'],
            F: ['*', '+', '$', ')'],
            'T`': ['+', '$', ')']
        });
    });
});
