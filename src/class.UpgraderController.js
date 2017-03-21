const actionTypes = require("./const.actionTypes");

const Action = require("./class.Action");
const CreepController = require("./class.CreepController");


module.exports = class extends CreepController {

    constructor(creep, room) {

        super(creep, room);
    }

    _chooseAction() {
        const currentAction = this._getAction();

        const remainingCapacity =
            this._creep.carryCapacity - this._creep.carry.energy;

        if (currentAction.type == actionTypes.IDLE) {
            if (remainingCapacity) {
                this._harvestBestSource();
            } else {
                this._upgradeController();
            }
        }

        if (currentAction.type == actionTypes.HARVESTING && !remainingCapacity) {
            this._upgradeController();
        }

        if (currentAction.type == actionTypes.UPGRADING && !this._creep.carry.energy) {
            this._harvestBestSource();
        }
    }

    _executeAction() {
        const currentAction = this._getAction();

        switch (currentAction.type) {
            case actionTypes.IDLE:
                break;
            case actionTypes.HARVESTING:
                // TODO cache objects by their ID
                const source = Game.getObjectById(currentAction.targetId);
                if (this._creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    this._creep.moveTo(
                        source,
                        {visualizePathStyle: {stroke: "#ffaa00"}}
                    );
                }
                break;
            case actionTypes.UPGRADING:
                const controller = this._room.controller;

                if (this._creep.upgradeController(controller) == ERR_NOT_IN_RANGE) {
                    this._creep.moveTo(
                        controller,
                        {visualizePathStyle: {stroke: '#ffffff'}}
                    );
                }
                break;
            default:
                throw new Error(`Unknown action type: ${currentAction.type}`);
        }
    }
};

