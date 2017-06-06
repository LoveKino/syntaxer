'use strict';

let {
    parse
} = require('bnfer');

module.exports = {
    grammer: parse('E := num | E + num')
};
