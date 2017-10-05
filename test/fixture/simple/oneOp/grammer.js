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
                'type': 3,
                'state': 1
            }
        }, {
            '+': {
                'type': 3,
                'state': 3
            }
        }, {
            '$': {
                'type': 1
            }
        }, {
            'num': {
                'type': 3,
                'state': 4
            }
        }, {
            '$': {
                'type': 2,
                'pIndex': 0
            }
        }]
    }
};
