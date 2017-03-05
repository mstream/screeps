const actionTypes = require("const.actionTypes");
const objectTypes = require("const.objectTypes");

const Action = require("class.Action");

const statusTextStyle = {
    font: 0.5
};

module.exports = class {

    constructor(creep, room) {

        if (!creep) {
            throw new Error("creep can't be null");
        }

        if (!room) {
            throw new Error("room can't be null");
        }

        this._creep = creep;
        this._room = room;
        this._creepMemory = creep.memory;

        this._initializeMemory();
        this._drawStatus();
    }

    work() {
        this._chooseAction();
        this._executeAction();
    }

    _drawStatus() {
        const creepRole = this._creepMemory.role;
        const currentHp = this._creep.hits;
        const maxHp = this._creep.hitsMax;

        const status = `${creepRole} (${currentHp}/${maxHp})`;

        this._room.drawText(
            this._creep.pos.x,
            this._creep.pos.y - 0.5,
            statusTextStyle,
            status
        );
    }

    _initializeMemory() {
        if (!this._getAction()) {
            this._setAction(Action.idle());
        }
    }

    _harvestBestSource() {
        const sources = this._room.findObjects(objectTypes.SOURCE);
        const bestSource = _.sortBy(
            sources,
            (source) => this._room.harvestersAssignedToSource(source)
        )[0];

        this._setAction(new Action(
            actionTypes.HARVESTING,
            bestSource.id
        ));

        this._room.assignHarvesterTo(bestSource);
    }

    _transferToBestSpawn() {
        const currentAction = this._getAction();

        if (currentAction.type == actionTypes.HARVESTING) {
            // TODO cache objects by their ID
            const source = Game.getObjectById(currentAction.targetId);
            this._room.unassignHarvesterFrom(source);
        }

        const spawns = this._room.findObjects(objectTypes.SPAWN);
        const spawnsWithRemainingCapacity = _.filter(
            spawns,
            (spawn) => spawn.energy < spawn.energyCapacity
        );

        if (!spawnsWithRemainingCapacity.length) {
            this._setAction(Action.idle());
            return;
        }

        const bestSpawn = spawnsWithRemainingCapacity[0];

        this._setAction(new Action(
            actionTypes.TRANSFERRING,
            bestSpawn.id
        ));
    }

    _buildBestStructure() {
        const currentAction = this._getAction();

        if (currentAction.type == actionTypes.HARVESTING) {
            // TODO cache objects by their ID
            const source = Game.getObjectById(currentAction.targetId);
            this._room.unassignHarvesterFrom(source);
        }

        const constructionSites = this._room.findObjects(objectTypes.CONSTRUCTION_SITE);

        if (!constructionSites.length) {
            this._setAction(Action.idle());
            return;
        }

        const bestConstructionSite = constructionSites[0];

        this._setAction(new Action(
            actionTypes.BUILDING,
            bestConstructionSite.id
        ));
    }

    _upgradeController() {

        const controller = this._room.findObjects(objectTypes.CONTROLLER)[0];

        this._setAction(new Action(
            actionTypes.UPGRADING,
            controller.id
        ));
    }

    _setAction(action) {
        if (typeof action != "object" || typeof action.type != "string") {
            throw new Error("action type is not supported: " + action);
        }
        this._creep.memory.action = action;
    }

    _getAction() {
        return this._creep.memory.action;
    }
};

