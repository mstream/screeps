const clearCreepsMemory = require("func.clearCreepsMemory");

const CreepController = require("class.CreepController");
const RoomController = require("class.RoomController");


module.exports.loop = () => {

    PathFinder.use(true);

    clearCreepsMemory();

    _.forOwn(Game.rooms, (room) => {
        const roomController = new RoomController(room, Game, Memory);
        roomController.buildCreeps();
        roomController.buildRoadBlueprints();
        roomController.executeTasks();

        _.forOwn(Game.creeps, (creep) => {
            if (room.name != creep.room.name) {
                return;
            }
            const creepController = new CreepController(creep, roomController);
            creepController.work();
        });
    });
};