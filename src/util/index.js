'use strict';

let eqList = (list1, list2) => {
    if (list1.length !== list2.length) return false;
    let len = list1.length;
    for (let i = 0; i < len; i++) {
        if (list1[i] !== list2[i]) return false;
    }

    return true;
};

module.exports = {
    eqList
};
