const SpawnController = require("./class.SpawnController");


module.exports = class {

    constructor({
        game = require("./game"),
        creepBodyAssembler = require("./creepBodyAssembler"),
        creepNameGenerator = require("./creepNameGenerator"),
        logger = require("./logger")
    } = {}) {

        if (!game) {
            throw new Error("game can't be null");
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

        this._game = game;
        this._creepBodyAssembler = creepBodyAssembler;
        this._creepNameGenerator = creepNameGenerator;
        this._logger = logger;
    }

    createFor(creep) {
        return new SpawnController(
            creep,
            this._game,
            this._creepBodyAssembler,
            this._creepNameGenerator,
            this._logger
        );
    }
};

