'use strict';

let {
    reduce, filter, contain, union, map, find
} = require('bolzano');
let first = require('../../base/first');
let jsoneq = require('cl-jsoneq');

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
        let newI = reduce(closure, (prev, //
            [head, body, dotPosition, a] // eslint-disable-line
        ) => {
            let next = body[dotPosition];
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

            return union(prev, reduce(ps, (prev, [head, body]) => {
                if (!forwards.length && a.length === 1 && a[0] === null) { // rest = ε && a = $
                    return union(prev, [
                        [head, body, 0, [null]]
                    ], {
                        eq: jsoneq
                    });
                }
                return union(prev, map(forwards, (b) => {
                    return [head, body, 0, [b]];
                }), {
                    eq: jsoneq
                });
            }, []), {
                eq: jsoneq
            });
        }, closure.slice(0));

        // compact
        newI = reduce(newI, (prev, [head, body, dotPosition, forwards]) => {
            let item = find(prev, (v) => {
                return jsoneq(v.slice(0, -1), [head, body, dotPosition]);
            });
            if (item) {
                item[3] = union(item[3], forwards);
            } else {
                prev.push([head, body, dotPosition, forwards]);
            }

            return prev;
        }, []);

        if (newI.length === closure.length) break; // no more
        closure = newI;
    }

    return closure;
};

let rest = (body, dotPosition) => body.slice(dotPosition + 1);

let isTerminalSymbol = (symbol, T) => contain(T, symbol);

let getProductions = (noneTerminal, productions) => filter(productions, ([head]) => head === noneTerminal);
