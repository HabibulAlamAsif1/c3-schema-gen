import { Property, Option } from "./props.js"
import { analize, splitTokens } from "./analizer.js"
import { tokenize } from "./lexer.js"


/** @param {Object.<string, Property>} props */
export function generateSchema(props) {

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

    for (const [key, prop] of Object.entries(props)) {
        let schema = {}
        let location = output.properties

        schema["description"] = prop.description
        schema["default"] = prop.defaultv

        // handle global prop vs target prop
        if (!prop.isGlobal) { location = output.properties.targets.additionalProperties.properties }

        // configure type
        if (prop.isArray) {
            schema["type"] = "array"
            
            if (prop.type !== "") { schema["items"] = { "type": prop.type } }
        } else if (prop.type !== "") {
            scheam["type"] = prop.type
        }

        location[key] = schema
    }

    return output
}


const test = generateSchema( analize( splitTokens( tokenize(
    `Project properties
    ------------------
    $schema                            Json schema url
    `
))))

console.log(JSON.stringify(test, null, 2))