'use strict';

module.exports = {
    grammer: {
        startSymbol: 'E',
        T: ['num', '+'],
        N: ['E'],
        productions: [
            ['E', ['num']],
            ['E', ['E', '+', 'num']]
        ]
    }
};
