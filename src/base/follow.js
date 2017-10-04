'use strict';

/**
 * FOLLOW(A) = { a | S *⇒ ...Aa..., a ϵ T }
 *
 * if S *⇒ ...A, then make $ ϵ FOLLOW(A)
 *
 * using null stands for $
 */

// if A → αBβ, Follow(B) += First(β) - {ε}

/**
 * generate follow map
 */
module.exports = (grammer, first) => {
    let map = {};

    map[grammer.startSymbol] = {};
    map[grammer.startSymbol][grammer.END_SYMBOL] = 1;


    let added = 1;
    while (added) { // eslint-disable-line
        added = 0;

        grammer.productions.forEach((production) => { // eslint-disable-line
            let head = grammer.getHead(production);
            let body = grammer.getBody(production);

            body.forEach((item, index) => {
                if (grammer.isNoneTerminalSymbol(item)) {
                    let firstRest = first(body.slice(index + 1), grammer);
                    map[item] = map[item] || {};

                    for (let name in firstRest) {
                        if (name !== grammer.EPSILON) { // except epsilon
                            if (!map[item][name]) {
                                added++;
                                map[item][name] = 1;
                            }
                        }
                    }

                    // β *⇒ ε
                    if (firstRest[grammer.EPSILON] ||
                        index === body.length - 1) {
                        for (let name in (map[head] || {})) {
                            if (!map[item][name]) {
                                added++;
                                map[item][name] = 1;
                            }
                        }
                    }
                }
            });
        });
    }

    return map;
};
