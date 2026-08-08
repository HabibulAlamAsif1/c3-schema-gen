# c3-schema-gen
<img src="assets/c3-json.png" align="right" width="140"/>

_- MIT_\
_- v1.0.0 stable_
  
_c3-schema-gen_ is a simple tool that generates a JSON schema for the C3 language `project.json` file specific to your environment.

## 1. Why Use JSON Schema
Normally, to write the `project.json` file you would have to:
1. Enter `c3c --list-project-properties`.
2. Find the specific property you are looking for.
3. Go back in the editor to write said property.
4. Validate the config file (running c3c) and update it accordingly.

JSON schemas solve this minor inconvenience by providing you with auto-complete, descriptions and validation right inside the IDE.

## 2. What This Tool Solves
Supported properties of the `project.json` file varies from environment to environment. This makes it so static schemas are limited to:

- Supporting only common properties.
- Not work for everyone.
- Have multiple environment specific schemas.
- Or support all possible properties.

_c3-schema-gen_ solves this by parsing the output of specific commands from the c3 compiler into a specialized JSON schema.

## 3. How To Use This
Since tool is hosted via github pages, you can use this tool right now without any installing or setup by going to the [c3-schema-gen webpage](https://habibulalamasif1.github.io/c3-schema-gen/). If you scroll down the webpage you may find a 5-step guide on how you can use this.
