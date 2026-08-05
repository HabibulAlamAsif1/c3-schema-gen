import { tokenize } from "./lexer.js"
import { analize, splitTokens } from "./analizer.js"
import { generateSchemaObject } from "./generator.js"

const root = document.documentElement 

const inputBoxProps = document.getElementById("input-box-props")
const inputBoxTargets = document.getElementById("input-box-targets")
const outputBox = document.getElementById("output-box")
const generateBtn = document.getElementById("generate")


generateBtn.addEventListener("click", () => {

    outputBox.value = JSON.stringify(generateSchemaObject(
        analize( splitTokens( tokenize( inputBoxProps.value))),
        inputBoxTargets.value.split('\n')
    ), null, 2)
})


if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    root.style.colorScheme = "dark"
    root.dataset.theme = "dark"
}


inputBoxProps.value = `
Project properties
------------------
$shema     A JSON scheam url.
placeholder  Placeholder variable names: foo (default), bar, baz. 
target    Compilation target.

Target properties
-----------------
target    Compilation target.
`

inputBoxTargets.value = `windows
macos
linux`