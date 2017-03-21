const chooseCreepBody = require("./func.chooseCreepBody");
const generateCreepName = require("./func.generateCreepName");


module.exports = (game, spawn, rolesSlots) => {

    if (!game) {
        throw new Error("game can't be null");
    }

    if (!spawn) {
        throw new Error("spawn can't be null");
    }

    if (!rolesSlots) {
        throw new Error("rolesSlots can't be null");
    }

    const existingRolesCounter = {};

    _.forOwn(game.creeps, (creep) => {
        const role = creep.memory.role;
        const prevCount = existingRolesCounter[role];
        const nextCount = prevCount ? prevCount + 1 : 1;
        existingRolesCounter[role] = nextCount;
    });

    const desiredRoles = {};

    _.forOwn(rolesSlots, (slotsCount, role) => {
        const existingCount = existingRolesCounter[role];
        let desiredCount = slotsCount;
        if (existingCount) {
            desiredCount -= existingCount;
        }
        if (desiredCount > 0) {
            desiredRoles[role] = desiredCount;
        }
    });

    _.forOwn(desiredRoles, (desiredCount, role) => {
        const creepBody = chooseCreepBody();
        if (!spawn.canCreateCreep(creepBody) == OK) {
            return;
        }
        const creepName = generateCreepName(role, creepBody);
        spawn.createCreep(creepBody, creepName, { role });
    });
};
