const actions = require("const.actions");
const objectTypes = require("const.objectTypes");


module.exports = (creep, roomController) => {

    const remainingEnergyCapacity = creep.carryCapacity - creep.carry.energy;
    let currentAction = creep.memory.action;

    if (!currentAction) {
        currentAction = actions.HARVESTING;
    } else if (currentAction == actions.HARVESTING && !remainingEnergyCapacity) {
        currentAction = actions.UPGRADING;
    } else if (currentAction == actions.UPGRADING && !creep.carry.energy) {
        currentAction = actions.HARVESTING;
    }

    if (currentAction == actions.HARVESTING) {
        const sources = roomController.findObjects(objectTypes.SOURCE);
        const bestSource = sources[0];

        if (creep.harvest(bestSource) == ERR_NOT_IN_RANGE) {
            creep.moveTo(bestSource, {visualizePathStyle: {stroke: "#ffaa00"}});
        }
    } else if (currentAction == actions.UPGRADING) {
        const controller = creep.room.controller;

        if (creep.upgradeController(controller) == ERR_NOT_IN_RANGE) {
            creep.moveTo(controller, {visualizePathStyle: {stroke: '#ffffff'}});
        }
    }

    creep.memory.action = currentAction;
};