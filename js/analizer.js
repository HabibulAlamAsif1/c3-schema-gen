import { Property, Option } from "./props.js";
import { Token, TokenType } from "./token.js";

const State = Object.freeze({
    DESC: 0,
    OPTIONS: 1,
    OPT_DESC: 2
})


/**
 * @param {Token[]} tokenArr
 * @returns {{global: Token[][], target: Token[][]}}
 */
export function splitTokens(tokenArr) {
    function atEnd() { return i >= tokenArr.length }
    function curr() { return tokenArr[i] }

    let i = 0

    let target = "NAN"

    let tokenRow = []
    let output = {global: [], target: []}

    while (!atEnd()) {

        if (curr().type == TokenType.END) {
            
            if (target === "global") { output.global.push(tokenRow) }
            else if (target === "target") { output.target.push(tokenRow) }

            tokenRow = []

        } else if (curr().type == TokenType.CAT_GLOABL) {
            target = "global"
            i++

        } else if (curr().type == TokenType.CAT_TARGET) {
            target = "target"
            output.global.pop()
            i++

        } else {
            tokenRow.push(curr())
        }

        i++
    }

    return output
}

function charSinceLastSpace(text = "") {
    let i = text.length - 1
    let output = 0

    
    while (i > 0) {
        if (text[i] == ' ') { break }

        i--
        output++
    }
    
    return output
}


/**
 * @param {{global: Token[][], target: Token[][]}} tokens
 * @returns {Object.<string, Property>}
*/
export function analize(tokens) {

    function handleWord(word = "", prefix = ' ') {
        if (state == State.DESC) {
            prop.description += prefix + word
            return
        }

        if (state == State.OPTIONS) {
            prop.options.push(new Option(word, "" ))
            currentOption++
            return
        }

        prop.options[currentOption].desc += word + ' '
        prop.hasOptDesc = true
    }

    function listEntered() {
        state = State.OPTIONS
        prop.isArray = true
        prop.type = "string"
    }

    function typeCheck(type) {
        if (type == TokenType.T_BOOL) {
            prop.type = "boolean"
            return
        }

        if (type == TokenType.T_STRING) {
            prop.type = "string"
            return
        }
    }

    function testToken(/**@type {Token[]}*/ tokenRow, i = 0) {
        
        function peek(by) { return tokenRow[i + by] }
        function peekBack(by) { return tokenRow[i - by] }

        let idx = 0
        const token = tokenRow[i]

        switch (token.type) {

            case TokenType.KW_DEFAULT:
                if (peek(1).type == TokenType.KW_IS || peek(1).type == TokenType.COLON || peek(1).type == TokenType.KW_TO) {
                    prop.defaultv = peek(2).val
                    typeCheck(peek(2).type)

                    idx += 3
                    break
                }

                if (peek(1).type == TokenType.PAREN_CLOSE) {
                    prop.defaultv = peekBack(2).val
                    break
                }

                handleWord(token.val)
                break

            case TokenType.KW_ONE:
                if (peek(1).type == TokenType.KW_of) {
                    listEntered()
                    idx++
                    break
                }

                handleWord(token.val)
                break

            case TokenType.T_LIST:
                if (peek(1).type == TokenType.KW_ARE) {
                    listEntered()
                    prop.description = prop.description.slice(0, -charSinceLastSpace(prop.description))
                    idx++
                    break
                }

                handleWord(token.val)
                break

            case TokenType.COLON:
                listEntered()
                break

            case TokenType.T_BOOL:
                prop.type = "boolean"
                handleWord(token.val)
                break
            
            case TokenType.T_STRING:
                prop.type = "string"
                handleWord(token.val)
                break
                
            case TokenType.PAREN_OPEN:
                if (state == State.OPTIONS) {
                    state = State.OPT_DESC
                    break
                }

                if (peek(1).type == TokenType.KW_DEFAULT) { break }

                handleWord(token.val)
                break

            case TokenType.PAREN_CLOSE:
                if (state == State.OPT_DESC) {
                    state = State.OPTIONS
                    break
                }

                if (peekBack(1).type == TokenType.KW_DEFAULT) { break }

                handleWord(token.val)
                break
            
            case TokenType.SEPARATOR:
                if (state == State.OPTIONS) { break }
                handleWord(token.val, "")
                break

            case TokenType.KW_OR:
            case TokenType.KW_AND:
                if (state == State.OPTIONS) { break }

            case TokenType.KW_IS:
            case TokenType.KW_TO:
            case TokenType.WORD:
                handleWord(token.val)
                break

        }

        return idx;
    }


    let state = State.DESC
    let currentOption = -1

    let prop = new Property(false, "", "", "", false, [])
    let props = {TARGET: {}}

    function core(location, stage) {

        for (const tokenRow of /**@type {Token[][]} */ (tokens[stage])) {

            if (tokenRow.length == 0) { continue }

            const key = tokenRow[0].val

            for (let k = 1; k < tokenRow.length; k++) {

                k += testToken(tokenRow, k)
            }

            location[key] = prop

            state = State.DESC
            prop = new Property(false, "", "", "", false, [])
            currentOption = -1
        }

    }

    core(props, "global")
    core(props.TARGET, "target")
       

    return props
}
