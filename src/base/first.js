'use strict';

let {
    contain, union, reduce, difference, forEach
} = require('bolzano');

let {
    isArray
} = require('basetype');

module.exports = (grammer) => {
    // cache first set
    let firstMap = {};

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

    let first = (X) => {
        if (firstMap[X]) return firstMap[X];
        let ret = firstSet(X);
        firstMap[X] = ret;
        return ret;
    };

    let firstSet = (X) => {
        let {
            isTerminalSymbol,
            getProductionsOf,
            isEmptyProduction,
            getBody,
            EPSILON
        } = grammer;

        if (isTerminalSymbol(X)) {
            return [X];
        } else {
            // find all productions start with X
            let ps = getProductionsOf(X);

            return reduce(ps, (prev, production) => {
                let body = getBody(production);

                if (isEmptyProduction(production)) {
                    return union(prev, [EPSILON]); // union ε
                } else {
                    if (isTerminalSymbol(body[0])) {
                        return union(prev, [body[0]]);
                    } else {
                        return union(prev, firstList(body, grammer));
                    }
                }
            }, []);
        }
    };

    /**
     * [...ab...]
     */
    let firstList = (body) => {
        let {
            EPSILON
        } = grammer;

        let ret = [];
        forEach(body, (y, index) => {
            let set = first(y);

            ret = union(ret, difference(set, [EPSILON]));
            if (!contain(set, EPSILON)) { // stop
                return true;
            }

            if (index === body.length - 1) {
                ret = union(ret, [EPSILON]);
            }
        });

        return ret;
    };

    return (alpha) => {
        if (isArray(alpha)) {
            return firstList(alpha);
        } else {
            return first(alpha);
        }
    };
};
