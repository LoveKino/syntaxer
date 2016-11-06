'use strict';

let assert = require('assert');

let {
    initAST, reduceAST
} = require('../src/reduceAst');

describe('reduce', () => {
    it('initAST', () => {
        let tokens = [{
            name: 'id',
            text: 'a'
        }, {
            name: 'add',
            text: '+'
        }, {
            name: 'id',
            text: 'b'
        }];

        // a + b
        let ast = initAST('S', tokens);

        let leaf1 = {
            type: 'terminal',
            symbol: 'id',
            token: tokens[0]
        };

        let leaf2 = {
            type: 'terminal',
            symbol: 'add',
            token: tokens[1]
        };

        let leaf3 = {
            type: 'terminal',
            symbol: 'id',
            token: tokens[2]
        };

        assert.deepEqual(ast, {
            type: 'none-terminal',
            symbol: 'S',
            children: [leaf1, leaf2, leaf3]
        });
    });

    it('reduceAST', () => {
        let leaf1 = {
            type: 'terminal',
            symbol: 'int',
            token: {
                name: 'int',
                text: '3'
            }
        };

        let leaf2 = {
            type: 'terminal',
            symbol: 'add',
            token: {
                name: 'add',
                text: '+'
            }
        };

        let leaf3 = {
            type: 'terminal',
            symbol: 'int',
            token: {
                name: 'int',
                text: '4'
            }
        };

        // 3 + 4
        let ast = {
            type: 'none-terminal',
            symbol: 'S',
            children: [leaf1, leaf2, leaf3]
        };

        // number + int => int + int (number -> int)
        let ast2 = reduceAST(ast, 0, 0, 'number');
        assert.deepEqual(ast2, {
            type: 'none-terminal',
            symbol: 'S',
            children: [{
                type: 'none-terminal',
                symbol: 'number',
                children: [leaf1]
            }, leaf2, leaf3]
        });

        // number + number => number + int (number -> int)
        let ast3 = reduceAST(ast2, 2, 2, 'number');
        assert.deepEqual(ast3, {
            type: 'none-terminal',
            symbol: 'S',
            children: [{
                type: 'none-terminal',
                symbol: 'number',
                children: [leaf1]
            }, leaf2, {
                type: 'none-terminal',
                symbol: 'number',
                children: [leaf3]
            }]
        });
    });
});
