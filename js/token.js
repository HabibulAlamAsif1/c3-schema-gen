export const TokenType = Object.freeze({
    WORD: 0,

    COLON: 1,
    SEPARATOR: 2,
    PAREN_OPEN: 3,
    PAREN_CLOSE: 4,

    CAT_GLOABL: 5,
    CAT_TARGET: 6,

    KW_ARE: 7,
    KW_ONE: 8,
    KW_OF: 9,
    KW_AND: 10,
    KW_OR: 11,
    KW_IS: 12,
    KW_DEFAULT: 13,
    KW_TO: 14,

    T_BOOL: 15,
    T_LIST: 16,
    T_STRING: 17,

    END: 18,
})

export class Token {
    /**
     * @param {string} val 
     * @param {number} type 
     */
    constructor(val, type) {
        this.val = val
        this.type = type
    }
}