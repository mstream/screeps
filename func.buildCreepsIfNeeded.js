const chooseCreepBody = require("func.chooseCreepBody");
const generateCreepName = require("func.generateCreepName");

module.exports = (spawn, rolesSlots) => {

    const existingRolesCounter = new Map();

    const existingRoles = Object.keys(Game.creeps)
        .map((creepName) => Game.creeps[ creepName ].memory.role);

    existingRoles.forEach((role) => {
        const prevCount = existingRolesCounter.get(role);
        const nextCount = prevCount ? prevCount + 1 : 1;
        existingRolesCounter.set(role, nextCount);
    });

    const desiredRoles = new Map();

    rolesSlots.forEach((slotsCount, role) => {
        const existingCount = existingRolesCounter.get(role);
        let desiredCount = slotsCount;
        if (existingCount) {
            desiredCount -= existingCount;
        }
        if (desiredCount > 0) {
            desiredRoles.set(role, desiredCount);
        }
    });

    desiredRoles.forEach((desiredCount, role) => {
        const body = chooseCreepBody();
        if (!spawn.canCreateCreep(body) == OK) {
            return;
        }
        const name = generateCreepName(role, body);
        spawn.createCreep(body, name, { role });
    });
};
