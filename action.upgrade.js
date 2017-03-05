const actionTypes = require("const.actionTypes");
const objectTypes = require("const.objectTypes");


module.exports = (creep, roomController) => {

    const remainingEnergyCapacity = creep.carryCapacity - creep.carry.energy;
    let currentAction = creep.memory.action;

    if (!currentAction) {
        currentAction = actionTypes.HARVESTING;
    } else if (currentAction == actionTypes.HARVESTING && !remainingEnergyCapacity) {
        currentAction = actionTypes.UPGRADING;
    } else if (currentAction == actionTypes.UPGRADING && !creep.carry.energy) {
        currentAction = actionTypes.HARVESTING;
    }

    if (currentAction == actionTypes.HARVESTING) {
        const sources = roomController.findObjects(objectTypes.SOURCE);
        const bestSource = sources[0];

        if (creep.harvest(bestSource) == ERR_NOT_IN_RANGE) {
            creep.moveTo(bestSource, {visualizePathStyle: {stroke: "#ffaa00"}});
        }
    } else if (currentAction == actionTypes.UPGRADING) {
        const controller = creep.room.controller;

        if (creep.upgradeController(controller) == ERR_NOT_IN_RANGE) {
            creep.moveTo(controller, {visualizePathStyle: {stroke: '#ffffff'}});
        }
    }

    creep.memory.action = currentAction;
};