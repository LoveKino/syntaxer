'use strict';

let {
    contain, forEach, difference, union, reduce
} = require('bolzano');

let first = require('./first');

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
module.exports = (grammer) => {
    let {
        startSymbol, isNoneTerminalSymbol, EPSILON, productions, getBody, getHead, END_SYMBOL
    } = grammer;

    let map = {};

    map[startSymbol] = [END_SYMBOL];

    let oldLen = getNum(map);

    while (true) { // eslint-disable-line
        forEach(productions, (production) => { // eslint-disable-line
            let head = getHead(production);
            let body = getBody(production);

            forEach(body, (item, index) => {
                if (isNoneTerminalSymbol(item)) {
                    let firstRest = first(body.slice(index + 1), grammer);

                    map[item] = union(map[item] || [], difference(firstRest, [EPSILON]));

                    // β *⇒ ε
                    if (contain(firstRest, EPSILON) ||
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
