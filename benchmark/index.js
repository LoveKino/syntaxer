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

let readFile = promisify(fs.readFile);

let log = console.log; // eslint-disable-line

let run = async() => {
    let text = await readFile(path.join(__dirname, './grammer.txt'), 'utf-8');
    let grammer = parse(text);
    let t1 = new Date().getTime();
    buildLR1Table(grammer);
    let t2 = new Date().getTime();

    log(`spend time: ${t2 - t1}`);
};

run();
