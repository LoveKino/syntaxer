
'use strict';

let {
    parse
} = require('bnfer');

module.exports = {
    grammer: parse(`S := STATEMENTS

STATEMENTS := STATEMENT | STATEMENT ; STATEMENT

STATEMENT := a | EPSILON
`)
};
