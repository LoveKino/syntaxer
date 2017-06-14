'use strict';

let {
    reduce, map, contain
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
    let appendedItems = items;

    while (true) { // eslint-disable-line
        let newAppendedItems = reduce(appendedItems, (prev, item) => {
            let newItems = LR1Grammer.expandItem(item);
            return prev.concat(newItems);
        }, []);

        let noRepeatedNewItems = [];

        for (let i = 0; i < newAppendedItems.length; i++) {
            let item = newAppendedItems[i];

            if (!contain(items, item, {
                eq: LR1Grammer.sameItem
            })) {
                noRepeatedNewItems.push(item);
            }
        }

        if (!noRepeatedNewItems.length) break;

        items = items.concat(noRepeatedNewItems);
        appendedItems = noRepeatedNewItems;
    }

    return {
        items: LR1Grammer.compressItemSet(items)
    };
};

let sameClosure = (closure1, closure2) => {
    return jsoneq(map(closure1.items, (v) => v.list()), map(closure2.items, (v) => v.list()));
};

module.exports = {
    buildClosure,
    sameClosure
};
