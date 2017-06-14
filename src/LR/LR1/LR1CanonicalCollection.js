'use strict';

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
module.exports = (grammer, LR1Grammer, go) => {
    let {
        symbols
    } = grammer;

    let C = [
        buildClosure([
            LR1Grammer.initItem(grammer)
        ], grammer, LR1Grammer)
    ];

    while (true) { // eslint-disable-line
        // for every item
        let newC = reduce(C, (prev, I) => {
            // for every symbol
            return reduce(symbols, (pre, X) => {
                let newState = go(I, X);

                if (newState && newState.items.length && !contain(C, newState, {
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
