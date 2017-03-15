'use strict';

module.exports = {
    grammer: {
        startSymbol: 'S',
        N: ['S'],
        T: ['a'],
        productions: [
            ['S', ['a']] // s -> a
        ]
    },

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
                'type': 'shift',
                'state': 1
            }
        }, {
            '$': {
                'type': 'reduce',
                'production': ['S', ['a']]
            }
        }, {
            '$': {
                'type': 'accept'
            }
        }]
    }
};
