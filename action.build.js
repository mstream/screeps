const actions = require("const.actions");
const objectTypes = require("const.objectTypes");


module.exports = (creep, roomController) => {

    const remainingEnergyCapacity = creep.carryCapacity - creep.carry.energy;
    let currentAction = creep.memory.action;

    if (!currentAction) {
        currentAction = actions.HARVESTING;
    } else if (currentAction == actions.HARVESTING && !remainingEnergyCapacity) {
        currentAction = actions.BUILDING;
    } else if (currentAction == actions.BUILDING && !creep.carry.energy) {
        currentAction = actions.HARVESTING;
    }


    if (currentAction == actions.HARVESTING) {
        const sources = roomController.findObjects(objectTypes.SOURCE);
        const bestSource = sources[0];

        if (creep.harvest(bestSource) == ERR_NOT_IN_RANGE) {
            creep.moveTo(bestSource, {visualizePathStyle: {stroke: "#ffaa00"}});
        }
    } else if (currentAction == actions.BUILDING) {
        const targets = creep.room.find(FIND_CONSTRUCTION_SITES);

        if (!targets.length) {
            return;
        }

        const bestTarget = targets[0];

        if (creep.build(bestTarget, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(bestTarget, {visualizePathStyle: {stroke: '#ffffff'}});
        }
    }

    creep.memory.action = currentAction;
};
