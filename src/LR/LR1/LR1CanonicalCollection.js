'use strict';

let {
    buildClosure
} = require('./closure');
let {
    reduce
} = require('bolzano');

/**
 * input: grammer G
 *
 * output: LR(0) canonical collection
 *
 * item = [head, body, dotPosition];
 *
 * item set = [viable prefix, items]
 */
module.exports = (grammer, LR1Grammer, go) => {
    let initClosure = buildClosure([
        LR1Grammer.initItem(grammer)
    ], grammer, LR1Grammer);

    let C = [initClosure];
    let canonicalCollectionMap = {};
    canonicalCollectionMap[initClosure.serializedText] = true;

    let appendedC = C;

    while (true) { // eslint-disable-line
        let newAppendedC = [];

        for (let i = 0; i < appendedC.length; i++) {
            let I = appendedC[i];
            let gotoSet = getGoToSymbolsSet(grammer.symbols, I, go);

            for (let j = 0; j < gotoSet.length; j++) {
                let state = gotoSet[j];
                let serializedText = state.serializedText;

                if (!canonicalCollectionMap[serializedText]) {
                    // add new state
                    newAppendedC.push(state);
                    canonicalCollectionMap[serializedText] = true;
                }
            }
        }

        if (!newAppendedC.length) break;

        appendedC = newAppendedC;
        C = C.concat(appendedC);
    }

    return C;
};

let getGoToSymbolsSet = (symbols, I, go) => {
    // for every symbol
    let set = reduce(symbols, (pre, X) => {
        let newState = go(I, X);

        if (newState && newState.items.length) {
            pre.push(newState);
        }
        return pre;
    }, []);

    return set;
};
