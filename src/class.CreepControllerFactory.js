const roles = require("./const.roles");

const roomControllers = {
    [roles.WORKER]: require("./class.WorkerController")
};


module.exports = class {

    constructor({
        statusRenderer = require("./creepStatusRenderer")
    } = {}) {

        if (!statusRenderer) {
            throw new Error("statusRenderer can't be null");
        }

        this._statusRenderer = statusRenderer;
    }

    createFor(creep, room) {

        if (!creep) {
            throw new Error("creep can't be null");
        }

        if (!room) {
            throw new Error("room can't be null");
        }

        const creepRole = creep.memory.role;

        if (!creepRole) {
            throw new Error("creep role can't be null");
        }

        const Controller = roomControllers[creep.memory.role];

        if (!Controller) {
            throw new Error(`undefined controller for role: ${creepRole}`);
        }

        return new Controller({
            creep,
            room,
            statusRenderer: this._statusRenderer
        });
    }


};

