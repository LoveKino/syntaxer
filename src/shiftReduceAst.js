'use strict';

let shiftReduce = require('./shiftReduce');

let {
    initAST,
    reduceAST,
    appendToken
} = require('./reduceAst');

module.exports = (decide, startSymbol, handle) => {
    let ast = initAST(startSymbol);

    let reducer = shiftReduce(decide, (...args) => {
        if (args[0] instanceof Error) {
            handle({
                type: 'error',
                error: args[0]
            });
        } else if (args[0] === null) { // finished
            handle({
                type: 'end',
                ast: ast
            });
        } else {
            let [leftSymbol, start, end] = args[1];
            ast = reduceAST(ast, start, end, leftSymbol);
            handle({
                type: 'reduced',
                ast,
                production: args[0]
            });
        }
    });

    // consume token
    return (token) => {
        if (token) {
            ast = appendToken(ast, token);
        }
        reducer(token);
    };
};
