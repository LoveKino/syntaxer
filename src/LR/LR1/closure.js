'use strict';

let {
    reduce, map, flat
} = require('bolzano');

let jsoneq = require('cl-jsoneq');

/**
 *
 * valide LR(1) item: LR(1) item [A→α.β, a] is valide for prefix ρ=δα, if exists:
 *      S *⇒ δAω ⇒ δαβω
 *
 * inference: if [A→α.Bβ,a] is valide for ρ=δα, and B→θ is a production, then for any b ϵ FIRST(βa), [B→.θ,b] is valide for predix ρ=δα
 *
 * LR(1) item: [head, body, dotPosition, [...forward]]
 *
 * important: when closure is builded, it's immutable
 */

let buildClosure = (items, grammer, LR1Grammer) => {
    while (true) { // eslint-disable-line
        let newI = expand(items, grammer, LR1Grammer);

        if (getSum(newI) === getSum(items)) break; // no more

        items = newI;
    }

    return {
        items: LR1Grammer.compressItemSet(items)
    };
};

let expand = (I, grammer, LR1Grammer) => {
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

        return LR1Grammer.unionLR1Items(
            prev,

            flat(map(getProductionsOf(next), (production) => isReducedItem() ? [
                LR1Grammer.supItem(production, END_SYMBOL, grammer)
            ] : map(getAdjoints(), (b) => LR1Grammer.supItem(production, b, grammer))))
        );
    }, I.slice(0));
};

let getSum = (I) => {
    return reduce(I, (prev, item) => {
        return prev + item.getForwards().length;
    }, 0);
};

let sameClosure = (closure1, closure2) => {
    return jsoneq(map(closure1.items, (v) => v.list()), map(closure2.items, (v) => v.list()));
};

module.exports = {
    buildClosure,
    sameClosure
};
