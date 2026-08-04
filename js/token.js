const TokenType = Object.freeze({
    WORD: 0,
    KW_DEFAULT: 1,
    KW_ENABLE: 2,
    KW_DISABLE: 3,
    KW_ENABLE_DISABLE: 4,
    KW_ON: 5,
    KW_OFF: 6,
    KW_DIRECTORY: 7,
    KW_PATH: 8,
    KW_FILE: 9,
    KW_FLAG: 10,
    KW_OR: 11,
    KW_AND: 12,
    KW_ONE: 13,
    KW_OF: 14,
    COMMA: 15,
    COLON: 16,
    DOT: 17,
    QUOTE: 18
})

class Token {
    /**
     * @param {string} val 
     * @param {number} type 
     */
    constructor(val, type) {
        this.val = val
        this.type = type
    }
}