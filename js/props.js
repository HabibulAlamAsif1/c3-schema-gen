export class Option {

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
     * @param {boolean} isGlobal 
     */
    constructor(isArray, type, defaultv, description, hasOptDesc, options, isGlobal) {
        this.isArray = isArray
        this.type = type,
        this.defaultv = defaultv
        this.description = description
        this.hasOptDesc = hasOptDesc
        this.options = options
        this.isGlobal = isGlobal
    }
}