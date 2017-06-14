'use strict';

let First = require('./first');

let {
    union, reduce, filter, findIndex
} = require('bolzano');

let {
    eqList
} = require('../util');

let LR1Itemer = (grammer) => {
    let first = First(grammer);

    let buildLR1Item = (production, dotPosition, forwards) => {
        let {
            getHead, getBody, isTerminalSymbol, isEndSymbol
        } = grammer;

        // [A → α.Bβ, a]
        let getNextSymbol = () => {
            return getBody(production)[dotPosition];
        };

        let getForwards = () => forwards;

        let afterNextRest = () => getBody(production).slice(dotPosition + 1);

        let list = () => [getHead(production), getBody(production), dotPosition, forwards];

        let concatForwards = (newForwards) => {
            forwards = union(forwards, newForwards);
        };

        // [A → α.Bβ, a], FIRST(βa)
        let getAdjoints = () => {
            let ret = reduce(getForwards(), (prev, letter) => {
                let beta = afterNextRest();
                let firstSet = beta.length ? first(beta.concat([letter])) : [letter];

                return union(prev, filter(firstSet, (item) => isTerminalSymbol(item) || isEndSymbol(item)));
            }, []);

            return ret;
        };

        let isReducedItem = () => { // rest = ε && a = $
            return !afterNextRest().length && getForwards().length === 1 && isEndSymbol(getForwards()[0]);
        };

        let restIsNotEmpty = () => getBody(production).length && dotPosition < getBody(production).length;

        let nextPositionItem = () => {
            return buildLR1Item(production, dotPosition + 1, forwards, grammer);
        };

        let getGrammer = () => grammer;

        // [A → α., a] ϵ Ii, A≠S`
        let isReduceItem = () => {
            return dotPosition === getBody(production).length;
        };

        let getProduction = () => production;

        return {
            getNextSymbol,
            getProduction,
            getForwards,
            afterNextRest,
            list,
            concatForwards,
            getAdjoints,
            isReducedItem,
            restIsNotEmpty,
            nextPositionItem,
            getGrammer,
            isReduceItem
        };
    };

    // S` -> S.
    var acceptItem = () => {
        return buildLR1Item([grammer.EXPAND_START_SYMBOL, [grammer.startSymbol]], 1, [grammer.END_SYMBOL]);
    };

    let isAcceptItem = (item) => {
        return sameItem(acceptItem(item.getGrammer()), item);
    };

    // TODO
    var sameItem = (item1, item2) => {
        let [head1, body1, dotPosition1, forwards1] = item1.list();
        let [head2, body2, dotPosition2, forwards2] = item2.list();

        return head1 === head2 && dotPosition1 === dotPosition2 && eqList(forwards1, forwards2) && eqList(body1, body2);
    };

    var samePrefix = (item1, item2) => {
        let [head1, body1, dotPosition1] = item1.list();
        let [head2, body2, dotPosition2] = item2.list();
        return head1 === head2 && dotPosition1 === dotPosition2 && eqList(body1, body2);
    };

    var compressItemSet = (I) => {
        return reduce(I, (prev, item) => {
            let itemIndex = findIndex(prev, (v) => {
                return samePrefix(item, v);
            });

            if (itemIndex !== -1) {
                // expand
                prev[itemIndex].concatForwards(item.getForwards());
            } else {
                prev.push(item);
            }

            return prev;
        }, []);
    };

    let initItem = () => {
        let item = buildLR1Item(
            [grammer.EXPAND_START_SYMBOL, [grammer.startSymbol]],
            0, [grammer.END_SYMBOL]
        );

        return item;
    };

    let unionLR1Items = (list1, list2) => {
        return union(list1, list2, {
            eq: sameItem
        });
    };

    let fromList = ([head, body, dotPosition, forwards]) => {
        return buildLR1Item([head, body], dotPosition, forwards);
    };

    /**
     * [B → .γ, b]
     */
    let supItem = (production, symbol) => {
        return buildLR1Item(production, 0, [symbol]);
    };

    return {
        buildLR1Item,
        isAcceptItem,
        sameItem,
        initItem,
        unionLR1Items,
        fromList,
        supItem,
        compressItemSet
    };
};

module.exports = {
    LR1Itemer
};
