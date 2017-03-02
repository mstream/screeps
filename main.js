const roles = require("const.roles");

const clearCreepsMemory = require("func.clearCreepsMemory");
const buildCreepsIfNeeded = require("func.buildCreepsIfNeeded");

const actions = new Map([
    [roles.BUILDER, require("action.build")],
    [roles.HARVESTER, require("action.harvest")],
    [roles.UPGRADER, require("action.upgrade")]
]);


module.exports.loop = () => {

    clearCreepsMemory();

    Object.keys(Game.spawns).forEach((spawnName) => {
        const spawn = Game.spawns[spawnName];
        buildCreepsIfNeeded(spawn, new Map([
            [roles.BUILDER, 1],
            [roles.HARVESTER, 1],
            [roles.UPGRADER, 1]
        ]));
    });

    Object.keys(Game.creeps).forEach((creepName) => {
        const creep = Game.creeps[creepName];
        const creepRole = creep.memory.role;
        if (!creepRole) {
            console.log("no role assigned to creep: " + creepName);
            return;
        }

        const action = actions.get(creepRole);

        if (!action) {
            console.log("no action for role: " + creepRole);
            return;
        }

        action(creep);
    });
};