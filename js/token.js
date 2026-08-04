export const TokenType = Object.freeze({
    WORD: 0,
    KW_DEFAULT: 1,
    KW_OR: 2,
    KW_AND: 3,
    KW_ONE: 4,
    KW_OF: 5,
    T_BOOL: 6,
    T_STRING: 7,
    COMMA: 8,
    COLON: 9,
    DOT: 10,
    QUOTE: 11
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