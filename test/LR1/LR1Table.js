'use strict';

let g2 = require('../fixture/grammer2');

let LR1Table = require('../../src/LR/LR1/LR1Table');

let assert = require('assert');

describe('LR1Table', () => {
    it('index', () => {
        let a = LR1Table(g2.grammer);
        assert.deepEqual(a, g2.LR1Table);
    });
});
