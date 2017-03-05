const actionTypes = require("const.actionTypes");
const objectTypes = require("const.objectTypes");

const Action = require("class.Action");

module.exports = (creep, roomController) => {

    const remainingEnergyCapacity = creep.carryCapacity - creep.carry.energy;

    if (remainingEnergyCapacity) {
        const sources = roomController.findObjects(objectTypes.SOURCE);
        const bestSource = _.sortBy(sources, (source) =>
            roomController.harvestersAssignedToSource(source)
        )[0];
        creep.memory.action = new Action(
            actionTypes.HARVESTING,
            bestSource.id
        );
        roomController.assignHarvesterTo(bestSource);
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

        // TODO cache objects by their ID
        if (creep.memory.action.type == actionTypes.HARVESTING) {
            const source = Game.getObjectById(creep.memory.action.target);
            roomController.unassignHarvesterFrom(source);
        }

        creep.memory.action = new Action(
            actionTypes.CARRYING_ENERGY,
            bestSpawn
        );

        if (creep.transfer(bestSpawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(bestSpawn, {visualizePathStyle: {stroke: '#ffffff'}});
        }
    }
};