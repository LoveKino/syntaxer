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
        let targetClosure = null;

        I.cache_GOTO = I.cache_GOTO || {};

        if (I.cache_GOTO[X]) {
            targetClosure = I.cache_GOTO[X];
        } else {
            let startItems = getStartItems(I, X);

            targetClosure = buildClosure(
                startItems,

                grammer,

                LR1Grammer
            );

            I.cache_GOTO[X] = targetClosure;
        }

        return targetClosure;
    };
};
