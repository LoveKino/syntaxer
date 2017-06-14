'use strict';

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

/**
 * context free grammer is read-only
 */

// TODO validate
module.exports = ({
    startSymbol,
    T, N,
    productions
}) => {
    let symbols = T.concat(N);

    // cache
    let noneTerminalProductionMap = getNoneTerminalProductionMap(productions);
    let terminalMap = listToExistMap(T);
    let noneTerminalMap = listToExistMap(N);

    let isTerminalSymbol = (symbol) => !!terminalMap[symbol];
    let isNoneTerminalSymbol = (symbol) => !!noneTerminalMap[symbol];

    /**
     * get all the productions startSymbol with none terminal symbol
     */
    let getProductionsOf = (noneTerminal) => noneTerminalProductionMap[noneTerminal];

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

let listToExistMap = (arr) => {
    let map = {};
    let tLen = arr.length;
    for (let i = 0; i < tLen; i++) {
        map[arr[i]] = true;
    }
    return map;
};

/**
 * get the production map, key is none terminal symbol, keys is the set of producitons
 */
let getNoneTerminalProductionMap = (producitons) => {
    let productionMap = {};

    let productionLen = producitons.length;
    for (let i = 0; i < productionLen; i++) {
        let production = producitons[i];
        let head = production[0];
        productionMap[head] = productionMap[head] || [];
        productionMap[head].push(production);
    }

    return productionMap;
};
