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

module.exports = (startSymbol, T, N, productions) => {
    let map = {};

    map[startSymbol] = [null];

    let oldLen = getNum(map);

    while (true) { // eslint-disable-line
        forEach(productions, ([head, body]) => { // eslint-disable-line
            forEach(body, (item, index) => {
                if (contain(N, item)) {
                    let firstRest = first(body.slice(index + 1), T, N, productions);
                    map[item] = union(map[item] || [], difference(firstRest, [null]));
                    // β *⇒ ε
                    if (contain(firstRest, null) || index === body.length - 1) {
                        map[item] = union(map[item], map[head] || []);
                    }
                }
            });
        });
        let newLen = getNum(map);

        if (newLen === oldLen) break;

        oldLen = newLen;
    }

    return map;
};

let getNum = (map) => {
    return reduce(map, (prev, list) => prev + list.length, 0);
};
