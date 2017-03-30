const RoomController = require("./class.RoomController");


module.exports = class {

    constructor({
        game = require("./game"),
        memory = require("./memory"),
        taskScheduler = require("./taskScheduler"),
        taskExecutor = require("./taskExecutor"),
        spawnControllerFactory = require("./spawnControllerFactory"),
        extensionsBuilder = require("./extensionsBuilder"),
        roadsBuilder = require("./roadsBuilder"),
        wallsBuilder = require("./wallsBuilder")
    } = {}) {

        if (!game) {
            throw new Error("game can't be null");
        }

        if (!memory) {
            throw new Error("memory can't be null");
        }

        if (!taskScheduler) {
            throw new Error("taskScheduler can't be null");
        }

        if (!taskExecutor) {
            throw new Error("taskExecutor can't be null");
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

        this._game = game;
        this._memory = memory;
        this._taskScheduler = taskScheduler;
        this._taskExecutor = taskExecutor;
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
            game: this._game,
            memory: this._memory,
            taskScheduler: this._taskScheduler,
            taskExecutor: this._taskExecutor,
            spawnControllerFactory: this._spawnControllerFactory,
            extensionsBuilder: this._extensionsBuilder,
            roadsBuilder: this._roadsBuilder,
            wallsBuilder: this._wallsBuilder
        });
    }
};

