'use strict';

let LR1CanonicalCollection = require('./LR1CanonicalCollection');
let jsoneq = require('cl-jsoneq');
let {
    forEach, findIndex
} = require('bolzano');
let {
    isTerminalSymbol, getNextSymbol
} = require('../../base/util');
let GO = require('./go');

let {
    END_SYMBOL, EXPAND_START_SYMBOL
} = require('../../base/constant');

module.exports = ({
    start,
    T, N,
    productions
}) => {
    let ACTION = [],
        GOTO = [];
    let C = LR1CanonicalCollection({
        start,
        T, N,
        productions
    });

    forEach(C, (I, index) => {
        ACTION[index] = ACTION[index] || {};
        // item = [head, body, dotPosition, forwards]
        forEach(I, (item) => {
            // [S`→S., $] ϵ Ii
            if (jsoneq([EXPAND_START_SYMBOL, [start], 1, [END_SYMBOL]], item)) {
                //
                ACTION[index][END_SYMBOL] = {
                    type: 'accept'
                };
            } else if (item[2] === item[1].length) { // [A → α., a] ϵ Ii, A≠S`
                forEach(item[3], (a) => {
                    ACTION[index][a] = {
                        type: 'reduce',
                        production: [item[0], item[1]]
                    };
                });
            } else if (isTerminalSymbol(getNextSymbol(item), T)) {
                let Ij = GO(I, getNextSymbol(item), T, N, productions);
                if (Ij && Ij.length) {
                    ACTION[index][getNextSymbol(item)] = {
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
            let Ij = GO(I, A, T, N, productions);
            if (Ij && Ij.length) {
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
    eq: jsoneq
});
