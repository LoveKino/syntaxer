'use strict';

module.exports = {
    startSymbol: 'E',
    T: ['+', '*', '(', ')', 'id'],
    N: ['E', 'E`', 'T', 'T`', 'F'],
    productions: [
        ['E', ['T', 'E`']],
        ['E`', ['+', 'T', 'E`']],
        ['E`', []],
        ['T', ['F', 'T`']],
        ['T`', ['*', 'F', 'T`']],
        ['T`', []],
        ['F', ['(', 'E', ')']],
        ['F', ['id']]
    ]
};
