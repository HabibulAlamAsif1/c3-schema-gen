import {Token, TokenType} from './token.js'


/**
 * @param {string} text
 * @returns {Token[]}
*/
export function tokenize(text) {

    function atEnd() { return i >= text.length }
    function curr() { return text[i] }

    function appendWord() {
        tokenArr.push(token)
        token = new Token("", 0)
    }

    function appendOperator(type) {
        appendWord()
        tokenArr.push(new Token(curr(), type))
    }

    let i = 0

    let token = new Token("", 0)
    let tokenArr = []

    while (!atEnd()) {
        switch (curr()) {
            case ' ':
            case '\n':
            case '\r':
            case '\t':
            case '\v':
                if (token.val === "")  { break }

                appendWord()
                break
            
            case ':':     appendOperator(TokenType.COLON); break
            case ',':     appendOperator(TokenType.COMMA); break
            case '.':     appendOperator(TokenType.DOT); break
            
            case '"':
            case '\'':    appendOperator(TokenType.QUOTE); break 
            
            default:
                token.val += curr()
        }

        i++
    }

    if (token.val !== "") { appendWord() }

    return tokenArr
}

// test
tokenize(
    "placeholder  Placeholder variable name for prototyping: foo, bar, baz."
).forEach(token => console.log(`${token.val} | ${token.type}`));