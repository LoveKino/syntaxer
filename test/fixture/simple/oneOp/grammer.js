'use strict';

let {
    parse
} = require('bnfer');

module.exports = {
    grammer: parse('S := num + num'),

    LR1C: [
        [
            ['S`', ['S'], 0, ['$']],
            ['S', ['num', '+', 'num'], 0, ['$']]
        ],
        [
            ['S', ['num', '+', 'num'], 1, ['$']]
        ],
        [
            ['S`', ['S'], 1, ['$']]
        ],
        [
            ['S', ['num', '+', 'num'], 2, ['$']]
        ],
        [
            ['S', ['num', '+', 'num'], 3, ['$']]
        ]
    ],

    LR1Table: {
        'GOTO': [{
            'S': 2
        }, {}, {}, {}, {}],

        'ACTION': [{
            'num': [3, 1]
        }, {
            '+': [3, 3]
        }, {
            '$': [1]
        }, {
            'num': [3, 4]
        }, {
            '$': [2, 0]
        }]
    }
};
