import { Property, Option } from "./props.js"


/** 
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
                    "properties": {
                        "symtab": {
                            "type": "number",
                            "description": "Sets the preferred symtab size.",
                            "default": 1048576
                        }
                    }
                },

                "description": "Set of targets for the project.",
                "default": {"myapp": {"type": "executable"}}
            },

            "symtab": {
                "type": "number",
                "description": "Sets the preferred symtab size.",
                "default": 1048576
            }
        }
    }

    function core(props, location, ignore) {

        function getDefault(type = "", value = "") {
            switch (type) {
                case "string":     return value

                case "boolean":
                    if (value === "true") { return true }
                    return false

                case "number":     return Number(value)

                default:           return null
            }
        }

        for (const [key, prop] of Object.entries(props)) {

            if (key === ignore || key in location) { continue }

            let schema = {}

            schema["description"] = prop.description

            // configure type
            if (prop.isArray) {
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

            } else if (prop.options.length > 0) {
                schema["enum"] = []

                for (const option of prop.options) {
                    schema["enum"].push(option.opt)
                }
            }

            // handle default
            let schemaDefault = getDefault(prop.type, prop.defaultv)

            if (prop.isArray && schemaDefault !== null) {
                schema["default"] = [schemaDefault]
            } else if (schemaDefault !== null) {
                schema["default"] = schemaDefault
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