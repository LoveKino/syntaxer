'use strict';

let {
    parse
} = require('bnfer');

module.exports = parse(`E := T E\`
E\` := + T E\` | EPSILON
T := F T\`
T\` := * F T\` | EPSILON
F := ( E ) | id
`);
