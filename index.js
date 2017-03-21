'use strict';

/**
 * @readme-quick-run
 *
 * build LR1 table
 *
 * ## test tar=js r_c=syntaxer
 *
 * let {buildLR1Table} = syntaxer;
 * let lr1Table = buildLR1Table({
 *     startSymbol: 'S',
 *     N: ['S'],
 *     T: ['a'],
 *     productions: [
 *         ['S', ['a']] // s -> a
 *     ]
 * });
 * console.log(JSON.stringify(lr1Table, null, 4));
 */

/**
 * @readme-quick-run
 *
 * generate ast from LR table
 *
 * ## test tar=js r_c=syntaxer
 *
 * let {buildLR1Table, LR} = syntaxer;
 * let {ACTION, GOTO} = buildLR1Table({
 *     startSymbol: 'S',
 *     N: ['S'],
 *     T: ['a'],
 *     productions: [
 *         ['S', ['a']] // s -> a
 *     ]
 * });
 * let lrParse = LR(ACTION, GOTO);
 * lrParse({ // accept a taken
 *   name: 'a',
 *   text: 'abc'
 * });
 * let ast = lrParse(null); // null as end symbol
 * console.log(JSON.stringify(ast, null, 4));
 */
module.exports = require('./src');
