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
                this._transferToBestSpawn();
            }
        }

        if (currentAction.type == actionTypes.HARVESTING && !remainingCapacity) {
            this._transferToBestSpawn();
        }

        if (currentAction.type == actionTypes.TRANSFERRING && !this._creep.carry.energy) {
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
            case actionTypes.TRANSFERRING:
                // TODO cache objects by their ID
                const spawn = Game.getObjectById(currentAction.targetId);
                if (this._creep.transfer(spawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    this._creep.moveTo(
                        spawn,
                        {visualizePathStyle: {stroke: '#ffffff'}}
                    );
                }
                break;
            default:
                throw new Error(`Unknown action type: ${currentAction.type}`);
        }
    }
};

