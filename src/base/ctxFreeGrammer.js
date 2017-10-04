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
 *
 * TODO validate
 */

const {
    END_SYMBOL,
    EXPAND_START_SYMBOL,
    EPSILON
} = require('./constant');

/**
 * context free grammer is read-only
 */
let CtxFreeGrammer = function({
    startSymbol,
    T,
    N,
    productions
}) {
    this.startSymbol = startSymbol;
    this.T = T;
    this.N = N;
    this.productions = productions;

    this.symbols = T.concat(N);

    // to map
    this.noneTerminalProductionMap = getNoneTerminalProductionMap(this.productions);
    this.noneTerminalProductionIndexMap = getNoneTerminalProductionIndexMap(this.productions);
    this.terminalMap = listToExistMap(this.T);
    this.noneTerminalMap = listToExistMap(this.N);

    this.expandedProduction = [EXPAND_START_SYMBOL, [this.startSymbol]];
}

CtxFreeGrammer.prototype.getProductionByIndex = function(index) {
    if (index === -1) return this.expandedProduction;
    return this.productions[index];
};

/**
 * get all the productions start with none terminal symbol
 */
CtxFreeGrammer.prototype.getProductionsOf = function(noneTerminal) {
    return this.noneTerminalProductionMap[noneTerminal];
};
CtxFreeGrammer.prototype.getProductionIndexsOf = function(noneTerminal) {
    return this.noneTerminalProductionIndexMap[noneTerminal];
};
CtxFreeGrammer.prototype.getBodyId = function(body) {
    return JSON.stringify(body);
};
CtxFreeGrammer.prototype.isTerminalSymbol = function(symbol) {
    return !!this.terminalMap[symbol];
};
CtxFreeGrammer.prototype.isNoneTerminalSymbol = function(symbol) {
    return !!this.noneTerminalMap[symbol];
};

CtxFreeGrammer.prototype.isEndSymbol = function(v) {
    return v === END_SYMBOL;
};
CtxFreeGrammer.prototype.getHead = function(production) {
    return production[0];
};
CtxFreeGrammer.prototype.getBody = function(production) {
    return production[1];
};

// A -> ε
CtxFreeGrammer.prototype.isEmptyProduction = function(production) {
    return !production[1].length;
};

CtxFreeGrammer.prototype.EPSILON = EPSILON;
CtxFreeGrammer.prototype.END_SYMBOL = END_SYMBOL;
CtxFreeGrammer.prototype.EXPAND_START_SYMBOL = EXPAND_START_SYMBOL;

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

let getNoneTerminalProductionIndexMap = (producitons) => {
    let indexMap = {};

    let productionLen = producitons.length;
    for (let i = 0; i < productionLen; i++) {
        let production = producitons[i];
        let head = production[0];
        indexMap[head] = indexMap[head] || [];
        indexMap[head].push(i);
    }

    return indexMap;
};

module.exports = (options) => new CtxFreeGrammer(options);
