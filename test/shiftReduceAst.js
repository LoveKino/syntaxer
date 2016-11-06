'use strict';

let shiftReduceAst = require('../src/shiftReduceAst');
let {
    filter
} = require('bolzano');
let jsoneq = require('cl-jsoneq');
let assert = require('assert');

describe('shiftReduceAst', () => {
    it('base', (done) => {
        // S => number + number => number + id => id + id
        let decide = (handleStack, prospects) => {
            let table = [
                [
                    ['S'],
                    [], {
                        type: 'accept'
                    }
                ],
                [
                    ['number', '+', 'number'],
                    [], {
                        type: 'reduce',
                        production: ['S', 0, 2]
                    }
                ],
                [
                    ['number', '+', 'id'],
                    [], {
                        type: 'reduce',
                        production: ['number', 2, 2]
                    }
                ],
                [
                    ['number', '+'],
                    ['id'], {
                        type: 'shift'
                    }
                ],
                [
                    ['number'],
                    ['+'], {
                        type: 'shift'
                    }
                ],
                [
                    ['id'],
                    ['+'], {
                        type: 'reduce',
                        production: ['number', 0, 0]
                    }
                ],
                [
                    [],
                    ['id'], {
                        type: 'shift'
                    }
                ]
            ];

            let rets = filter(table, (line) => {
                if (jsoneq(line[0], handleStack) && ((!prospects.length && !line[1].length) || (prospects[0] === line[1][0]))) {
                    return true;
                }
            });

            if (!rets.length) {
                return {
                    type: 'error',
                    errorMsg: 'missing action'
                };
            } else if (rets.length > 1) {
                return {
                    type: 'error',
                    errorMsg: 'more than one action'
                };
            } else {
                return rets[0][2];
            }
        };

        let reducer = shiftReduceAst(decide, 'S', (ret) => {
            if (ret.type === 'end') {
                assert.deepEqual(ret.ast, {
                    'type': 'none-terminal',
                    'symbol': 'S',
                    'children': [{
                        'type': 'none-terminal',
                        'symbol': 'S',
                        'children': [{
                            'type': 'none-terminal',
                            'symbol': 'number',
                            'children': [{
                                'type': 'terminal',
                                'symbol': 'id',
                                'token': {
                                    'name': 'id',
                                    'text': '3'
                                }
                            }]
                        }, {
                            'type': 'terminal',
                            'symbol': '+',
                            'token': {
                                'name': '+',
                                'text': '+'
                            }
                        }, {
                            'type': 'none-terminal',
                            'symbol': 'number',
                            'children': [{
                                'type': 'terminal',
                                'symbol': 'id',
                                'token': {
                                    'name': 'id',
                                    'text': '4'
                                }
                            }]
                        }]
                    }]
                });
                done();
            }
        });

        reducer({
            name: 'id',
            text: '3'
        });

        reducer({
            name: '+',
            text: '+'
        });

        reducer({
            name: 'id',
            text: '4'
        });

        reducer(null);
    });
});
