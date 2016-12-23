'use strict';

/**
 * LR ananlysis algorithm
 *
 * input: grammer G's analysis table and a string ω
 * output: if ω ϵ L(G), get the bottom-up analysis, otherwise error
 *
 * - init: (S₀, a₁a₂...an$)
 * - assume current configuration is (S₀X₁S₁...Sm, aiai₊₁...an$)
 *    (1) if action[Sm, ai] = shift S, S = GOTO[Sm, ai], then we got new configuration:
 *          (S₀X₁S₁..XmSm ai S, ai₊₁...an$)
 *    (2) if action[Sm, ai] = reduce by A → β, |β| = r,then:
 *          S = GOTO[Sm₋r, A];
 *          (S₀X₁S₁...Xm₋rSm₋rAS, aiai₊₁...an$)
 *    (3) if action[Sm, ai] = accept, success
 *    (4) if action[Sm, ai] = error, error
 */

/**
 * configuration = [stack, tokens]
 *
 * stack = [S₀X₁S₁...XmSm], Xi ϵ T U N, Si stands for state
 *
 * @param action function (state, termalSymbol) -> shift | reduce | accept | error
 *      return of action function, is a object: {type, production, errorMsg}
 *      production = {head, body:[]}
 */
module.exports = (action, goTo) => {
    let configuration = [
        [0],
        []
    ];

    // (S₀X₁S₁..XmSm, aiai₊₁...an$) -> (S₀X₁S₁..XmSm ai S, ai₊₁...an$)
    // S = GOTO(Sm, ai);
    let shift = () => {
        let stack = configuration[0];
        let tokens = configuration[1];
        let top = stack[stack.length - 1];
        let symbol = tokens[0];
        stack.push(symbol, goTo(top, symbol));
        tokens.shift();
    };

    // (S₀X₁S₁..XmSm, aiai₊₁...an$) -> (S₀X₁S₁...Xm₋rSm₋rAS, aiai₊₁...an$)
    // A → β, r = |β|
    // S = GOTO(Sm₋r, A)
    let reduce = (head, body) => {
        let stack = configuration[0];
        for (let i = 0; i < body.length; i++) {
            stack.pop();
            stack.pop();
        }
        let top = stack[stack.length - 1];
        stack.push(head);
        stack.push(goTo(top, head));
    };

    let analysis = () => {
        let topState = configuration[0][configuration[0].length - 1];
        let symbol = configuration[1][0];
        let ret = action(topState, symbol);

        switch (ret.type) {
            case 'shift':
                shift();
                break;
            case 'reduce':
                reduce();
                break;
            case 'error':
                // error handle
                break;
            case 'accept':
                // accept handle
                break;
            default:
                throw new Error(`unexpected action type ${ret.type}, when try to recoginise from [${topState}, ${symbol}]. The configuration is ${configuration}.`);
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
            analysis();
            return; // TODO finish this analysis
        }
        // add token to configuration
        configuration[1].push(token);
        while (configuration[1].length) {
            analysis();
        }
    };
};
