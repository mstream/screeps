const _ = require("lodash");

const taskTypes = require("./const.taskTypes");


class TaskFactory {

    constructor({
        taskCosts = require("./taskCosts")
    } = {}) {

        if (!taskCosts) {
            throw new Error("taskCosts can't be null");
        }

        this._taskCosts = taskCosts;
    }

    fromJSON({type, options}) {
        return this._createInstance(type, options);
    }

    create(type, options) {
        return this._createInstance(type, options);
    }

    _createInstance(type, options) {

        if (!type) {
            throw new Error("type can't be null");
        }

        if (!_.include(_.values(taskTypes), type)) {
            throw new Error(`unknown task type: ${type}`);
        }

        const cost = this._taskCosts[type];

        if (!cost) {
            throw new Error(`undefined cost for task type: ${type}`);
        }

        return {type, cost, options};
    }
}


module.exports = TaskFactory;

