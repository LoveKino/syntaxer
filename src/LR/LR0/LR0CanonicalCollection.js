'use strict';

let GO = require('./go');
let CLOSURE = require('./closure');
let {
    reduce, filter
} = require('bolzano');
let jsoneq = require('cl-jsoneq');

/**
 * input: grammer G
 *
 * output: LR(0) canonical collection
 *
 * item = [head, body, dotPosition];
 *
 * item set = [viable prefix, items]
 */
module.exports = ({
    startSymbol,
    symbols,
    productions,
    expandStartSymbol = 'S`'
}) => {
    let C = [
        [ // item set
            [], // viable prefix
            CLOSURE([ // items
                [expandStartSymbol, [startSymbol], 0]
            ], productions)
        ]
    ];

    while (true) { // eslint-disable-line
        let newC = reduce(C, (prev, [viablePrefix, I]) => {
            return reduce(symbols, (pre, X) => {
                let nextPrefix = viablePrefix.concat([X]);
                if (!filter(pre, ([prefix]) => jsoneq(prefix, nextPrefix)).length) { // no such item
                    let ret = GO(I, X, productions);
                    if (ret) {
                        pre.push([nextPrefix, ret]);
                    }
                }
                return pre;
            }, prev);
        }, C.slice(0));
        if (newC.length === C.length) break; // no more items
        C = newC;
    }
};
