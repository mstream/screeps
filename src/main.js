module.exports.loop = () => {

    const pathFinder = require("./pathFinder");
    const memoryCleaner = require("./memoryCleaner");
    const gameController = require("./gameController");

    pathFinder.use(true);

    memoryCleaner.clearCreepsMemory();
    memoryCleaner.clearRoomsMemory();

    gameController.execute();
};