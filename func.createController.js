const roles = require("const.roles");

const roomControllers = {
    [roles.BUILDER]: require("class.BuilderController"),
    [roles.HARVESTER]: require("class.HarvesterController"),
    [roles.UPGRADER]: require("class.UpgraderController")
};

module.exports = (creep, room) => {

    const creepRole = creep.memory.role;

    if (!creepRole) {
        throw new Error("creep role can't be null");
    }

    const controller = roomControllers[creep.memory.role];

    if (!controller) {
        throw new Error(`undefined controller for role: ${creepRole}`);
    }

    return new controller(creep, room);
};
