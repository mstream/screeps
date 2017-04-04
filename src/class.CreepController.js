const Action = require("./class.Action");


module.exports = class {

    constructor({creep, room, statusRenderer} = {}) {

        if (!creep) {
            throw new Error("creep can't be null");
        }

        if (!room) {
            throw new Error("room can't be null");
        }

        if (!statusRenderer) {
            throw new Error("statusRenderer can't be null");
        }

        this._creep = creep;
        this._room = room;
        this._statusRenderer = statusRenderer;
        this._creepMemory = creep.memory;
    }

    execute() {
        this._initializeMemory();
        this._executeAssignedTask();
        this._statusRenderer.renderFor(this, this._room);
    }

    assignTask(task) {
        this._creepMemory.task = task;
    }

    get role() {
        return this._creepMemory.role;
    }

    get task() {
        return this._creepMemory.task;
    }

    get action() {
        return new Action(this._creepMemory.action);
    }

    get pos() {
        return this._creep.pos;
    }

    set action(action) {
        this._creepMemory.action = action.toJSON();
    }

    _initializeMemory() {
        if (!this._creepMemory.action) {
            this._creepMemory.action = Action.idle().toJSON();
        }
    }

    _executeAssignedTask() {
        if (!this.task) {
            return;
        }
        this._executeTask(this.task);
    }
};

