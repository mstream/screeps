const RoomController = require("./class.RoomController");


module.exports = class {

    constructor({
        gameProvider = require("./gameProvider"),
        memoryProvider = require("./memoryProvider"),
        taskScheduler = require("./taskScheduler"),
        taskExecutor = require("./taskExecutor"),
        workerTaskScheduler = require("./workerTaskScheduler"),
        spawnControllerFactory = require("./spawnControllerFactory"),
        extensionsBuilder = require("./extensionsBuilder"),
        roadsBuilder = require("./roadsBuilder"),
        wallsBuilder = require("./wallsBuilder")
    } = {}) {

        if (!gameProvider) {
            throw new Error("gameProvider can't be null");
        }

        if (!memoryProvider) {
            throw new Error("memoryProvider can't be null");
        }

        if (!taskScheduler) {
            throw new Error("taskScheduler can't be null");
        }

        if (!taskExecutor) {
            throw new Error("taskExecutor can't be null");
        }

        if (!workerTaskScheduler) {
            throw new Error("workerTaskScheduler can't be null");
        }

        if (!spawnControllerFactory) {
            throw new Error("spawnControllerFactory can't be null");
        }

        if (!extensionsBuilder) {
            throw new Error("extensionsBuilder can't be null");
        }

        if (!roadsBuilder) {
            throw new Error("roadsBuilder can't be null");
        }

        if (!wallsBuilder) {
            throw new Error("wallsBuilder can't be null");
        }

        this._gameProvider = gameProvider;
        this._memoryProvider = memoryProvider;
        this._taskScheduler = taskScheduler;
        this._taskExecutor = taskExecutor;
        this._workerTaskScheduler = workerTaskScheduler;
        this._spawnControllerFactory = spawnControllerFactory;
        this._extensionsBuilder = extensionsBuilder;
        this._roadsBuilder = roadsBuilder;
        this._wallsBuilder = wallsBuilder;
    }

    createFor(room) {

        if (!room) {
            throw new Error("room can't be null");
        }

        return new RoomController({
            room: room,
            gameProvider: this._gameProvider,
            memoryProvider: this._memoryProvider,
            taskScheduler: this._taskScheduler,
            taskExecutor: this._taskExecutor,
            workerTaskScheduler: this._workerTaskScheduler,
            spawnControllerFactory: this._spawnControllerFactory,
            extensionsBuilder: this._extensionsBuilder,
            roadsBuilder: this._roadsBuilder,
            wallsBuilder: this._wallsBuilder
        });
    }
};

