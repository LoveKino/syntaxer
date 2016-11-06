'use strict';

/**
 * shift reduce algorithm
 *
 * handle stack: used to recognize handle
 * input stream: input tokens
 * prospect one more token
 *
 * action: shift, reduce, accept, error
 *
 * decide action based on handle stack and prospect tokens
 */

const SHIFT_TYPE = 'shift';
const REDUCE_TYPE = 'reduce';
const ERROR_TYPE = 'error';
const ACCEPT_TYPE = 'accept';
const prospectLength = 1; // LR(1)

/**
 * generate reducing stream
 *
 * @param decide (handleStack, prospects) => action
 * @param handle
 *      handle null
 *      handle exception object
 *      handle production prospects handleStack
 *
 *  action = {
 *      type: shift | reduce | error, // error is an exception object
 *      production: [leftSymbol, start, end],
 *      error
 *  }
 */
module.exports = (decide, handle) => {
    let prospects = [];
    let handleStack = [];
    let endStatus = false;

    let doAction = ({
        type, production, errorMsg = ''
    }) => {
        switch (type) {
            case SHIFT_TYPE:
                handleStack.push(prospects.shift());
                break;
            case REDUCE_TYPE:
                let [leftSymbol, start, end] = production;
                let body = handleStack.splice(start, end + 1, leftSymbol);
                handle([leftSymbol, body], production.slice(0));
                break;
            case ERROR_TYPE:
                endStatus = ERROR_TYPE;
                handle(new Error(`Fail to find action. HandleStack is ${JSON.stringify(handleStack)}. Prospects is ${JSON.stringify(prospects)}. ${errorMsg}`));
                break;
            case ACCEPT_TYPE:
                endStatus = ACCEPT_TYPE;
                handle(null);
                break;
            default:
                endStatus = ERROR_TYPE;
                handle(new TypeError(`unexpected type of action. Type is ${type}.`));
        }
    };

    let makeDecistion = (minProspectLength) => {
        while (getCondition(minProspectLength)) {
            doAction(decide(handleStack, prospects));
        }
    };

    let getCondition = (minProspectLength) => {
        return minProspectLength ? prospects.length > minProspectLength && !endStatus : !endStatus;
    };

    // consume token
    return (token) => {
        if (endStatus) return;
        if (!token) { // stream end!
            makeDecistion(null);
        } else {
            prospects.push(token.name);
            makeDecistion(prospectLength);
        }
    };
};
