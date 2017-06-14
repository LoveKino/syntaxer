# syntaxer

[中文文档](./README_zh.md)   [document](./README.md)

syntax analysis
- [install](#install)
- [usage](#usage)
  * [API quick run](#api-quick-run)
- [develop](#develop)
  * [file structure](#file-structure)
  * [run tests](#run-tests)
- [license](#license)

## install

`npm i syntaxer --save` or `npm i syntaxer --save-dev`

Install on global, using `npm i syntaxer -g`



## usage








### API quick run

build LR1 table

```js
let syntaxer = require('syntaxer')
let {buildLR1Table} = syntaxer;
let lr1Table = buildLR1Table({
    startSymbol: 'S',
    N: ['S'],
    T: ['a'],
    productions: [
        ['S', ['a']] // s -> a
    ]
});
console.log(JSON.stringify(lr1Table, null, 4));
```

<pre>
output

    {
        "GOTO": [
            {
                "S": 2
            },
            {},
            {}
        ],
        "ACTION": [
            {
                "a": {
                    "type": "shift",
                    "state": 1
                }
            },
            {
                "$": {
                    "type": "reduce",
                    "production": [
                        "S",
                        [
                            "a"
                        ]
                    ]
                }
            },
            {
                "$": {
                    "type": "accept"
                }
            }
        ]
    }

</pre>
generate ast from LR table

```js
let syntaxer = require('syntaxer')
let {buildLR1Table, LR} = syntaxer;
let {ACTION, GOTO} = buildLR1Table({
    startSymbol: 'S',
    N: ['S'],
    T: ['a'],
    productions: [
        ['S', ['a']] // s -> a
    ]
});
let lrParse = LR(ACTION, GOTO);
lrParse({ // accept a token
  name: 'a',
  text: 'abc'
});
let ast = lrParse(null); // null as end symbol
console.log(JSON.stringify(ast, null, 4));
```

<pre>
output

    {
        "type": "none-terminal",
        "symbol": "S`",
        "children": [
            {
                "type": "none-terminal",
                "symbol": "S",
                "children": [
                    {
                        "type": "terminal",
                        "symbol": "a",
                        "token": {
                            "name": "a",
                            "text": "abc"
                        }
                    }
                ]
            }
        ]
    }

</pre>

## develop

### file structure

```
.
│──LICENSE
│──README.md
│──README_zh.md
│──index.js
│──package.json
│──src
│   │──LR
│   │   │──LR1
│   │   │   │──LR1CanonicalCollection.js
│   │   │   │──LR1Table.js
│   │   │   │──closure.js
│   │   │   └──go.js
│   │   └──index.js
│   │──base
│   │   │──LR1Item.js
│   │   │──constant.js
│   │   │──ctxFreeGrammer.js
│   │   │──first.js
│   │   └──follow.js
│   │──index.js
│   │──reduceAst.js
│   └──util
│       └──index.js
└──test
    │──LR
    │   └──index.js
    │──LR1
    │   │──LR1CanonicalCollection.js
    │   │──LR1Table.js
    │   │──closure.js
    │   └──go.js
    │──base
    │   │──first.js
    │   └──follow.js
    │──index.js
    └──reduceAst.js 
```


### run tests

`npm test`

## license

MIT License

Copyright (c) 2016 chenjunyu

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
