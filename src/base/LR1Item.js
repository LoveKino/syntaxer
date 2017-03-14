'use strict';

let jsoneq = require('cl-jsoneq');

let first = require('./first');

let {
    union, reduce, filter
} = require('bolzano');

let LR1Item = (production, dotPosition, forwards, grammer) => {
    let {
        getHead, getBody, isTerminalSymbol, isEndSymbol
    } = grammer;

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
        return reduce(getForwards(), (prev, letter) => {
            return union(prev,
                filter(
                    first(afterNextRest().concat([letter]), grammer),
                    isTerminalSymbol // terminal
                )
            );
        }, []);
    };

    let isReducedItem = () => { // rest = ε && a = $
        return !afterNextRest().length && getForwards().length === 1 && isEndSymbol(getForwards()[0]);
    };

    let restIsNotEmpty = () => getBody(production).length && dotPosition < getBody(production).length;

    let nextPositionItem = () => {
        return LR1Item(production, dotPosition + 1, forwards, grammer);
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

// TODO
LR1Item.sameItem = (item1, item2) => {
    return jsoneq(item1.list(), item2.list());
};

LR1Item.fromList = ([head, body, dotPosition, forwards], grammer) => {
    return LR1Item([head, body], dotPosition, forwards, grammer);
};

LR1Item.acceptItem = (grammer) => {
    return LR1Item([grammer.EXPAND_START_SYMBOL, [grammer.startSymbol]], 1, [grammer.END_SYMBOL], grammer);
};

LR1Item.isAcceptItem = (item) => {
    return LR1Item.sameItem(LR1Item.acceptItem(item.getGrammer()), item);
};

LR1Item.initItem = (grammer) => {
    let item = LR1Item(
        [
            grammer.EXPAND_START_SYMBOL, [grammer.startSymbol]
        ],
        0, [grammer.END_SYMBOL],
        grammer
    );

    return item;
};

/**
 * [B → .γ, b]
 */
LR1Item.supItem = (production, symbol, grammer) => {
    return LR1Item(production, 0, [symbol], grammer);
};

LR1Item.union = (list1, list2) => {
    return union(list1, list2, {
        eq: LR1Item.sameItem
    });
};

module.exports = LR1Item;
