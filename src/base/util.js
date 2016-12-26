'use strict';

let {
    contain, filter
} = require('bolzano');

let rest = (body, dotPosition) => body.slice(dotPosition + 1);

let isTerminalSymbol = (symbol, T) => contain(T, symbol);

let isNoneTerminalSymbol = (symbol, N) => contain(N, symbol);

let getProductions = (noneTerminal, productions) => filter(productions, ([head]) => head === noneTerminal);

let getNextSymbol = (item) => {
    return item[1][item[2]];
};

module.exports = {
    rest,
    isTerminalSymbol,
    isNoneTerminalSymbol,
    getProductions,
    getNextSymbol
};
