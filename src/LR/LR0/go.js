'use strict';

let {
    reduce, filter
} = require('bolzano');

let CLOSURE = require('./closure');

/**
 * jump
 *
 * A→αX.β => A→α.Xβ
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
