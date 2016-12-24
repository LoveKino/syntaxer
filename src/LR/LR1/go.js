'use strict';

let {
    reduce, filter
} = require('bolzano');

let CLOSURE = require('./closure');

/**
 * jump
 *
 * A→αX.β => A→α.Xβ
 *
 * J = go(I, X) = closure({A→αX.β | A→α.Xβ ϵ I})
 *
 * if one viable prefix of A→αX.β  of I is ρ=δα, then A→α.Xβ in J has viable prefix δαX.
 *
 * @param I
 *    [head, body, dotPosition]
 *
 * @param X
 *    symbol
 *
 * @param productions
 */
module.exports = (I, X, T, N, productions) => {
    return CLOSURE(
        reduce(filter(I, (item) => item[1][item[2]] === X), (prev, item) => { // eslint-disable-line
            if (item[1].length && item[2] < item[1].length) {
                let newItem = item.slice(0);
                newItem[2] += 1;
                prev.push(newItem);
            }

            return prev;
        }, []),
        T,
        N,
        productions
    );
};
