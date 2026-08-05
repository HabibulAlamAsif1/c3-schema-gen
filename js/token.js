export const TokenType = Object.freeze({
    WORD: 0,

    COLON: 1,
    SEPARATOR: 2,
    PAREN_OPEN: 3,
    PAREN_CLOSE: 6,

    CAT_GLOABL: 7,
    CAT_TARGET: 8,

    KW_ARE: 9,
    KW_ONE: 10,
    KW_OF: 11,
    KW_AND: 12,
    KW_OR: 13,
    KW_IS: 14,
    KW_DEFAULT: 15,
    KW_TO: 16,

    T_BOOL: 17,
    T_LIST: 18,
    T_STRING: 19,

    END: 20,
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