'use strict';

module.exports = {
    grammer: {
        productions: [
            ['S', ['C', 'C']],
            ['C', ['c', 'C']],
            ['C', ['d']]
        ],
        N: ['S', 'C'],
        T: ['c', 'd'],
        start: 'S'
    },

    LR1C: [
        [ // I0
            ['S`', ['S'], 0, ['$']],
            ['S', ['C', 'C'], 0, ['$']],
            ['C', ['c', 'C'], 0, ['c', 'd']],
            ['C', ['d'], 0, ['c', 'd']]
        ],
        [ // I1
            ['C', ['c', 'C'], 1, ['c', 'd']],
            ['C', ['c', 'C'], 0, ['c', 'd']],
            ['C', ['d'], 0, ['c', 'd']]
        ],
        [ // I2
            ['C', ['d'], 1, ['c', 'd']]
        ],
        [ // I3
            ['S`', ['S'], 1, ['$']]
        ],
        [ // I4
            ['S', ['C', 'C'], 1, ['$']],
            ['C', ['c', 'C'], 0, ['$']],
            ['C', ['d'], 0, ['$']]
        ],
        [ // I5
            ['C', ['c', 'C'], 2, ['c', 'd']]
        ],
        [ // I6
            ['C', ['c', 'C'], 1, ['$']],
            ['C', ['c', 'C'], 0, ['$']],
            ['C', ['d'], 0, ['$']]
        ],
        [ // I7
            ['C', ['d'], 1, ['$']]
        ],
        [ // I8
            ['S', ['C', 'C'], 2, ['$']]
        ],
        [ // I9
            ['C', ['c', 'C'], 2, ['$']]
        ]
    ],

    LR1Table: {
        'GOTO': [{
            'S': 3,
            'C': 4
        }, {
            'C': 5
        }, {}, {}, {
            'C': 8
        }, {}, {
            'C': 9
        }, {}, {}, {}],

        'ACTION': [{
            'c': {
                'type': 'shift',
                'state': 1
            },
            'd': {
                'type': 'shift',
                'state': 2
            }
        }, {
            'c': {
                'type': 'shift',
                'state': 1
            },
            'd': {
                'type': 'shift',
                'state': 2
            }
        }, {
            'c': {
                'type': 'reduce',
                'production': ['C', ['d']]
            },
            'd': {
                'type': 'reduce',
                'production': ['C', ['d']]
            }
        }, {
            '$': {
                'type': 'accept'
            }
        }, {
            'c': {
                'type': 'shift',
                'state': 6
            },
            'd': {
                'type': 'shift',
                'state': 7
            }
        }, {
            'c': {
                'type': 'reduce',
                'production': ['C', ['c', 'C']]
            },
            'd': {
                'type': 'reduce',
                'production': ['C', ['c', 'C']]
            }
        }, {
            'c': {
                'type': 'shift',
                'state': 6
            },
            'd': {
                'type': 'shift',
                'state': 7
            }
        }, {
            '$': {
                'type': 'reduce',
                'production': ['C', ['d']]
            }
        }, {
            '$': {
                'type': 'reduce',
                'production': ['S', ['C', 'C']]
            }
        }, {
            '$': {
                'type': 'reduce',
                'production': ['C', ['c', 'C']]
            }
        }]
    }
};
