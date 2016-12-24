'use strict';

let first = require('../../src/base/first');

let assert = require('assert');

let g1 = require('../fixture/grammer1');

describe('first', () => {
    it('index', () => {
        assert.deepEqual(
            ['(', 'id'],
            first('E', g1.T, g1.N, g1.productions)
        );

        assert.deepEqual(
            ['(', 'id'],
            first('T', g1.T, g1.N, g1.productions)
        );

        assert.deepEqual(
            ['(', 'id'],
            first('F', g1.T, g1.N, g1.productions)
        );

        assert.deepEqual(
            ['+', null],
            first('E`', g1.T, g1.N, g1.productions)
        );

        assert.deepEqual(
            ['*', null],
            first('T`', g1.T, g1.N, g1.productions)
        );
    });
});
