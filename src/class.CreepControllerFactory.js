const roles = require("./const.roles");

const roomControllers = {
    [roles.BUILDER]: require("./class.HarvesterController"),
    [roles.HARVESTER]: require("./class.HarvesterController"),
    [roles.UPGRADER]: require("./class.UpgraderController")
};


module.exports = class {

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

        return new Controller(creep, room);
    }
};

