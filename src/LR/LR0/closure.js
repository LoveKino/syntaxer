'use strict';

/**
 *
 * viable item
 *   A→β₁.β₂ is viable for viable prefix ρ=αβ₁, if exists:
 *      S *⇒ αAω ⇒ αβ₁β₂ω
 *
 * inference
 *   if A→α.Bβ is viable for ρ=δα, and B→θ is a produciton, then item B→.Θ is viable for ρ=δα too
 */

let {
    reduce, union, filter, map
} = require('bolzano');

let jsoneq = require('cl-jsoneq');

/**
 *
 * @param I Array
 *  I = [item]
 *  item = [head, body, dotPosition];
 *  body = [symbol]
 * @param productionMap
 *  productions = [production]
 *  production = [head, body]
 *  body = [symbol]
 *
 */
module.exports = (I, productions) => {
    let closure = I;

    while (true) { // eslint-disable-line
        let newI = reduce(closure, (prev, [_, body, dotPosition]) => { // eslint-disable-line
            let next = body[dotPosition];
            if (!next) return prev;
            return union(prev, map(filter(productions, ([head]) => head === next), ([head, body]) => [head, body, 0]), {
                eq: jsoneq
            });
        }, closure.slice(0));

        if (newI.length === closure.length) break; // no more
        closure = newI;
    }

    return closure;
};
