'use strict';

let LR1Table = require('../../src/LR/LR1/LR1Table');
let LR = require('../../src/LR/LR');
let g3 = require('../fixture/grammer3');
let assert = require('assert');

describe('LR', () => {
    it('index', (done) => {
        let {
            ACTION, GOTO
        } = LR1Table(g3.grammer);

        let reduces = [];

        let parser = LR(ACTION, GOTO, {
            reduceHandler: (production, reducedTokens) => {
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
        let {
            ACTION, GOTO
        } = LR1Table(g3.grammer);

        let reduces = [];

        let parser = LR(ACTION, GOTO, {
            reduceHandler: (production, reducedTokens) => {
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

        parser(null);
    });
});
