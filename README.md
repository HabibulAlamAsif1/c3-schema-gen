# c3-schema-gen
<img src="assets/c3-json.png" align="right" width="140"/>

_c3-schema-gen_ is a simple tool that generates a JSON schema for the C3 language `project.json` file specific to your environment.

## 1. Why Use JSON Schema
Normally, to write the `project.json` file you would have to:
1. Enter `c3c --list-project-properties`.
2. Find the specific property you are looking for.
3. Go back in the editor to write said property.
4. Validate the config file (running c3c) and update it accordingly.

JSON schemas solve this minor inconvenience by providing you with auto-complete, descriptions and validation right inside the IDE.

## 2. What This Tool Solves
Supported properties of the `project.json` file varies from environment to environment. This makes it so statuc schemas are limited to:

- Supporting only common properties.
- Not work for everyone.
- Have multiple environment specific schemas.
- Or support all possible properties.

_c3-schema-gen_ solves this by parsing the output of specific commands from the c3 compiler into a specialized JSON schema.

## 3. How To Use This
1. Go to the [webpage](https://habibulalamasif1.github.io/c3-schema-gen/) hosted via github pages. Below the header you will see three labeled textareas.
2. On the 'Properties' textarea, paste the output from the command: `c3c --list-project-properties`.
3. On the 'Targets' textarea, paste the output from the command: `c3c --lost-targets`.
4. Click the 'Generate' button.
5. Copy the text in the 'Output' textarea into a file named `c3-config.schema.json` in the project directory. Or download it as a file by clicking the download icon and moving it into your project directory.
6. Write `"$schema": "./c3-config.schema.json"` in the `project.json` file.