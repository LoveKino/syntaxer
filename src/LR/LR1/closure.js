'use strict';

let {
    reduce, map, findIndex, flat
} = require('bolzano');
let jsoneq = require('cl-jsoneq');
let LR1Item = require('../../base/LR1Item');

/**
 *
 *  valide LR(1) item: LR(1) item [A→α.β, a] is valide for prefix ρ=δα, if exists:
 *      S *⇒ δAω ⇒ δαβω
 *
 * inference: if [A→α.Bβ,a] is valide for ρ=δα, and B→θ is a production, then for any b ϵ FIRST(βa), [B→.θ,b] is valide for predix ρ=δα
 *
 * LR(1) item: [head, body, dotPosition, [...forward]]
 */

let buildClosure = (I, grammer) => {
    let closure = I;

    while (true) { // eslint-disable-line
        let newI = expand(closure, grammer);

        if (getSum(newI) === getSum(closure)) break; // no more

        closure = newI;
    }

    return compress(closure);
};

let expand = (I, grammer) => {
    let {
        END_SYMBOL,
        isNoneTerminalSymbol,
        getProductionsOf
    } = grammer;

    return reduce(I, (prev, {
        getNextSymbol,
        getAdjoints,
        isReducedItem
    }) => {
        let next = getNextSymbol();

        if (!next || !isNoneTerminalSymbol(next)) return prev;

        return LR1Item.union(
            prev,

            flat(map(getProductionsOf(next), (production) => isReducedItem() ? [
                LR1Item.supItem(production, END_SYMBOL, grammer)
            ] : map(getAdjoints(), (b) => LR1Item.supItem(production, b, grammer))))
        );
    }, I.slice(0));
};

let compress = (I) => {
    return reduce(I, (prev, item) => {
        let itemIndex = findIndex(prev, (v) => {
            return jsoneq(v.list().slice(0, -1), item.list().slice(0, -1));
        });

        if (itemIndex !== -1) {
            // expand
            prev[itemIndex].concatForwards(item.getForwards());
        } else {
            prev.push(item);
        }

        return prev;
    }, []);
};

let getSum = (I) => {
    return reduce(I, (prev, item) => {
        return prev + item.getForwards().length;
    }, 0);
};

let sameClosure = (closure1, closure2) => {
    return jsoneq(map(closure1, (v) => v.list()), map(closure2, (v) => v.list()));
};

module.exports = {
    buildClosure,
    sameClosure
};
