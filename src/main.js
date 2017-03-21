const clearCreepsMemory = require("./func.clearCreepsMemory");
const createController = require("./func.createController");

const RoomController = require("./class.RoomController");


module.exports.loop = () => {

    PathFinder.use(true);

    clearCreepsMemory();

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