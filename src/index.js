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

/**
 * just used for testing
 */
let parse = (g, handlers) => {
    let grammer = ctxFreeGrammer(g);
    let {
        ACTION,
        GOTO
    } = LR1Table(grammer);

    return (tokens) => {
        let parser = LR(grammer, ACTION, GOTO, handlers);
        tokens.forEach(parser);
        return parser(null);
    };
};

let buildLR1Table = (g) => {
    let grammer = ctxFreeGrammer(g);
    return LR1Table(grammer);
};

module.exports = {
    LR,
    LR1Table,
    parse,
    ctxFreeGrammer,
    buildLR1Table
};
