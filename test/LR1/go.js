'use strict';

let GO = require('../../src/LR/LR1/go');
let g2 = require('../fixture/grammer2');
let assert = require('assert');

let state = (g, X, from, to) => {
    let {
        T, N, productions
    } = g.grammer;

    let {
        LR1C
    } = g;

    assert.deepEqual(
        GO(LR1C[from], X, T, N, productions),
        LR1C[to]
    );
};

describe('LR(1):go', () => {
    it('index', () => {
        state(g2, 'S', 0, 1);
        state(g2, 'C', 0, 2);
        state(g2, 'c', 0, 3);
        state(g2, 'd', 0, 4);
        state(g2, 'C', 2, 5);
        state(g2, 'd', 2, 7);
        state(g2, 'C', 3, 8);
        state(g2, 'c', 3, 3);
        state(g2, 'd', 3, 4);
        state(g2, 'C', 6, 9);
        state(g2, 'd', 6, 7);
    });
});
