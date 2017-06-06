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
            'num': {
                'type': 'shift',
                'state': 1
            }
        }, {
            '+': {
                'type': 'shift',
                'state': 3
            }
        }, {
            '$': {
                'type': 'accept'
            }
        }, {
            'num': {
                'type': 'shift',
                'state': 4
            }
        }, {
            '$': {
                'type': 'reduce',
                'production': ['S', ['num', '+', 'num']]
            }
        }]
    }
};
