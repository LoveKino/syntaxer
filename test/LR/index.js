'use strict';

let LR1Table = require('../../src/LR/LR1/LR1Table');
let LR = require('../../src/LR');
let g3 = require('../fixture/grammer3');
let assert = require('assert');
let ctxFreeGrammer = require('../../src/base/ctxFreeGrammer');

describe('LR', () => {
    it('index', (done) => {
        let grammer = ctxFreeGrammer(g3.grammer);
        let {
            ACTION,
            GOTO
        } = LR1Table(grammer);

        let reduces = [];

        let parser = LR(grammer, ACTION, GOTO, {
            reduceHandler: (production, midNode, reducedTokens) => {
                reduces.push(production, reducedTokens);
            },
            acceptHandler: () => {
                assert.deepEqual([
                    ['E', ['num']],
                    [{
                        name: 'num',
                        text: '3'
                    }],
                    ['E', ['E', '+', 'num']],
                    [{
                        name: 'num',
                        text: '4'
                    }, {
                        name: '+',
                        text: '+'
                    }, 'E']
                ], reduces);

                done();
            }
        });
        parser({
            name: 'num',
            text: '3'
        });

        parser({
            name: '+',
            text: '+'
        });

        parser({
            name: 'num',
            text: '4'
        });

        parser(null);
    });

    it('reduce', (done) => {
        let grammer = ctxFreeGrammer(g3.grammer);
        let {
            ACTION,
            GOTO
        } = LR1Table(grammer);

        let reduces = [];

        let parser = LR(grammer, ACTION, GOTO, {
            reduceHandler: (production, midNode, reducedTokens) => {
                reduces.push(production, reducedTokens);
            },
            acceptHandler: () => {
                assert.deepEqual([
                    ['E', ['num']],
                    [{
                        name: 'num',
                        text: '3'
                    }],
                    ['E', ['E', '+', 'num']],
                    [{
                        name: 'num',
                        text: '4'
                    }, {
                        name: '+',
                        text: '+'
                    }, 'E'],
                    ['E', ['E', '+', 'num']],
                    [{
                        name: 'num',
                        text: '5'
                    }, {
                        name: '+',
                        text: '+'
                    }, 'E']
                ], reduces);
                done();
            }
        });
        parser({
            name: 'num',
            text: '3'
        });

        parser({
            name: '+',
            text: '+'
        });

        parser({
            name: 'num',
            text: '4'
        });

        parser({
            name: '+',
            text: '+'
        });

        parser({
            name: 'num',
            text: '5'
        });

        let ast = parser(null);
        assert.deepEqual(ast, {
            'type': 'none-terminal',
            'symbol': 'S`',
            'children': [{
                'type': 'none-terminal',
                'symbol': 'E',
                'children': [{
                    'type': 'none-terminal',
                    'symbol': 'E',
                    'children': [{
                        'type': 'none-terminal',
                        'symbol': 'E',
                        'children': [{
                            'type': 'terminal',
                            'symbol': 'num',
                            'token': {
                                'name': 'num',
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
                        'type': 'terminal',
                        'symbol': 'num',
                        'token': {
                            'name': 'num',
                            'text': '4'
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
                    'type': 'terminal',
                    'symbol': 'num',
                    'token': {
                        'name': 'num',
                        'text': '5'
                    }
                }]
            }]
        });
    });
});
