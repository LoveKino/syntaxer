'use strict';

let {
    contain, union, reduce, filter, difference, forEach
} = require('bolzano');

let {
    isArray
} = require('basetype');

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

let first = (X, T, N, productions) => {
    if (contain(T, X)) {
        return [X];
    } else {
        let ps = filter(productions, ([head]) => head === X);
        return reduce(ps, (prev, [head, body]) => { // eslint-disable-line
            if (!body.length) {
                return union(prev, [null]);
            } else {
                if (contain(T, body[0])) {
                    return union(prev, [body[0]]);
                } else {
                    return union(prev, firstList(body, T, N, productions));
                }
            }
        }, []);
    }
};

let firstList = (body, T, N, productions) => {
    let ret = [];
    forEach(body, (y, index) => {
        let set = first(y, T, N, productions);
        ret = union(ret, difference(set, [null]));
        if (!contain(set, null)) {
            return true;
        }

        if (index === body.length - 1) {
            ret = union(ret, [null]);
        }
    });

    return ret;
};

module.exports = (alpha, T, N, productions) => {
    if (isArray(alpha)) {
        return firstList(alpha, T, N, productions);
    } else {
        return first(alpha, T, N, productions);
    }
};
