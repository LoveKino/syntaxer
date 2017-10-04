'use strict';

let First = require('./first');

let {
    union,
    reduce,
    filter,
    flat,
    map
} = require('bolzano');

let LR1Itemer = (grammer) => {
    let first = First(grammer);

    let LR1Item = function(production, dotPosition, forwards) {
        this.production = production;
        this.dotPosition = dotPosition;
        this.forwards = forwards;

        this.adjoints = null;
        this.serializeId = null;
        this.serializePrefixId = null;
    };

    // [A → α.Bβ, a]
    LR1Item.prototype.getNextSymbol = function() {
        return grammer.getBody(this.production)[this.dotPosition];
    };
    LR1Item.prototype.afterNextRest = function() {
        return grammer.getBody(this.production).slice(this.dotPosition + 1);
    };
    LR1Item.prototype.list = function() {
        return [grammer.getHead(this.production), grammer.getBody(this.production), this.dotPosition, this.forwards];
    };
    // change the forwards
    LR1Item.prototype.concatForwards = function(newForwards) {
        return new LR1Item(this.production, this.dotPosition, union(this.forwards, newForwards));
    };
    // [A → α.Bβ, a], FIRST(βa)
    LR1Item.prototype.getAdjoints = function() {
        if (this.adjoints === null) {
            let beta = this.afterNextRest();
            let ret = reduce(this.forwards, (prev, letter) => {
                let firstSet = beta.length ? first(beta.concat([letter])) : [letter];
                return prev.concat(filter(firstSet, (item) => grammer.isTerminalSymbol(item) || grammer.isEndSymbol(item)));
            }, []);

            this.adjoints = ret;
        }
        return this.adjoints;
    };
    // rest = ε && a = $
    LR1Item.prototype.isReducedItem = function() {
        return !this.afterNextRest().length && this.forwards.length === 1 && grammer.isEndSymbol(this.forwards[0]);
    };
    LR1Item.prototype.restIsNotEmpty = function() {
        return grammer.getBody(this.production).length && this.dotPosition < grammer.getBody(this.production).length
    };
    LR1Item.prototype.nextPositionItem = function() {
        return new LR1Item(this.production, this.dotPosition + 1, this.forwards);
    };
    // [A → α., a] ϵ Ii, A≠S`
    LR1Item.prototype.isReduceItem = function() {
        return this.dotPosition === grammer.getBody(this.production).length;
    };
    LR1Item.prototype.serialize = function() {
        if (this.serializeId === null) {
            this.serializeId = JSON.stringify([this.production, this.dotPosition, this.forwards.sort()]);
        }
        return this.serializeId;
    };
    LR1Item.prototype.serializePrefix = function() {
        if (this.serializePrefixId === null) {
            this.serializePrefixId = JSON.stringify([this.production, this.dotPosition]);
        }

        return this.serializePrefixId;
    };

    // S` -> S., $
    const acceptItem = new LR1Item(grammer.expandedProduction, 1, [grammer.END_SYMBOL]);

    let isAcceptItem = (item) => {
        return sameItem(acceptItem, item);
    };

    var sameItem = (item1, item2) => {
        return item1.serialize() === item2.serialize();
    };

    let initItem = () => {
        let item = new LR1Item(
            grammer.expandedProduction,
            0, [grammer.END_SYMBOL]
        );

        return item;
    };

    let fromList = ([head, body, dotPosition, forwards]) => {
        return new LR1Item([head, body], dotPosition, forwards);
    };

    /**
     * [B → .γ, b]
     */
    let supItem = (production, symbol) => {
        return new LR1Item(production, 0, [symbol]);
    };

    let expandCacheMap = {};
    let expandItem = (item) => {
        let serializeId = item.serialize();

        if (expandCacheMap[serializeId]) {
            return expandCacheMap[serializeId].slice(0);
        }

        let next = item.getNextSymbol();

        if (!next || !grammer.isNoneTerminalSymbol(next)) return [];

        let nextProductions = grammer.getProductionsOf(next);

        let newItems = flat(map(nextProductions, (production) => item.isReducedItem() ? [
            supItem(production, grammer.END_SYMBOL)
        ] : map(item.getAdjoints(), (b) => supItem(production, b))));

        expandCacheMap[serializeId] = newItems;

        return newItems;
    };

    return {
        expandItem,
        isAcceptItem,
        sameItem,
        initItem,
        fromList,
        supItem
    };
};

module.exports = {
    LR1Itemer
};
