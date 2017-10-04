'use strict';

let First = require('../../src/base/first');

let assert = require('assert');

let g1 = require('../fixture/grammer1');

let ctxFreeGrammer = require('../../src/base/ctxFreeGrammer');

describe('first', () => {
    it('index', () => {
        let grammer = ctxFreeGrammer(g1);
        let first = First(grammer);

        assert.deepEqual({
                '(': 1,
                'id': 1
            },
            first('E', grammer)
        );

        assert.deepEqual({
                '(': 1,
                'id': 1
            },
            first('T', grammer)
        );

        assert.deepEqual({
                '(': 1,
                'id': 1
            },
            first('F', grammer)
        );

        assert.deepEqual({
                '+': 1,
                'EPSILON': 1
            },
            first('E`', grammer)
        );

        assert.deepEqual({
                '*': 1,
                'EPSILON': 1
            },
            first('T`', grammer)
        );
    });
});
