'use strict';

let LR1CanonicalCollection = require('./LR1CanonicalCollection');
let {
    findIndex
} = require('bolzano');
let GO = require('./go');
let {
    LR1Itemer
} = require('../../base/LR1Item');
let {
    sameClosure
} = require('./closure');
const {
    REDUCE,
    SHIFT,
    ACCEPT
} = require('../../base/constant');

module.exports = (grammer) => {
    let ACTION = [], // action table
        GOTO = []; // goto table

    let LR1Grammer = LR1Itemer(grammer);
    let go = GO(grammer, LR1Grammer);

    let C = LR1CanonicalCollection(grammer, LR1Grammer, go);

    C.forEach((I, index) => {
        ACTION[index] = ACTION[index] || {};

        // item = [head, body, dotPosition, forwards]

        I.items.forEach((item) => {
            // [S`→ S., $] ϵ Ii
            if (LR1Grammer.isAcceptItem(item)) {
                //
                ACTION[index][grammer.END_SYMBOL] = {
                    type: ACCEPT
                };
            } else if (item.isReduceItem()) { // [A → α., a] ϵ Ii, A≠S`
                item.forwards.forEach((a) => {
                    ACTION[index][a] = {
                        type: REDUCE,
                        pIndex: item.productionIndex // which production
                    };
                });
            } else if (grammer.isTerminalSymbol(item.getNextSymbol())) {
                let Ij = go(I, item.getNextSymbol());

                if (Ij && Ij.items.length) {
                    ACTION[index][item.getNextSymbol()] = {
                        type: SHIFT,
                        state: getStateIndex(C, Ij)
                    };
                }
            }
        });
    });

    C.forEach((I, index) => {
        GOTO[index] = GOTO[index] || {};
        grammer.N.forEach((A) => {
            let Ij = go(I, A);
            if (Ij && Ij.items.length) {
                GOTO[index][A] = getStateIndex(C, Ij);
            }
        });
    });

    return {
        GOTO,
        ACTION
    };
};

let getStateIndex = (C, I) => findIndex(C, I, {
    eq: sameClosure
});
