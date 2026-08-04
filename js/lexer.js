import {Token, TokenType} from './token.js'


/**
 * @param {string} text
 * @returns {Token[]}
*/
export function tokenize(text) {

    function atEnd() { return i >= text.length }
    function curr() { return text[i] }

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

                tokenArr.push(token)
                token = new Token("", 0)
                break
            
            default:
                token.val += curr()
        }

        i++
    }

    return tokenArr
}

// test
tokenize("placeholder:  Placeholder variable name for prototyping: foo, bar, baz").forEach(token => console.log(token.val));