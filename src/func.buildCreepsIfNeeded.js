const _ = require("lodash");

const CreepBodyAssembler = require("./class.CreepBodyAssembler");
const CreepNameGenerator = require("./class.CreepNameGenerator");


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

    const creepBodyAssembler = new CreepBodyAssembler();
    const creepNameGenerator = new CreepNameGenerator(game.time);

    _.forOwn(desiredRoles, (desiredCount, role) => {
        const creepBody = creepBodyAssembler.createBody(role);
        if (!spawn.canCreateCreep(creepBody) == OK) {
            return;
        }
        const creepName = creepNameGenerator.generate(role, creepBody);
        spawn.createCreep(creepBody, creepName, {role});
    });
};
