import {Token, TokenType} from './token.js'


// NOTE: if a keyword ends with 's' but follows a different pattern than regular plurals
// then it also must be declared here with the last character omitted
const wordMap = {
    "default":           TokenType.KW_DEFAULT,

    "on":                TokenType.T_BOOL,
    "off":               TokenType.T_BOOL,
    "true":              TokenType.T_BOOL,
    "false":             TokenType.T_BOOL,
    "enable":            TokenType.T_BOOL,
    "disable":           TokenType.T_BOOL,
    "enable/disable":    TokenType.T_BOOL,
    "bool":              TokenType.T_BOOL,
    "boolean":           TokenType.T_BOOL,

    "directory":         TokenType.T_STRING,
    "directorie":        TokenType.T_STRING,
    "source":            TokenType.T_STRING,
    "file":              TokenType.T_STRING,
    "path":              TokenType.T_STRING,

    "version":           TokenType.T_STRING,
    "name":              TokenType.T_STRING,
    "url":               TokenType.T_STRING,
    "arg":               TokenType.T_STRING,
    "argument":          TokenType.T_STRING,
    "string":            TokenType.T_STRING,

    "option":            TokenType.T_LIST,
    "list":              TokenType.T_LIST,

    "or":                TokenType.KW_OR,
    "and":               TokenType.KW_AND,
    "one":               TokenType.KW_ONE,
    "of":                TokenType.KW_OF,
    "if":                TokenType.KW_IF,
    "is":                TokenType.KW_IS,
    "to":                TokenType.KW_TO,

    "------------------": TokenType.CAT_GLOABL,
    "-----------------": TokenType.CAT_TARGET
}


function mapWordToType(word = "") {
    word  = word.toLowerCase()
    if (word[-1] === 's') { word = word.slice(0, -1) } // if last character is 's' omit it

    if (word in wordMap) { return wordMap[word] }

    return TokenType.WORD
}


/**@returns {Token[]}*/
export function tokenize(text = "") {

    function atEnd() { return i >= text.length }
    function curr() { return text[i] }
    
    function appendWord() {
        if (token.val === "") { return }

        token.type = mapWordToType(token.val)

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
            case '\r':
            case '\t':
            case '\v':    appendWord(); break

            case '\n':    appendOperator(TokenType.END); break
            
            case ':':     appendOperator(TokenType.COLON); break
            case ',':     appendOperator(TokenType.COMMA); break
            case '.':     appendOperator(TokenType.DOT); break
            
            case '(':     appendOperator(TokenType.PAREN_OPEN); break
            case ')':     appendOperator(TokenType.PAREN_CLOSE); break

            case '"':
            case '\'':    appendOperator(TokenType.QUOTE); break 
            
            default:      token.val += curr()
        }

        i++
    }

    if (token.val !== "") { appendWord() }

    return tokenArr
}

// test
tokenize(
    "  linux-libc                         Set the libc to use for Linux. Valid options are 'host', 'gnu' and 'musl', default is 'host'"
).forEach(token => console.log(`${token.val} | ${token.type}`));