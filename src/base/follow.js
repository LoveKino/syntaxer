'use strict';

let {
    contain, forEach, difference, union, reduce
} = require('bolzano');

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

    map[grammer.startSymbol] = [grammer.END_SYMBOL];

    let oldLen = getNum(map);

    while (true) { // eslint-disable-line
        forEach(grammer.productions, (production) => { // eslint-disable-line
            let head = grammer.getHead(production);
            let body = grammer.getBody(production);

            forEach(body, (item, index) => {
                if (grammer.isNoneTerminalSymbol(item)) {
                    let firstRest = first(body.slice(index + 1), grammer);

                    map[item] = union(map[item] || [], difference(firstRest, [grammer.EPSILON]));

                    // β *⇒ ε
                    if (contain(firstRest, grammer.EPSILON) ||
                        index === body.length - 1) {
                        map[item] = union(map[item], map[head] || []);
                    }
                }
            });
        });
        let newLen = getNum(map);

        if (newLen === oldLen) break; // no more follow

        oldLen = newLen;
    }

    return map;
};

let getNum = (map) => {
    return reduce(map, (prev, list) => prev + list.length, 0);
};
