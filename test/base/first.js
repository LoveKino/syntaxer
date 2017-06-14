'use strict';

let First = require('../../src/base/first');

let assert = require('assert');

let g1 = require('../fixture/grammer1');

let ctxFreeGrammer = require('../../src/base/ctxFreeGrammer');

describe('first', () => {
    it('index', () => {
        let grammer = ctxFreeGrammer(g1);
        let first = First(grammer);

        assert.deepEqual(
            ['(', 'id'],
            first('E', grammer)
        );

        assert.deepEqual(
            ['(', 'id'],
            first('T', grammer)
        );

        assert.deepEqual(
            ['(', 'id'],
            first('F', grammer)
        );

        assert.deepEqual(
            ['+', null],
            first('E`', grammer)
        );

        assert.deepEqual(
            ['*', null],
            first('T`', grammer)
        );
    });
});
