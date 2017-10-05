'use strict';

let {
    parse
} = require('bnfer');

module.exports = {
    grammer: parse('S:=a'),

    LR1C: [
        [
            ['S`', ['S'], 0, ['$']],
            ['S', ['a'], 0, ['$']]
        ],
        [
            ['S', ['a'], 1, ['$']]
        ],
        [
            ['S`', ['S'], 1, ['$']]
        ]
    ],

    LR1Table: {
        'GOTO': [{
            'S': 2
        }, {}, {}],

        'ACTION': [{
            'a': {
                'type': 3,
                'state': 1
            }
        }, {
            '$': {
                'type': 2,
                'pIndex': 0
            }
        }, {
            '$': {
                'type': 1
            }
        }]
    }
};
