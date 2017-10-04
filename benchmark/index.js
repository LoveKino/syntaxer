'use strict';

let {
    buildLR1Table
} = require('..');
let {
    parse
} = require('bnfer');
let fs = require('fs');
let promisify = require('es6-promisify');
let path = require('path');
let Benchmark = require('benchmark');

let syntaxer_current = require('./v/current');
let syntaxer_0_0_13 = require('./v/0.0.13');

let readFile = promisify(fs.readFile);

let runSyntaxer = (syntaxer, grammer) => {
    syntaxer.buildLR1Table(grammer);
};

let runCase = async(text) => {
    let grammer = parse(text);

    let suite = new Benchmark.Suite;
    // add tests 
    suite.add('current', function() {
            runSyntaxer(syntaxer_current, grammer);
        })
        .add('0.0.13', function() {
            runSyntaxer(syntaxer_0_0_13, grammer);
        })
        // add listeners 
        .on('cycle', function(event) {
            console.log(String(event.target));
        })
        .on('complete', function() {
            console.log('Fastest is ' + this.filter('fastest').map('name'));
        })
        // run async 
        .run({
            'async': true
        });
};

let main = async() => {
    let text = await readFile(path.join(__dirname, './grammer.txt'), 'utf-8');
    runCase(text);
};

main();
