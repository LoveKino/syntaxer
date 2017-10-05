'use strict';

/**
 * LR ananlysis algorithm
 *
 * input: grammer G's analysis table and a string ω
 * output: if ω ϵ L(G), get the bottom-up analysis, otherwise error
 *
 * - init: (S₀, a₁a₂...an$)
 *
 * - assume current configuration is (S₀X₁S₁...Sm, aiai₊₁...an$)
 *
 *    (1) if action[Sm, ai] = shift S, S = GOTO[Sm, ai], then we got new configuration:
 *          (S₀X₁S₁..XmSm ai S, ai₊₁...an$)
 *    (2) if action[Sm, ai] = reduce by A → β, |β| = r,then:
 *          S = GOTO[Sm₋r, A];
 *          (S₀X₁S₁...Xm₋rSm₋rAS, aiai₊₁...an$)
 *    (3) if action[Sm, ai] = accept, success
 *    (4) if action[Sm, ai] = error, error
 */

const {
    END_SYMBOL,
    EXPAND_START_SYMBOL,

    REDUCE,
    SHIFT,
    ACCEPT,
    ERROR
} = require('../base/constant');

let {
    initAST,
    reduceAST,
    appendToken
} = require('../reduceAst');

/**
 * configuration = [stack, tokens]
 *
 * stack = [S₀X₁S₁...XmSm], Xi ϵ T U N, Si stands for state
 *
 * @param action function (state, termalSymbol) -> shift | reduce | accept | error
 *      return of action function, is a object: {type, production, errorMsg}
 *      production = [head, body:[]]
 */
module.exports = (grammer, ACTION, GOTO, {
    reduceHandler,
    acceptHandler
} = {}) => {
    // initial configuration
    let configuration = initConfiguration();

    // initial ast
    let ast = initAST(EXPAND_START_SYMBOL);

    let findAction = (state, token) => {
        let act = ACTION[state][token.name];
        if (!act) {
            return {
                type: ERROR,
                errorMsg: `unexpected symbol (token.name) ${token.name}, token (token.text) is ${token.text}. Try to find ACTION from state ${state}.`
            };
        } else {
            return act;
        }
    };

    let goTo = (state, token) => {
        let nextState = GOTO[state][token.name];
        if (nextState === undefined) {
            throw new Error(`fail to goto state from ${state} and symbol (token.name) is ${token.name}, token (token.text) is ${token.text}. Try to do GOTO from state ${state}, but next state not exists.`);
        }
        return nextState;
    };

    let analysis = () => {
        let topState = getTopState(configuration);
        let token = getNextInputToken(configuration);
        // look up action
        let nextAction = findAction(topState, token);

        switch (nextAction.type) {
            case SHIFT:
                shift(configuration, nextAction.state, token);
                ast = appendToken(ast, token);
                break;
            case REDUCE:
                // reduce production
                ast = reduce(ast, grammer.getProductionByIndex(nextAction.pIndex), configuration, goTo, reduceHandler);
                break;
            case ERROR:
                // error handle
                throw new Error(nextAction.errorMsg);
            case ACCEPT:
                // clear configration
                configuration[1] = [];
                acceptHandler && acceptHandler(ast); // accept handle
                break;
            default:
                throw new Error(`unexpected action type ${nextAction.type}, when try to recoginise from [${topState}, ${token.name}]. Token is ${token.text}`);
        }
    };

    /**
     * @param token Object
     *   accept token as stream
     *   token = {
     *        name,
     *        other...
     *   }
     *
     *   if toke is null, means end of input
     */
    return (token) => {
        if (token === null) {
            // check state of the configuration
            configuration[1].push({
                name: END_SYMBOL
            });
            while (configuration[1].length) {
                analysis();
            }

            return ast;
        } else {
            // add token to configuration
            configuration[1].push(token);
            while (configuration[1].length > 1) {
                analysis();
            }
        }
    };
};

let initConfiguration = () => {
    // initial configuration
    return [
        [0], // stack
        [] // input
    ];
};

// (S₀X₁S₁..XmSm, aiai₊₁...an$) -> (S₀X₁S₁..XmSm ai S, ai₊₁...an$)
// S = GOTO(Sm, ai);
let shift = (configuration, state, token) => {
    let stack = configuration[0];
    let tokens = configuration[1];
    stack.push(token, state);
    tokens.shift();
};

// (S₀X₁S₁..XmSm, aiai₊₁...an$) -> (S₀X₁S₁...Xm₋rSm₋rAS, aiai₊₁...an$)
// A → β, r = |β|
// S = GOTO(Sm₋r, A)
let reduce = (ast, [head, body], configuration, goTo, reduceHandler) => {
    let stack = configuration[0];
    let reducedTokens = [];
    for (let i = 0; i < body.length; i++) {
        stack.pop(); // pop state
        reducedTokens.push(stack.pop()); // pop token
    }
    let top = getTopState(configuration);
    stack.push(head);
    stack.push(goTo(top, {
        name: head,
        text: `[none terminal symbol] ${head}`
    }));

    let {
        newAst,
        midNode
    } = reduceAST(ast,
        ast.children.length - body.length, // start position
        ast.children.length - 1, // end position
        head);

    reduceHandler && reduceHandler([head, body], midNode, reducedTokens, ast);
    return newAst;
};

let getTopState = (configuration) => {
    let stack = configuration[0];
    return stack[stack.length - 1];
};

let getNextInputToken = (configuration) => {
    let tokens = configuration[1];
    return tokens[0];
};
