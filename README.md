# c3-schema-gen
<img src="assets/c3-json.svg" align="right" height="200" />

_c3-schema-gen_ is a simple web tool run on github pages that generates JSON schema text for the C3 programming language config specific to your environment.

JSON schemas allow for IDE support which can boost your productivity and reduce having to go back and forth between the command line and the file.

However, supported properties of the `project.json` file varies from environment to environment. This makes it so the JSON schema is limited to either:

- Supporting only common properties.
- Not work for everyone.
- Have multiple toolchain specific schemas.
- Or support all possible properties, which would block out the usable properties and be inconvenient.

This tool solves this by parsing output from the c3 compiler and turning them into a JSON schema specific to your environment.
