'use strict';

let LR1Item = require('../../base/LR1Item');
let GO = require('./go');
let {
    buildClosure, sameClosure
} = require('./closure');
let {
    reduce, contain
} = require('bolzano');

/**
 * input: grammer G
 *
 * output: LR(0) canonical collection
 *
 * item = [head, body, dotPosition];
 *
 * item set = [viable prefix, items]
 */
module.exports = (grammer) => {
    let {
        symbols
    } = grammer;

    let C = [
        buildClosure([
            LR1Item.initItem(grammer)
        ], grammer)
    ];

    while (true) { // eslint-disable-line
        // for every item
        let newC = reduce(C, (prev, I) => {
            // for every symbol
            return reduce(symbols, (pre, X) => {
                let newState = GO(I, X, grammer);

                if (newState && newState.length && !contain(C, newState, {
                    eq: sameClosure
                })) {
                    pre.push(newState);
                }
                return pre;
            }, prev);
        }, C.slice(0));

        if (newC.length === C.length) break; // no more items
        C = newC;
    }

    return C;
};
