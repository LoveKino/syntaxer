'use strict';

let LR1CanonicalCollection = require('./LR1CanonicalCollection');
let {
    forEach, findIndex
} = require('bolzano');
let GO = require('./go');
let {
    LR1Itemer
} = require('../../base/LR1Item');
let {
    sameClosure
} = require('./closure');

module.exports = (grammer) => {
    let {
        END_SYMBOL, isTerminalSymbol, N
    } = grammer;

    let ACTION = [], // action table
        GOTO = []; // goto table

    let LR1Grammer = LR1Itemer(grammer);

    let C = LR1CanonicalCollection(grammer, LR1Grammer);

    forEach(C, (I, index) => {
        ACTION[index] = ACTION[index] || {};

        // item = [head, body, dotPosition, forwards]

        forEach(I.items, (item) => {
            // [S`→ S., $] ϵ Ii
            if (LR1Grammer.isAcceptItem(item)) {
                //
                ACTION[index][END_SYMBOL] = {
                    type: 'accept'
                };
            } else if (item.isReduceItem()) { // [A → α., a] ϵ Ii, A≠S`
                forEach(item.getForwards(), (a) => {
                    ACTION[index][a] = {
                        type: 'reduce',
                        production: item.getProduction()
                    };
                });
            } else if (isTerminalSymbol(item.getNextSymbol())) {
                let Ij = GO(I, item.getNextSymbol(), grammer, LR1Grammer);

                if (Ij && Ij.items.length) {
                    ACTION[index][item.getNextSymbol()] = {
                        type: 'shift',
                        state: getStateIndex(C, Ij)
                    };
                }
            }
        });
    });

    forEach(C, (I, index) => {
        GOTO[index] = GOTO[index] || {};
        forEach(N, (A) => {
            let Ij = GO(I, A, grammer, LR1Grammer);
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
