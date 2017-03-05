const actionTypes = require("const.actionTypes");
const objectTypes = require("const.objectTypes");

const Action = require("class.Action");
const CreepController = require("class.CreepController");


module.exports = class extends CreepController {

    constructor(creep, room) {

        super(creep, room);
    }

    work() {
        const remainingCapacity =
            this._creep.carryCapacity - creep.carry.energy;

        let currentAction = this._creep.memory.action;

        if (!currentAction) {
            currentAction = actionTypes.HARVESTING;
        } else if (currentAction == actionTypes.HARVESTING && !remainingCapacity) {
            currentAction = actionTypes.BUILDING;
        } else if (currentAction == actionTypes.BUILDING && !this._creep.carry.energy) {
            currentAction = actionTypes.HARVESTING;
        }

        if (currentAction == actionTypes.HARVESTING) {
            const sources = this._room.findObjects(objectTypes.SOURCE);
            const bestSource = sources[0];

            if (this._creep.harvest(bestSource) == ERR_NOT_IN_RANGE) {
                this._creep.moveTo(
                    bestSource,
                    {visualizePathStyle: {stroke: "#ffaa00"}}
                );
            }
        } else if (currentAction == actionTypes.BUILDING) {
            const targets = this._creep.room.find(FIND_CONSTRUCTION_SITES);

            if (!targets.length) {
                return;
            }

            const bestTarget = targets[0];

            if (this._creep.build(bestTarget, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                this._creep.moveTo(
                    bestTarget,
                    {visualizePathStyle: {stroke: '#ffffff'}}
                );
            }
        }

        creep.memory.action = currentAction;
    }
};

