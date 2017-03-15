'use strict';

module.exports = [{
    tokens: [{
        name: 'a',
        text: 'abc'
    }],

    ast: {
        'type': 'none-terminal',
        'symbol': 'S`',
        'children': [{
            'type': 'none-terminal',
            'symbol': 'S',
            'children': [{
                'type': 'terminal',
                'symbol': 'a',
                'token': {
                    'name': 'a',
                    'text': 'abc'
                }
            }]
        }]
    }
}];
