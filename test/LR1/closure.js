'use strict';

let g2 = require('../fixture/grammer2');
let assert = require('assert');
let {
    forEach
} = require('bolzano');
let closure = require('../../src/LR/LR1/closure');

describe('LR1-closure', () => {
    it('index', () => {
        let {
            T, N, productions
        } = g2.grammer;

        forEach(g2.LR1C, (item) => {
            assert.deepEqual(item, closure([
                item[0]
            ], T, N, productions));
        });
    });
});
