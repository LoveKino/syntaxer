'use strict';

/**
 * reduce production to generate a AST
 *
 * s *rm=> αAω *rm=> αβω
 *
 * reduce from αβω to αAω by A → β
 *
 * current AST:
 *           S
 *        /  |  \
 *       /  / \  \
 *      α    β    ω
 *     / \  / \  / \
 *     ...  ...  ...
 *
 * reduce by A → β
 *
 * result AST:
 *           S
 *        /  |  \
 *       /   A   \
 *      /   / \   \
 *     α     β     ω
 *    / \   / \   / \
 *    ...   ...   ...
 *
 * AST data structure
 * node = {
 *      type: terminal | none-terminal,
 *      symbol,
 *      token,
 *      children: [node]
 * }
 *
 * reduce start point: a token list
 * reduce end point: S → r
 *
 * 1. init AST from a list of token
 *
 * 2. reduce production to expand AST
 */

let {
    map
} = require('bolzano');

const TERMINAL_TYPE = 'terminal';
const NONE_TERMINAL_TYPE = 'none-terminal';

/**
 * @param startSymbol String
 * @param tokens Array
 *
 * @return ast Object
 *
 * tokens = [{
 *     name,
 *     text
 * }]
 */
let initAST = (startSymbol, tokens = []) => {
    return {
        type: NONE_TERMINAL_TYPE,
        symbol: startSymbol,
        children: map(tokens, tokenToLeaf)
    };
};

let tokenToLeaf = (token) => {
    return {
        type: TERMINAL_TYPE,
        symbol: token.name,
        token
    };
};

/**
 * s *rm=> αAω *rm=> αβω
 *
 * reduce from αβω to αAω by A → β
 *
 * @param ast
 * @param start
 * @param end
 * @param leftSymbol
 *
 * @return ast
 *
 * β = ast.children[start] ~ ast.children[end]
 *
 * 1. remove β from ast, replac with A
 * 2. make every elements of β as A's child
 */
let reduceAST = (ast, start = 0, end = 0, leftSymbol) => {
    let midNode = {
        type: NONE_TERMINAL_TYPE,
        symbol: leftSymbol
    };

    let beta = ast.children.splice(start, end - start + 1, midNode);
    midNode.children = beta;
    return ast;
};

/**
 * @param ast
 * @param token
 */
let appendToken = (ast, token) => {
    ast.children.push(tokenToLeaf(token));
    return ast;
};

module.exports = {
    initAST,
    reduceAST,
    appendToken
};
