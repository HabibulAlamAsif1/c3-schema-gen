import { tokenize } from "./lexer.js"
import { analize, splitTokens } from "./analizer.js"
import { generateSchemaObject } from "./generator.js"
import { getTargetsList } from "./targets.js"

const inputBoxProps = document.getElementById("input-box-props")
const inputBoxTargets = document.getElementById("input-box-targets")
const outputBox = document.getElementById("output-box")
const generateBtn = document.getElementById("generate")
const downloadBtn = document.getElementById("download-btn")


inputBoxProps.addEventListener("input", (e) => {
    if (e.currentTarget.value === "" || inputBoxTargets.value === "") {
        if (!generateBtn.classList.contains("inactive")) { downloadBtn.classList.add("inactive") }
        return
    } else {
        if (generateBtn.classList.contains("inactive")) { downloadBtn.classList.remove("inactive") }
    }
})

inputBoxTargets.addEventListener("input", (e) => {
    if (e.currentTarget.value === "" || inputBoxTargets.value === "") {
        if (!generateBtn.classList.contains("inactive")) { downloadBtn.classList.add("inactive") }
        return
    } else {
        if (generateBtn.classList.contains("inactive")) { downloadBtn.classList.remove("inactive") }
    }
})

outputBox.addEventListener("input", (e) => {
    if (e.currentTarget.value === "") {
        if (!downloadBtn.classList.contains("inactive")) { downloadBtn.classList.add("inactive") }
        return
    }
})

generateBtn.addEventListener("click", (e) => {

    if (e.currentTarget.classList.contains("inactive")) { return }

    inputBoxProps.value += '\n'
    inputBoxTargets.value += '\n'

    outputBox.value = JSON.stringify(generateSchemaObject(
        analize( splitTokens( tokenize( inputBoxProps.value))),
        getTargetsList(inputBoxTargets.value)
    ), null, 2)

    if (downloadBtn.classList.contains("inactive")) { downloadBtn.classList.remove("inactive") }
})


for (const pasteBtn of document.getElementsByClassName("paste-btn")) { pasteBtn.addEventListener("click", (e) => {
    const textbox = e.currentTarget.parentElement.parentElement.querySelector("textarea")

    navigator.clipboard.readText().then((value) => { textbox.value = value })
    textbox.dispatchEvent(new Event("input"))
}) }

for (const clearBtn of document.getElementsByClassName("clear-btn")) { clearBtn.addEventListener("click", (e) => {
    /**@type {HTMLTextAreaElement} */
    const textbox = e.currentTarget.parentElement.parentElement.querySelector("textarea")

    textbox.value = ""
    textbox.dispatchEvent(new Event("input"))
}) }

document.getElementById("copy-btn").addEventListener("click", async (e) => {
    try {
        await navigator.clipboard.writeText(outputBox.value)
    } catch (err) {
        console.log(err.message)
    }
})

downloadBtn.addEventListener("click", (e) => {
    if (e.target.classList.contains("inactive")) { return }

    const blob = new Blob([outputBox.value], { type: "application/json" })
    const blobURL = URL.createObjectURL(blob)
    const link = document.createElement("a")

    link.href = blobURL
    link.download = "c3-config.schema.json"
    link.click()

    URL.revokeObjectURL(blobURL)
    link.remove()
})