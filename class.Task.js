const taskTypes = require("const.taskTypes");

const taskCost = {
    [taskTypes.PATH_COMPUTING]: 10
};


class Task {

    static fromJSON({type, options}) {
        return new Task(type, options);
    }

    constructor(type, options) {

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
}


module.exports = Task;

