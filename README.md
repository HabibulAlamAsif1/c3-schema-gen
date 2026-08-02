# c3-schema-gen
<img src="assets/c3-json.png" align="right" width="140"/>

_c3-schema-gen_ is simple tool generates a JSON schema for the C3 language config specific to your environment.

Supported properties of the `project.json` file varies from environment to environment. This makes it so the schema is limited to either:

- Supporting only common properties.
- Not work for everyone.
- Have multiple environment specific schemas.
- Or support all possible properties.

_c3-schema-gen_ solves this by parsing the output of specific commands from the c3 compiler into a JSON schema specific to your environment.
