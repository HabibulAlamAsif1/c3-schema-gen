export const TokenType = Object.freeze({
    WORD: 0,
    COMMA: 1,
    COLON: 2,
    DOT: 3,
    QUOTE: 4,
    PAREN_OPEN: 5,
    PAREN_CLOSE: 6,
    CAT_GLOABL: 7,
    CAT_TARGET: 8,
    KW_TO: 9,
    KW_ONE: 10,
    KW_OF: 11,
    KW_OR: 12,
    KW_AND: 13,
    KW_DEFAULT: 14,
    KW_IF: 15,
    T_BOOL: 16,
    T_STRING: 17,
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