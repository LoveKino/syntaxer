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
module.exports = (grammer, LR1Grammer) => {
    let getStartItems = (I, X) => {
        let nextSymbolX = filter(I.items, (item) => {
            return item.getNextSymbol() === X;
        });

        let startItems = reduce(nextSymbolX, (prev, item) => { // eslint-disable-line
            if (item.restIsNotEmpty()) {
                prev.push(item.nextPositionItem());
            }

            return prev;
        }, []);

        return startItems;
    };

    return (I, X) => {
        let startItems = null;

        I.cache_startItems = I.cache_startItems || {};

        if (I.cache_startItems[X]) {
            startItems = I.cache_startItems[X];
        } else {
            startItems = getStartItems(I, X);
            I.cache_startItems[X] = startItems;
        }

        return buildClosure(
            startItems,

            grammer,

            LR1Grammer
        );
    };
};
