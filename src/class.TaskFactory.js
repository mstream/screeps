const taskTypes = require("./const.taskTypes");

const defaultTaskCosts = {
    [taskTypes.EXITS_COMPUTING]: 10,
    [taskTypes.EXTENSIONS_BUILDING]: 5,
    [taskTypes.EXTENSIONS_COMPUTING]: 20,
    [taskTypes.ROAD_COMPUTING]: 20,
    [taskTypes.ROADS_BUILDING]: 5,
    [taskTypes.WALLS_BUILDING]: 5,
    [taskTypes.WALLS_COMPUTING]: 10
};


class TaskFactory {

    constructor(taskCosts = defaultTaskCosts) {

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

        if (!taskTypes[type]) {
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

