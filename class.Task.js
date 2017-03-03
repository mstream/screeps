const taskTypes = require("const.taskTypes");

const taskCost = {
    [taskTypes.PATH_COMPUTING]: 10
};


const serializeCord = (cord) => "(" + cord.x + "," + cord.y + ")";


module.exports = class {

    constructor({type, options}) {

        if (!type) {
            throw new Error("type can't be null");
        }

        if (!taskTypes[type]) {
            throw new Error("unknown task type: " + type);
        }

        if (!taskCost[type]) {
            throw new Error("unknown cost for task type: " + type);
        }

        this.type = type;
        this.options = options;
    }

    toJSON() {
        return {type: this.type, options: this.options}
    }

    get cost() {
        return taskCost[this.type];
    }

    get hash() {
        const prefix = this.type;
        if (this.type == taskTypes.PATH_COMPUTING) {
            const cordsHash =
                "FROM_" +
                serializeCord(this.options.from) +
                "_TO_" +
                serializeCord(this.options.to);
            return prefix + "_" + cordsHash;
        }
    }
};

