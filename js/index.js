import { tokenize } from "./lexer.js"
import { analize, splitTokens } from "./analizer.js"
import { generateSchemaObject } from "./generator.js"
import { getTargetsList } from "./targets.js"

const inputBoxProps = document.getElementById("input-box-props")
const inputBoxTargets = document.getElementById("input-box-targets")
const outputBox = document.getElementById("output-box")
const generateBtn = document.getElementById("generate")


function validateInput() {
    if (inputBoxProps.value.length === 0) { return "Properties textbox is empty"}
    if (inputBoxTargets.value.length === 0) { return "Targets textbox is empty"}

    return ""
}

function inputError() {
    outputBox.style.color = "#ff0000"
}


generateBtn.addEventListener("click", () => {

    let err = validateInput()
    if (err !== "") {
        inputError()
        outputBox.value = err
        return
    }

    outputBox.style.color = "var(--text-clr)"

    inputBoxProps.value += '\n'
    inputBoxTargets.value += '\n'

    outputBox.value = JSON.stringify(generateSchemaObject(
        analize( splitTokens( tokenize( inputBoxProps.value))),
        getTargetsList(inputBoxTargets.value)
    ), null, 2)
})