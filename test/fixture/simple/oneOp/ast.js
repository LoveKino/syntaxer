'use strict';

module.exports = [{
    tokens: [{
        name: 'num',
        text: '3'
    }, {
        name: '+',
        text: '+'
    }, {
        name: 'num',
        text: '4'
    }],

    ast: {
        'type': 'none-terminal',
        'symbol': 'S`',
        'children': [{
            'type': 'none-terminal',
            'symbol': 'S',
            'children': [{
                'type': 'terminal',
                'symbol': 'num',
                'token': {
                    'name': 'num',
                    'text': '3'
                }
            }, {
                'type': 'terminal',
                'symbol': '+',
                'token': {
                    'name': '+',
                    'text': '+'
                }
            }, {
                'type': 'terminal',
                'symbol': 'num',
                'token': {
                    'name': 'num',
                    'text': '4'
                }
            }]
        }]
    }
}];
