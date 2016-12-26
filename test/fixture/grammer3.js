'use strict';

module.exports = {
    grammer: {
        start: 'E',
        T: ['num', '+'],
        N: ['E'],
        productions: [
            ['E', ['num']],
            ['E', ['E', '+', 'num']]
        ]
    }
};
