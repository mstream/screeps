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

        if (remainingCapacity) {
            const sources = this._room.findObjects(objectTypes.SOURCE);
            const bestSource = _.sortBy(sources, (source) =>
                room.harvestersAssignedToSource(source)
            )[0];
            this._creep.memory.action = new Action(
                actionTypes.HARVESTING,
                bestSource.id
            );
            this._room.assignHarvesterTo(bestSource);
            if (this._creep.harvest(bestSource) == ERR_NOT_IN_RANGE) {
                this._creep.moveTo(
                    bestSource,
                    {visualizePathStyle: {stroke: "#ffaa00"}}
                );
            }
        } else {
            const spawns = this._room.findObjects(objectTypes.SPAWN);
            const spawnsNeedingEnergy = _.filter(
                spawns,
                (spawn) => spawn.energy < spawn.energyCapacity
            );

            if (!spawnsNeedingEnergy.length) {
                return;
            }

            const bestSpawn = spawnsNeedingEnergy[0];

            // TODO cache objects by their ID
            if (this._creep.memory.action.type == actionTypes.HARVESTING) {
                const source = Game.getObjectById(this._creep.memory.action.targetId);
                this._room.unassignHarvesterFrom(source);
            }

            this._creep.memory.action = new Action(
                actionTypes.CARRYING_ENERGY,
                bestSpawn
            );

            if (this._creep.transfer(bestSpawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                this._creep.moveTo(
                    bestSpawn,
                    {visualizePathStyle: {stroke: '#ffffff'}}
                );
            }
        }
    }
};

