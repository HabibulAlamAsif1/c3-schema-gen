export const TokenType = Object.freeze({
    WORD: 0,
    COMMA: 1,
    COLON: 2,
    DOT: 3,
    CAT_GLOABL: 4,
    CAT_TARGET: 5,
    KW_TO: 6,
    KW_ONE: 7,
    KW_OF: 8,
    KW_OR: 9,
    KW_AND: 10,
    KW_DEFAULT: 11,
    KW_IF: 12,
    KW_IS: 13,
    T_STRING: 14,
    T_BOOL: 15,
    T_LIST: 16,
    END: 27,
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