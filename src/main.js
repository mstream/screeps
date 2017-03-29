const RoomControllerFactory = require("./class.RoomControllerFactory");
const CreepControllerFactory = require("./class.CreepControllerFactory");
const GameController = require("./class.GameController");
const MemoryCleaner = require("./class.MemoryCleaner");


module.exports.loop = () => {

    PathFinder.use(true);

    const memoryCleaner = new MemoryCleaner(Memory, Game);
    memoryCleaner.clearCreepsMemory();
    memoryCleaner.clearRoomsMemory();

    const gameController = new GameController(
        Game, Memory, new RoomControllerFactory(), new CreepControllerFactory()
    );

    gameController.execute();
};