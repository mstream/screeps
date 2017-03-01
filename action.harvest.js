module.exports = (creep) => {

    const remainingEnergyCapacity = creep.carryCapacity - creep.carry.energy;

    if (remainingEnergyCapacity) {
        const sources = creep.room.find(FIND_SOURCES);
        const bestSource = sources[0];

        if (creep.harvest(bestSource) == ERR_NOT_IN_RANGE) {
            creep.moveTo(bestSource, {visualizePathStyle: {stroke: "#ffaa00"}});
        }
    } else {
        const targets = creep.room.find(
            FIND_STRUCTURES,
            {
                filter: (structure) =>
                (
                    structure.structureType == STRUCTURE_EXTENSION ||
                    structure.structureType == STRUCTURE_SPAWN ||
                    structure.structureType == STRUCTURE_TOWER
                ) &&
                structure.energy < structure.energyCapacity
            });

        if (!targets.length) {
            return;
        }

        const bestTarget = targets[0];

        if (creep.transfer(bestTarget, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(bestTarget, {visualizePathStyle: {stroke: '#ffffff'}});
        }
    }
};