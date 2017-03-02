const roles = require("const.roles");

const clearCreepsMemory = require("func.clearCreepsMemory");
const drawCreepStatuses = require("func.drawCreepStatuses");
const createRoadsBlueprint = require("func.createRoadsBlueprint");

const actions = new Map([
    [roles.BUILDER, require("action.build")],
    [roles.HARVESTER, require("action.harvest")],
    [roles.UPGRADER, require("action.upgrade")]
]);

const RoomController = require("class.RoomController");


module.exports.loop = () => {

    PathFinder.use(true);

    clearCreepsMemory();
    createRoadsBlueprint();
    drawCreepStatuses();

    _.forOwn(Game.rooms, (room) => {
        const roomController = new RoomController(room, Memory);
        roomController.buildCreeps();
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