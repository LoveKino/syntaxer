'use strict';

let {
    reduce
} = require('bolzano');

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

    let itemsMap = {};
    for (let i = 0; i < items.length; i++) {
        itemsMap[items[i].serialize()] = true;
    }

    while (true) { // eslint-disable-line
        let newAppendedItems = reduce(appendedItems, (prev, item) => {
            let newItems = LR1Grammer.expandItem(item);
            return prev.concat(newItems);
        }, []);

        let noRepeatedNewItems = [];

        for (let i = 0; i < newAppendedItems.length; i++) {
            let item = newAppendedItems[i];
            let itemId = item.serialize();

            if (!itemsMap[itemId]) {
                noRepeatedNewItems.push(item);
                itemsMap[item.serialize()] = true;
            }
        }

        if (!noRepeatedNewItems.length) break;

        items = items.concat(noRepeatedNewItems);
        appendedItems = noRepeatedNewItems;
    }

    let serializedText = JSON.stringify(Object.keys(itemsMap).sort());

    return {
        items: LR1Grammer.compressItemSet(items),
        itemsMap,
        serializedText
    };
};

let sameClosure = (closure1, closure2) => closure1.serializedText === closure2.serializedText;

module.exports = {
    buildClosure,
    sameClosure
};
