import { Property, Option } from "./props.js"
import { analize, splitTokens } from "./analizer.js"
import { tokenize } from "./lexer.js"


/** 
 * @param {Object.<string, Property>} props
 * @param {string[]} targets 
 * @returns {Object}
 */
export function generateSchemaObject(props, targets) {

    // default
    let output = {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "c3-config.schema.json",
        "title": "C3 Config Schema",
        "description": "JSON schema for the C3 language",
        "type": "object",

        "required": ["targets"],
        "properties": {
            "targets": {
                "type": "object",
                "minProperties": 1,

                "additionalProperties": {
                    "required": ["type"],
                    "properties": {}
                }
            }
        }
    }

    function core(props, location, ignore) {

        for (const [key, prop] of Object.entries(props)) {

            if (key === ignore) { continue }

            let schema = {}

            schema["description"] = prop.description
            schema["default"] = prop.defaultv

            // configure type
            if (prop.isGlobal) {
                schema["type"] = "array"
                
                if (prop.type !== "") { schema["items"] = { "type": prop.type } }
            } else if (prop.type !== "") {
                schema["type"] = prop.type
            }

            // handle options
            if (prop.hasOptDesc) {
                
                schema["oneof"] = []

                for (const option of prop.options) {
                    schema["oneof"].push({
                        "const": option.opt,
                        "description": option.desc
                    })
                }

            } else {
                schema["enum"] = []

                for (const option of prop.options) {
                    schema["enum"].push(option.opt)
                }
            }

            location[key] = schema
        }
    }

    core(props, output.properties, "TARGET")
    core(props["TARGET"], output.properties.targets.additionalProperties.properties, "")

    // set targets
    if ("target" in output.properties) { output.properties["target"]["enum"] = targets }
    if ("target" in output.properties.targets.additionalProperties.properties) { output.properties.targets.additionalProperties.properties["target"]["enum"] = targets }

    return output
}