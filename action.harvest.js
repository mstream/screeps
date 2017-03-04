const objectTypes = require("const.objectTypes");


module.exports = (creep, roomController) => {

    const remainingEnergyCapacity = creep.carryCapacity - creep.carry.energy;

    if (remainingEnergyCapacity) {
        const sources = roomController.findObjects(objectTypes.SOURCE);
        const bestSource = sources[0];

        if (creep.harvest(bestSource) == ERR_NOT_IN_RANGE) {
            creep.moveTo(bestSource, {visualizePathStyle: {stroke: "#ffaa00"}});
        }
    } else {
        const spawns = roomController.findObjects(objectTypes.SPAWN);
        const spawnsNeedingEnergy = _.filter(
            spawns,
            (spawn) => spawn.energy < spawn.energyCapacity
        );

        if (!spawnsNeedingEnergy.length) {
            return;
        }

        const bestSpawn = spawnsNeedingEnergy[0];

        if (creep.transfer(bestSpawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(bestSpawn, {visualizePathStyle: {stroke: '#ffffff'}});
        }
    }
};