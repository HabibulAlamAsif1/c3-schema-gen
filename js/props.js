// const prop = {
//     "targets": {
//         htmc: {
//             "type": {
//                 isArray: false,
//                 type: "string",
//                 "description": ""
//             },
//             "sources": {
//                 isArray: true, // inferred from key ending with 's'
//                 type: "string" // inferred from isArray being true
//             }
//         }
//     },
//     "win-subsystem": {
//         isArray: true,
//         type: "string", // inferred from isArray being true
//         default: "CONSOLE",
//         description: "Windows subsystem",
//         options: [
//             {
//                 opt: "WINDOWS",
//                 desc: "default if @winmain present"
//             },
//             {
//                 opt: "NATIVE",
//                 desc: ""
//             },
//             {
//                 opt: "POSIX",
//                 desc: ""
//             }
//             ...
//         ]
//     }
// }

class Option {

    /**
     * @param {string} opt 
     * @param {string} desc 
     */
    constructor(opt, desc) {
        this.opt = opt
        this.desc = desc
    }
}

export class Property {

    /**
     * @param {boolean} isArray 
     * @param {string} type 
     * @param {string} defaultv 
     * @param {string} description 
     * @param {boolean} hasOptDesc 
     * @param {Option[]} options 
     */
    constructor(isArray, type, defaultv, description, hasOptDesc, options) {
        this.isArray = isArray
        this.type = type,
        this.defaultv = defaultv
        this.description = description
        this.hasOptDesc = hasOptDesc
        this.options = options
    }
}