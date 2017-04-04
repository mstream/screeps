const SpawnController = require("./class.SpawnController");


module.exports = class {

    constructor({
        gameProvider = require("./gameProvider"),
        creepBodyAssembler = require("./creepBodyAssembler"),
        creepNameGenerator = require("./creepNameGenerator"),
        logger = require("./logger")
    } = {}) {

        if (!gameProvider) {
            throw new Error("gameProvider can't be null");
        }

        if (!creepBodyAssembler) {
            throw new Error("creepBodyAssembler can't be null");
        }

        if (!creepNameGenerator) {
            throw new Error("creepNameGenerator can't be null");
        }

        if (!logger) {
            throw new Error("logger can't be null");
        }

        this._gameProvider = gameProvider;
        this._creepBodyAssembler = creepBodyAssembler;
        this._creepNameGenerator = creepNameGenerator;
        this._logger = logger;
    }

    createFor(creep) {
        return new SpawnController(
            creep,
            this._gameProvider,
            this._creepBodyAssembler,
            this._creepNameGenerator,
            this._logger
        );
    }
};

