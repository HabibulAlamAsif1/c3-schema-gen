export function getTargetsList(text = "") {
    let word = ""
    let headerFound = false
    let output = []

    for (const c of text) {
        switch (c) {
            case ' ':
            case '\n':
            case '\r':
            case '\t':
            case '\v':
                if (word === "" || !headerFound) { break }
                output.push(word)
                word = ""
                break

            case ':':
                headerFound = true
                word = ""
                break

            default:
                word += c
        }
    }

    return output
}