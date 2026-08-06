import { Property, Option } from "./props.js";
import { Token, TokenType } from "./token.js";
import { tokenize } from "./lexer.js"


const State = Object.freeze({
    DESC: 0,
    OPTIONS: 1,
    OPT_DESC: 2
})


/**
 * @param {Token[]} tokenArr
 * @returns {{global: Token[][], target: Token[][]}}
 */
export function splitTokens(tokenArr) {
    function atEnd() { return i >= tokenArr.length }
    function curr() { return tokenArr[i] }

    let i = 0

    let target = "NAN"

    let tokenRow = []
    let output = {global: [], target: []}

    while (!atEnd()) {

        if (curr().type == TokenType.END) {
            
            if (target === "global") { output.global.push(tokenRow) }
            else if (target === "target") { output.target.push(tokenRow) }

            tokenRow = []

        } else if (curr().type == TokenType.CAT_GLOABL) {
            target = "global"
            i++

        } else if (curr().type == TokenType.CAT_TARGET) {
            target = "target"
            output.global.pop()
            i++

        } else {
            tokenRow.push(curr())
        }

        i++
    }

    return output
}

function charSinceLastSpace(text = "") {
    let i = text.length - 1
    let output = 0

    
    while (i > 0) {
        if (text[i] == ' ') { break }

        i--
        output++
    }
    
    return output
}


/**
 * @param {{global: Token[][], target: Token[][]}} tokens
 * @returns {Object.<string, Property>}
*/
export function analize(tokens) {

    function handleWord(word = "", prefix = ' ') {
        if (state == State.DESC) {
            prop.description += prefix + word
            return
        }

        if (state == State.OPTIONS) {
            prop.options.push(new Option(word, "" ))
            currentOption++
            return
        }

        prop.options[currentOption].desc += word + ' '
        prop.hasOptDesc = true
    }

    function listEntered() {
        state = State.OPTIONS
        prop.isArray = true
        prop.type = "string"
    }

    function typeCheck(type) {
        if (type == TokenType.T_BOOL) {
            prop.type = "boolean"
            return
        }

        if (type == TokenType.T_STRING) {
            prop.type = "string"
            return
        }
    }

    function testToken(/**@type {Token[]}*/ tokenRow, i = 0) {
        
        function peek(by) { return tokenRow[i + by] }
        function peekBack(by) { return tokenRow[i - by] }

        let idx = 0
        const token = tokenRow[i]

        switch (token.type) {

            case TokenType.KW_DEFAULT:
                if (peek(1).type == TokenType.KW_IS || peek(1).type == TokenType.COLON || peek(1).type == TokenType.KW_TO) {
                    prop.defaultv = peek(2).val
                    typeCheck(peek(2).type)

                    idx += 3
                    break
                }

                if (peek(1).type == TokenType.PAREN_CLOSE) {
                    prop.defaultv = peekBack(2).val
                    break
                }

                handleWord(token.val)
                break

            case TokenType.KW_ONE:
                if (peek(1).type == TokenType.KW_of) {
                    listEntered()
                    idx++
                    break
                }

                handleWord(token.val)
                break

            case TokenType.T_LIST:
                if (peek(1).type == TokenType.KW_ARE) {
                    listEntered()
                    prop.description = prop.description.slice(0, -charSinceLastSpace(prop.description))
                    idx++
                    break
                }

                handleWord(token.val)
                break

            case TokenType.COLON:
                listEntered()
                break

            case TokenType.T_BOOL:
                prop.type = "boolean"
                handleWord(token.val)
                break
            
            case TokenType.T_STRING:
                prop.type = "string"
                handleWord(token.val)
                break
                
            case TokenType.PAREN_OPEN:
                if (state == State.OPTIONS) {
                    state = State.OPT_DESC
                    break
                }

                if (peek(1).type == TokenType.KW_DEFAULT) { break }

                handleWord(token.val)
                break

            case TokenType.PAREN_CLOSE:
                if (state == State.OPT_DESC) {
                    state = State.OPTIONS
                    break
                }

                if (peekBack(1).type == TokenType.KW_DEFAULT) { break }

                handleWord(token.val)
                break
            
            case TokenType.SEPARATOR:
                if (state == State.OPTIONS) { break }
                handleWord(token.val, "")
                break

            case TokenType.KW_OR:
            case TokenType.KW_AND:
                if (state == State.OPTIONS) { break }

            case TokenType.KW_IS:
            case TokenType.KW_TO:
            case TokenType.WORD:
                handleWord(token.val)
                break

        }

        return idx;
    }


    let state = State.DESC
    let currentOption = -1

    let prop = new Property(false, "", "", "", false, [])
    let props = {TARGET: {}}

    function core(location, stage) {

        for (const tokenRow of /**@type {Token[][]} */ (tokens[stage])) {

            if (tokenRow.length == 0) { continue }

            const key = tokenRow[0].val

            for (let k = 1; k < tokenRow.length; k++) {

                k += testToken(tokenRow, k)
            }

            location[key] = prop
            console.log(key)

            state = State.DESC
            prop = new Property(false, "", "", "", false, [])
            currentOption = -1
        }

    }

    core(props, "global")
    core(props.TARGET, "target")
       

    return props
}

