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
            this._creep.carryCapacity - this._creep.carry.energy;
        let currentAction = this._creep.memory.action;

        if (currentAction.type == actionTypes.IDLE && remainingCapacity) {
            currentAction = actionTypes.HARVESTING;
        } else if (currentAction == actionTypes.HARVESTING && !remainingCapacity) {
            currentAction = actionTypes.UPGRADING;
        } else if (currentAction == actionTypes.UPGRADING && !this._creep.carry.energy) {
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
        } else if (currentAction == actionTypes.UPGRADING) {
            const controller = this._creep.room.controller;

            if (this._creep.upgradeController(controller) == ERR_NOT_IN_RANGE) {
                this._creep.moveTo(
                    controller,
                    {visualizePathStyle: {stroke: '#ffffff'}}
                );
            }
        }

        this._creep.memory.action = currentAction;
    }
};

