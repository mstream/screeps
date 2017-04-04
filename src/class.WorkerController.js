const _ = require("lodash");

const operationResults = require("./const.operationResults");

const Action = require("./class.Action");
const CreepController = require("./class.CreepController");
const WorkerTask = require("./class.WorkerTask");


class WorkerController extends CreepController {

    constructor({
        creep,
        room,
        statusRenderer
    } = {}) {
        super({creep, room, statusRenderer});
        this._taskExecutionMethods = {
            [WorkerTask.types.UPGRADING]: this._executeControllerUpgrade
        };
    }

    _executeTask(task) {
        const source = _.find(this._room.sources, {id: task.sourceId});
        this._taskExecutionMethods[task.type].bind(this)(
            source,
            this._room.controller
        );
    }

    _executeControllerUpgrade(source, controller) {

        const remainingCapacity =
            this._creep.carryCapacity - this._creep.carry.energy;

        const shouldSwitchToUpgrading =
            this.action.type == Action.types.IDLE ||
            (this.action.type == Action.types.HARVESTING && !remainingCapacity);

        if (shouldSwitchToUpgrading) {
            this.action = new Action({
                type: Action.types.UPGRADING,
                targetId: controller.id
            });
        }

        const shouldSwitchToHarvesting =
            this.action.type == Action.types.IDLE ||
            (this.action.type == Action.types.UPGRADING && !this._creep.carry.energy);

        if (shouldSwitchToHarvesting) {
            this.action = new Action({
                type: Action.types.HARVESTING,
                targetId: source.id
            });
        }

        if (this.action.type == Action.types.HARVESTING) {
            this._harvest(source);
        }

        if (this.action.type == Action.types.UPGRADING) {
            this._upgrade(controller);
        }
    }

    _harvest(source) {

        if (this._creep.harvest(source) == operationResults.ERR_NOT_IN_RANGE) {
            this._creep.moveTo(
                source,
                {visualizePathStyle: {stroke: "#ffaa00"}}
            );
        }
    }

    _upgrade(controller) {

        if (this._creep.upgradeController(controller) == operationResults.ERR_NOT_IN_RANGE) {
            this._creep.moveTo(
                controller,
                {visualizePathStyle: {stroke: "#ffffff"}}
            );
        }
    }
}


module.exports = WorkerController;
