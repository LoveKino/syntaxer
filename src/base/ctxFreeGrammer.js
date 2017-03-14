'use strict';

let {
    contain, filter
} = require('bolzano');

/**
 * context free grammer
 *    terminal symbol
 *    non-terminal symbol
 *    begin symbol
 *    production
 *    left -> right
 *
 * production = [head, body]
 */

const {
    END_SYMBOL, EXPAND_START_SYMBOL, EPSILON
} = require('./constant');

// TODO validate
module.exports = ({
    startSymbol,
    T, N,
    productions
}) => {
    let symbols = T.concat(N);

    let isTerminalSymbol = (symbol) => contain(T, symbol);

    let isNoneTerminalSymbol = (symbol) => contain(N, symbol);

    /**
     * get all the productions startSymbol with none terminal symbol
     */
    let getProductionsOf = (noneTerminal) => filter(productions, ([head]) => head === noneTerminal);

    let getNextSymbol = (item) => {
        return item[1][item[2]];
    };

    let rest = (body, dotPosition) => body.slice(dotPosition + 1);

    // A -> ε
    let isEmptyProduction = (production) => { // eslint-disable-body
        return !getBody(production).length;
    };

    let getBody = (production) => production[1];

    let getHead = (production) => production[0];

    let isEndSymbol = (v) => v === END_SYMBOL;

    return {
        isTerminalSymbol,
        isNoneTerminalSymbol,
        getProductionsOf,
        getNextSymbol,
        rest,
        isEmptyProduction,
        getBody,
        getHead,
        EPSILON,
        END_SYMBOL,
        EXPAND_START_SYMBOL,
        startSymbol,
        productions,
        isEndSymbol,
        symbols,
        N
    };
};
