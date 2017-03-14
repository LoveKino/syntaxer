'use strict';

let {
    reduce, filter
} = require('bolzano');

let {
    buildClosure
} = require('./closure');

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
module.exports = (I, X, grammer) => {
    return buildClosure(
        reduce(filter(I, (item) => {
            return item.getNextSymbol() === X;
        }), (prev, item) => { // eslint-disable-line
            if (item.restIsNotEmpty()) {
                prev.push(item.nextPositionItem());
            }

            return prev;
        }, []),

        grammer
    );
};
