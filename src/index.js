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
let {
    forEach
} = require('bolznao');

/**
 * just used for testing
 */
let parse = (grammer) => {
    let {
        ACTION, GOTO
    } = LR1Table(grammer);

    return (tokens) => {
        let parser = LR(ACTION, GOTO);
        forEach(tokens, parser);
        parser(null);
    };
};

module.exports = {
    LR, LR1Table, parse
};
