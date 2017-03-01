const roles = require("const.roles");
const clearCreepsMemory = require("func.clearCreepsMemory");
const buildCreepsIfNeeded = require("func.buildCreepsIfNeeded");

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
};