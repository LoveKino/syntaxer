'use strict';

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
            return {
                [X]: 1
            };
        } else {
            // find all productions start with X
            let ps = grammer.getProductionIndexsOf(X);

            return ps.reduce((prev, productionIndex) => {
                let production = grammer.getProductionByIndex(productionIndex);
                let body = grammer.getBody(production);

                if (grammer.isEmptyProduction(production)) {
                    // union ε
                    prev[grammer.EPSILON] = 1;
                } else {
                    if (grammer.isTerminalSymbol(body[0])) {
                        // union terminal
                        prev[body[0]] = 1;
                    } else {
                        let rest = firstList(body, grammer);
                        // union rest
                        for (let name in rest) {
                            prev[name] = 1;
                        }
                    }
                }

                return prev;
            }, {});
        }
    };

    let firstListMap = {};
    /**
     * [...ab...]
     */
    let firstList = (body) => {
        let bodyId = JSON.stringify(body);
        if (firstListMap[bodyId]) {
            return firstListMap[bodyId];
        }

        let ret = [];
        for (let i = 0, n = body.length; i < n; i++) {
            let set = first(body[i]);
            let hasEpsilon = set[grammer.EPSILON] === 1;

            // union first set of y except epsilon
            for (let name in set) {
                if (name !== grammer.EPSILON) {
                    ret[name] = 1;
                }
            }

            if (!hasEpsilon) { // stop
                break
            } else {
                if (i === body.length - 1) {
                    ret[grammer.EPSILON] = 1; // add epsilon
                }
            }
        }

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
