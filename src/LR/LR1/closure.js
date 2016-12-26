'use strict';

let {
    reduce, filter, union, map, findIndex
} = require('bolzano');
let first = require('../../base/first');
let jsoneq = require('cl-jsoneq');

let {
    isTerminalSymbol, getProductions, rest, getNextSymbol
} = require('../../base/util');

let {
    END_SYMBOL
} = require('../../base/constant');

/**
 *
 *  valide LR(1) item: LR(1) item [A→α.β, a] is valide for prefix ρ=δα, if exists:
 *      S *⇒ δAω ⇒ δαβω
 *
 * inference: if [A→α.Bβ,a] is valide for ρ=δα, and B→θ is a production, then for any b ϵ FIRST(βa), [B→.θ,b] is valide for predix ρ=δα
 *
 * LR(1) item: [head, body, dotPosition, [...forward]]
 */

module.exports = (I, T, N, productions) => {
    let closure = I;

    while (true) { // eslint-disable-line
        let newI = reduce(closure, (prev, item) => {
            let [head, body, dotPosition, a] = item; // eslint-disable-line
            let next = getNextSymbol(item);
            if (!next) return prev;
            let ps = getProductions(next, productions);

            let forwards = reduce(a, (prev, letter) => {
                return union(prev,
                    filter(
                        first(rest(body, dotPosition).concat([letter]), T, N, productions), //
                        (symbol) => isTerminalSymbol(symbol, T) // terminal
                    )
                );
            }, []);

            let infer = reduce(ps, (pre, [head, body]) => {
                if (!forwards.length && a.length === 1 && a[0] === END_SYMBOL) { // rest = ε && a = $
                    return union(pre, [
                        [head, body, 0, [END_SYMBOL]]
                    ], {
                        eq: jsoneq
                    });
                }

                return union(pre, map(forwards, (b) => {
                    return [head, body, 0, [b]];
                }), {
                    eq: jsoneq
                });
            }, []);

            return union(prev, infer, {
                eq: jsoneq
            });
        }, closure.slice(0));

        // compact
        newI = reduce(newI, (prev, [head, body, dotPosition, forwards]) => {
            let itemIndex = findIndex(prev, (v) => {
                return jsoneq(v.slice(0, -1), [head, body, dotPosition]);
            });
            if (itemIndex !== -1) {
                prev[itemIndex][3] = union(prev[itemIndex][3], forwards);
            } else {
                prev.push([head, body, dotPosition, forwards]);
            }

            return prev;
        }, []);

        if (getSum(newI) === getSum(closure)) break; // no more
        closure = newI;
    }

    return closure;
};

let getSum = (I) => {
    return reduce(I, (prev, item) => {
        return prev + item[3].length;
    }, 0);
};
