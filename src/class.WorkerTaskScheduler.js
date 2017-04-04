const _ = require("lodash");

const roles = require("./const.roles");

const WorkerTask = require("./class.WorkerTask");


module.exports = class {

    constructor({
        gameProvider = require("./gameProvider"),
        logger = require("./logger")
    } = {}) {

        if (!gameProvider) {
            throw new Error("gameProvider can't be null");
        }

        if (!logger) {
            throw new Error("logger can't be null");
        }

        this._gameProvider = gameProvider;
        this._logger = logger;

        this._initializeMemory();
    }

    schedule(room) {

        if (!room) {
            throw new Error("room can't be null");
        }

        this._requestControllerUpgrading(room);
        this._requestEnergyHarvesting(room);
        this._requestStructuresBuilding(room);
    }

    _initializeMemory() {

    }

    _requestControllerUpgrading(room) {
        _.forEach(room.sources, (source) =>
            room.addCreepTask(
                roles.WORKER,
                10,
                new WorkerTask(
                    WorkerTask.types.UPGRADING,
                    source.id,
                    room.controller.id
                )
            )
        );
    }

    _requestEnergyHarvesting() {
    }

    _requestStructuresBuilding() {
    }
};

