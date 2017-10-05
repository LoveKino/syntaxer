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
            'a': [3, 1]
        }, {
            '$': [2, 0]
        }, {
            '$': [1]
        }]
    }
};
