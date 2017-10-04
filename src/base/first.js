'use strict';

let {
    contain,
    union,
    reduce,
    difference,
    forEach
} = require('bolzano');

/**
 * first set of sentential form
 *
 * α ϵ (T U N)*
 *
 * FIRST(α) = { a | α *=> a..., a ϵ T }
 *
 * if α *=> ε, then ε ϵ FIRST(α)
 *
 * A → ε => ['A', []]
 *
 * using null stand for ε
 */

module.exports = (grammer) => {
    // cache first set
    let firstMap = {};

    let first = (X) => {
        if (firstMap[X]) return firstMap[X];
        let ret = firstSet(X);
        firstMap[X] = ret;
        return ret;
    };

    let firstSet = (X) => {
        if (grammer.isTerminalSymbol(X)) {
            return [X];
        } else {
            // find all productions start with X
            let ps = grammer.getProductionsOf(X);

            return reduce(ps, (prev, production) => {
                let body = grammer.getBody(production);

                if (grammer.isEmptyProduction(production)) {
                    return union(prev, [grammer.EPSILON]); // union ε
                } else {
                    if (grammer.isTerminalSymbol(body[0])) {
                        return union(prev, [body[0]]);
                    } else {
                        return union(prev, firstList(body, grammer));
                    }
                }
            }, []);
        }
    };

    let firstListMap = {};
    /**
     * [...ab...]
     */
    let firstList = (body) => {
        let bodyId = grammer.getBodyId(body);
        if (firstListMap[bodyId]) {
            return firstListMap[bodyId];
        }

        let ret = [];
        forEach(body, (y, index) => {
            let set = first(y);

            ret = union(ret, difference(set, [grammer.EPSILON]));
            if (!contain(set, grammer.EPSILON)) { // stop
                return true;
            }

            if (index === body.length - 1) {
                ret = union(ret, [grammer.EPSILON]);
            }
        });

        firstListMap[bodyId] = ret;
        return ret;
    };

    return (alpha) => {
        if (Array.isArray(alpha)) {
            return firstList(alpha);
        } else {
            return first(alpha);
        }
    };
};
