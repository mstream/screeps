const _ = require("lodash");

const createController = require("./func.createController");

const MemoryCleaner = require("./class.MemoryCleaner");
const RoomController = require("./class.RoomController");


module.exports.loop = () => {

    PathFinder.use(true);

    const memoryCleaner = new MemoryCleaner(Memory, Game);
    memoryCleaner.clearCreepsMemory();
    memoryCleaner.clearRoomsMemory();

    _.forOwn(Game.rooms, (room) => {
        room = new RoomController(room, Game, Memory);
        room.buildCreeps();
        room.executeTasks();

        _.forOwn(Game.creeps, (creep) => {
            if (room.name != creep.room.name) {
                return;
            }
            const creepController = createController(creep, room);
            creepController.work();
        });
    });
};