module.exports = (creep) => {

    const remainingEnergyCapacity = creep.carryCapacity - creep.carry.energy;

    if (remainingEnergyCapacity) {
        const sources = creep.room.find(FIND_SOURCES);
        const bestSource = sources[0];

        if (creep.harvest(bestSource) == ERR_NOT_IN_RANGE) {
            creep.moveTo(bestSource, {visualizePathStyle: {stroke: "#ffaa00"}});
        }
    } else {
        const controller = creep.room.controller;

        if (creep.upgradeController(controller) == ERR_NOT_IN_RANGE) {
            creep.moveTo(controller, {visualizePathStyle: {stroke: '#ffffff'}});
        }
    }
};