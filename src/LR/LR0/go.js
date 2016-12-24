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
 *    [[head, body, dotPosition]
 *
 * @param X
 *    symbol
 *
 * @param productions
 */
module.exports = (I, X, productions) => {
    return CLOSURE(
        reduce(filter(I, ([head, body, dotPosition]) => body[dotPosition] === X), (prev, [head, body, dotPosition]) => { // eslint-disable-line
            if (body.length && dotPosition < body.length) {
                prev.push([
                    head, body, ++dotPosition
                ]);
            }

            return prev;
        }, []),
        productions
    );
};
