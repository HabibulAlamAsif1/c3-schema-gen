import { Property } from "./props.js";
import { Token, TokenType } from "./token.js";
import { tokenize } from "./lexer.js";


const State = Object.freeze({
    KEY: 0,
    DESC: 1,
    OPTIONs: 2,
})


/**
 * @param {Token[]} tokenArr
 * @returns {Token[][]}
 */
function findProperties(tokenArr) {
    function atEnd() { return i >= tokenArr.length }
    function curr() { return tokenArr[i] }

    let i = 0

    /**@type {Token[]} */
    let tokenRow = []

    /**@type {Token[][]} */
    let output = []

    while (!atEnd()) {

        if (curr().type == TokenType.END) {
            output.push(tokenRow)
            tokenRow = []
        } else {
            tokenRow.push(curr())
        }

        i++
    }

    return output
}


/**
 * @param {Token[][]} tokMatrix
 * @returns {Property[]}
 */
export function analize(tokMatrix) {
}


console.log(findProperties(tokenize(
    `  linux-libc                         Set the libc to use for Linux. Valid options are 'host', 'gnu' and 'musl', default is 'host'
       win-subsystem                      Windows subsystem: CONSOLE (default), WINDOWS (default if @winmain present), NATIVE, POSIX, BOOT_APPLICATION, EFI_APPLICATION, EFI_BOOT_SERVICE_DRIVER, EFI_ROM or EFI_RUNTIME_DRIVER.\n`
)))