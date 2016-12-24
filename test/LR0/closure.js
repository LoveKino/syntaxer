'use strict';

let closure = require('../../src/LR/LR0/closure');

let assert = require('assert');

let {
    forEach
} = require('bolzano');

let g0 = require('../fixture/grammer0');

describe('closure', () => {
    it('first expand production', () => {
        assert.deepEqual(g0.LR0C[0], closure([
            ['S`', ['S'], 0]
        ], g0.grammer.productions));
    });

    it('base', () => {
        forEach(g0.LR0C, (item) => {
            assert.deepEqual(item, closure([
                item[0]
            ], g0.grammer.productions));
        });
    });
});