const test = analize( splitTokens( tokenize( 
    `Project properties
------------------
  $schema                            Json schema url
  authors                            Authors, optionally with email.
  android-api                        Set Android API version.
  android-ndk                        Set the NDK directory location.
  benchfn                            Override the benchmark function.
  build-dir                          Build location, where intermediate files are placed by default, relative to project file.
  c-include-dirs                     Set the include directories for C sources.
  c-sources                          Set the C sources to be compiled.
  cc                                 Set C compiler (defaults to 'cc').
  cflags                             C compiler flags.
  cpu                                CPU name, used for optimizations in the compiler backend.
  cpu-flags                          Set the cpu flags to add or remove with the format '+avx,-sse'.
  debug-info                         Debug level: none, line-tables, full.
  dependencies                       C3 library dependencies for all targets.
  dependency-search-paths            The C3 library search paths.
  exec                               Scripts run for all targets.
  features                           Features enabled for all targets.
  fp-math                            Set math behaviour: \`strict\`, \`relaxed\` or \`fast\`.
  langrev                            Version of the C3 language used.
  link-args                          Linker arguments for all targets.
  link-libc                          Link libc (default: true).
  custom-libc                        Implement your own libc (default: false).
  linked-libraries                   Libraries linked by the linker for all targets.
  linker                             'builtin' for the builtin linker, 'cc' for the system linker or <path> to a custom compiler.
  linker-search-paths                Linker search paths.
  linux-crt                          Set the directory to use for finding crt1.o and related files.
  linux-crtbegin                     Set the directory to use for finding crtbegin.o and related files.
  linux-libc                         Set the libc to use for Linux. Valid options are 'host', 'gnu' and 'musl', default is 'host'
  loop-vectorize                     Force enable/disable loop auto-vectorization.
  macos-min-version                  Set the minimum MacOS version to compile for.
  macos-sdk                          Set the directory for the MacOS SDK for cross compilation.
  macos-sdk-version                  Set the MacOS SDK compiled for.
  memory-env                         Set the memory environment: normal, small, tiny, none.
  merge-functions                    Force enable/disable function merging.
  no-entry                           Do not generate (or require) a main function.
  opt                                Optimization setting: O0, O1, O2, O3, O4, O5, Os, Oz.
  optlevel                           Code optimization level: none, less, more, max.
  optsize                            Code size optimization: none, small, tiny.
  output                             Output location, relative to project file.
  panic-msg                          Turn panic message output on or off.
  panicfn                            Override the panic function.
  quiet                              Silence unnecessary output.
  reloc                              Relocation model: none, pic, PIC, pie, PIE.
  riscv-abi                          RiscV ABI: int-only, float, double.
  riscv-cpu                          Set general level of RISC-V cpu: \`rvi\`, \`rvimac\`, \`rvimafc\`, \`rvgc\` or \`rvgcv\`.
  run-dir                            Override run directory for 'run'.
  safe                               Set safety (contracts, runtime bounds checking, null pointer checks etc) on or off.
  sanitize                           Enable sanitizer: none, address, memory, thread.
  script-dir                         The directory where 'exec' scripts are found.
  exec-dir                           The directory where 'exec' is run.
  show-backtrace                     Print backtrace on signals.
  single-module                      Compile all modules together, enables more inlining.
  slp-vectorize                      Force enable/disable SLP auto-vectorization.
  soft-float                         Output soft-float functions.
  sources                            Paths to project sources for all targets.
  strip-unused                       Strip unused code and globals from the output. (default: true)
  symtab                             Sets the preferred symtab size.
  target                             Compile for a particular architecture + OS target.
  targets                            Set of targets for the project.
  test-sources                       Paths to project test sources for all targets.
  testfn                             Override the test function.
  trap-on-wrap                       Make signed and unsigned integer overflow generate a panic rather than wrapping.
  unroll-loops                       Force enable/disable loop unrolling optimization.
  use-stdlib                         Include the standard library (default: true).
  vendor                             Vendor specific extensions, ignored by c3c.
  version                            Version using semantic versioning.
  warnings                           Warnings used for all targets.
  wincrt                             Windows CRT linking: none, static-debug, static, dynamic-debug (default if debug info enabled), dynamic (default).
  windef                             Windows def file, used as an alternative to dllexport when exporting a DLL.
  win-sdk                            Set the path to Windows system library files for cross compilation.
  win-subsystem                      Windows subsystem: CONSOLE (default), WINDOWS (default if @winmain present), NATIVE, POSIX, BOOT_APPLICATION, EFI_APPLICATION, EFI_BOOT_SERVICE_DRIVER, EFI_ROM or EFI_RUNTIME_DRIVER.
  x86-stack-struct-return            Return structs on the stack for x86.
  x86cpu                             Set general level of x64 cpu: baseline, ssse3, sse4, avx1, avx2-v1, avx2-v2 (Skylake/Zen1+), avx512 (Icelake/Zen4+), native.
  x86vec                             Set max type of vector use: none, mmx, sse, avx, avx512, native.
  bsd-sysroot                        Set the BSD sysroot directory.


Target properties
-----------------
  android-api                        Set Android API version.
  android-ndk                        Set the NDK directory location.
  benchfn                            Override the benchmark function.
  build-dir                          Build location, where intermediate files are placed by default, relative to project file.
  c-include-dirs                     C sources include directories for the target.
  c-include-dirs-override            Additional C sources include directories for the target, overriding global settings.
  c-sources                          Additional C sources to be compiled for the target.
  c-sources-override                 C sources to be compiled, overriding global settings.
  cc                                 Set C compiler (defaults to 'cc').
  cflags                             Additional C compiler flags for the target.
  cflags-override                    C compiler flags for the target, overriding global settings.
  cpu                                CPU name, used for optimizations in the compiler backend.
  cpu-flags                          Additional cpu flags to add or remove with the format '+avx,-sse'.
  cpu-flags-override                 Additional cpu flags to add or remove with the format '+avx,-sse', overriding global settings.
  debug-info                         Debug level: none, line-tables, full.
  dependencies                       Additional C3 library dependencies for the target.
  dependencies-override              C3 library dependencies for this target, overriding global settings.
  dependency-search-paths            Additional C3 library search paths for the target.
  dependency-search-paths-override   C3 library search paths for this target, overriding global settings.
  exec                               Additional scripts to run for the target.
  exec-override                      Scripts to run for this target, overriding global settings.
  extension                          Override the default file extension for the build output.
  features                           Features enabled for all targets.
  fp-math                            Set math behaviour: \`strict\`, \`relaxed\` or \`fast\`.
  langrev                            Version of the C3 language used.
  link-args                          Additional linker arguments for the target.
  link-args-override                 Linker arguments for this target, overriding global settings.
  link-libc                          Link libc (default: true).
  custom-libc                        Implement your own libc (default: false).
  linked-libraries                   Additional libraries linked by the linker for the target.
  linked-libraries-override          Libraries linked by the linker for this target, overriding global settings.
  linker                             'builtin' for the builtin linker, 'cc' for the system linker or <path> to a custom compiler.
  linker-search-paths                Additional linker search paths for the target.
  linker-search-paths-override       Linker search paths for this target, overriding global settings.
  linux-crt                          Set the directory to use for finding crt1.o and related files.
  linux-crtbegin                     Set the directory to use for finding crtbegin.o and related files.
  linux-libc                         Set the libc to use for Linux. Valid options are 'host', 'gnu' and 'musl', default is 'host'
  loop-vectorize                     Force enable/disable loop auto-vectorization.
  macos-min-version                  Set the minimum MacOS version to compile for.
  macos-sdk                          Set the directory for the MacOS SDK for cross compilation.
  macos-sdk-version                  Set the MacOS SDK compiled for.
  memory-env                         Set the memory environment: normal, small, tiny, none.
  merge-functions                    Force enable/disable function merging.
  name                               Set the name to be different from the target name.
  no-entry                           Do not generate (or require) a main function.
  opt                                Optimization setting: O0, O1, O2, O3, O4, O5, Os, Oz.
  optlevel                           Code optimization level: none, less, more, max.
  optsize                            Code size optimization: none, small, tiny.
  output                             Output location, relative to project file.
  panic-msg                          Turn panic message output on or off.
  panicfn                            Override the panic function.
  template                           Use a template configuration from a library, format 'library/template'.
  quiet                              Silence unnecessary output.
  reloc                              Relocation model: none, pic, PIC, pie, PIE.
  riscv-abi                          RiscV ABI: int-only, float, double.
  run-dir                            Override run directory for 'run'.
  safe                               Set safety (contracts, runtime bounds checking, null pointer checks etc) on or off.
  sanitize                           Enable sanitizer: none, address, memory, thread.
  script-dir                         The directory where scripts are found.
  exec-dir                           The directory where 'exec' is run.
  show-backtrace                     Print backtrace on signals.
  single-module                      Compile all modules together, enables more inlining.
  slp-vectorize                      Force enable/disable SLP auto-vectorization.
  soft-float                         Output soft-float functions.
  sources                            Additional paths to project sources for the target.
  sources-override                   Paths to project sources for this target, overriding global settings.
  strip-unused                       Strip unused code and globals from the output. (default: true)
  symtab                             Sets the preferred symtab size.
  target                             Compile for a particular architecture + OS target.
  test-sources                       Additional paths to project test sources for the target.
  test-sources-override              Paths to project test sources for this target, overriding global settings.
  testfn                             Override the test function.
  trap-on-wrap                       Make signed and unsigned integer overflow generate a panic rather than wrapping.
  type                               Type of output, one of 'executable', 'static-lib', 'dynamic-lib', 'benchmark', 'test', 'object-files' and 'prepare'.
  unroll-loops                       Force enable/disable loop unrolling optimization.
  use-stdlib                         Include the standard library (default: true).
  vendor                             Vendor specific extensions, ignored by c3c.
  version                            Version using semantic versioning.
  warnings                           Warnings used for all targets.
  wincrt                             Windows CRT linking: none, static-debug, static, dynamic-debug (default if debug info enabled), dynamic (default).
  windef                             Windows def file, used as an alternative to dllexport when exporting a DLL.
  win-sdk                            Set the path to Windows system library files for cross compilation.
  win-subsystem                      Windows subsystem: CONSOLE (default), WINDOWS (default if @winmain present), NATIVE, POSIX, BOOT_APPLICATION, EFI_APPLICATION, EFI_BOOT_SERVICE_DRIVER, EFI_ROM or EFI_RUNTIME_DRIVER.
  x86-stack-struct-return            Return structs on the stack for x86.
  x86cpu                             Set general level of x64 cpu: baseline, ssse3, sse4, avx1, avx2-v1, avx2-v2 (Skylake/Zen1+), avx512 (Icelake/Zen4+), native.
  x86vec                             Set max type of vector use: none, mmx, sse, avx, avx512, native.
  bsd-sysroot                        Set the BSD sysroot directory.
`
)))

console.log(JSON.stringify(test, null, 2))