'use strict';

let {
    LR1Table, parse
} = require('../src');

let {LR1Itemer} = require('../src/base/LR1Item');
let LR1C = require('../src/LR/LR1/LR1CanonicalCollection');
let ctxFreeGrammer = require('../src/base/ctxFreeGrammer');

let g2 = require('./fixture/grammer2');
let simple_one_g = require('./fixture/simple/one/grammer');
let simple_one_ast = require('./fixture/simple/one/ast');
let simple_one_op_g = require('./fixture/simple/oneOp/grammer');
let simple_one_op_ast = require('./fixture/simple/oneOp/ast');

let leftRecursion = require('./fixture/leftRecursion');
let leftRecursion2 = require('./fixture/leftRecursion2');
let leftRecursion3 = require('./fixture/leftRecursion3');

let assert = require('assert');
let {
    forEach, contain
} = require('bolzano');
let jsoneq = require('cl-jsoneq');

let testGrammer = (g) => {
    let grammer = ctxFreeGrammer(g.grammer);
    let lr1table = LR1Table(grammer);

    let ret = LR1C(grammer, LR1Itemer(grammer));
    ret = ret.map(({items}) => items.map((v) => v.list()));

    forEach(ret, (item) => {
        assert.deepEqual(true, contain(g.LR1C, item, {
            eq: jsoneq
        }));
    });

    assert.deepEqual(ret.length, g.LR1C.length);
    assert.deepEqual(lr1table, g.LR1Table);
};

let testAst = (g, asts) => {
    asts.map(({
        tokens, ast
    }) => {
        assert.deepEqual(parse(g)(tokens), ast);
    });
};

describe('index', () => {
    it('simple_one', () => {
        testGrammer(simple_one_g);
        testAst(simple_one_g.grammer, simple_one_ast);
    });

    it('simple_oneOp', () => {
        testGrammer(simple_one_op_g);
        testAst(simple_one_op_g.grammer, simple_one_op_ast);
    });

    it('LR1 table', () => {
        testGrammer(g2);
    });

    it('left recursion', () => {
        parse(leftRecursion.grammer)([{
            name: 'a',
            text: 'a'
        }]);

        parse(leftRecursion.grammer)([{
            name: 'a',
            text: 'a'
        }, {
            name: ';',
            text: ';'
        }]);

        parse(leftRecursion.grammer)([{
            name: 'a',
            text: 'a'
        }, {
            name: ';',
            text: ';'
        }, {
            name: 'a',
            text: 'a'
        }]);
    });

    it('left recursion 2', () => {
        parse(leftRecursion2.grammer)([{
            name: 'a',
            text: 'a'
        }]);

        parse(leftRecursion.grammer)([{
            name: 'a',
            text: 'a'
        }, {
            name: ';',
            text: ';'
        }]);

        parse(leftRecursion.grammer)([{
            name: 'a',
            text: 'a'
        }, {
            name: ';',
            text: ';'
        }, {
            name: 'a',
            text: 'a'
        }]);
    });

    it('left recursion 3', () => {
        parse(leftRecursion3.grammer)([

            {
                name: '*',
                text: '*'
            }, {
                name: 'a',
                text: 'a'
            }
        ]);
    });
});
