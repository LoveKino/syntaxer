'use strict';

/**
 * syntax analysis
 *
 * background knowledge
 *
 * 1. context free grammer
 *    terminal symbol
 *    non-terminal symbol
 *    begin symbol
 *    production
 *          left -> right
 * 2. shift-in reduce
 */

let LR = require('./LR');
let LR1Table = require('./LR/LR1/LR1Table');
let ctxFreeGrammer = require('./base/ctxFreeGrammer');
let {
    forEach
} = require('bolzano');

/**
 * just used for testing
 */
let parse = (g, handlers) => {
    let {
        ACTION, GOTO
    } = LR1Table(ctxFreeGrammer(g));

    return (tokens) => {
        let parser = LR(ACTION, GOTO, handlers);
        forEach(tokens, parser);
        return parser(null);
    };
};

let buildLR1Table = (g) => {
    let grammer = ctxFreeGrammer(g);
    return LR1Table(grammer);
};

module.exports = {
    LR, LR1Table, parse, ctxFreeGrammer, buildLR1Table
};
