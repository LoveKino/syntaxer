'use strict';

let assert = require('assert');

let GO = require('../../src/LR/LR0/go');

let g0 = require('../fixture/grammer0');

let state = (grammer, X, from, to) => {
    assert.deepEqual(
        GO(grammer.LR0C[from], X, g0.grammer.productions),
        g0.LR0C[to]
    );
};

describe('go', () => {
    it('grammer0', () => {
        state(g0, 'S', 0, 1);
        state(g0, 'a', 0, 2);
        state(g0, 'b', 0, 3);
        state(g0, 'A', 2, 4);
        state(g0, 'c', 2, 5);
        state(g0, 'd', 2, 6);
        state(g0, 'B', 3, 7);
        state(g0, 'c', 3, 8);
        state(g0, 'd', 3, 9);
        state(g0, 'A', 5, 10);
        state(g0, 'c', 5, 5);
        state(g0, 'd', 5, 6);
        state(g0, 'B', 8, 11);
        state(g0, 'c', 8, 8);
        state(g0, 'd', 8, 9);
    });
});
