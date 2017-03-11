const actionTypes = require("const.actionTypes");

const Action = require("class.Action");

const statusBarWidth = 1;
const statusBarHeight = 0.25;

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
        const centerX = this._creep.pos.x;
        const centerY = this._creep.pos.y;

        const hpRatio = 1 - ((maxHp - currentHp) / maxHp);

        this._room.drawRectangle(
            centerX - (statusBarWidth / 2),
            centerY - 0.5 - statusBarHeight,
            (1 - hpRatio) * statusBarWidth,
            statusBarHeight,
            {fill: "#ff0000"}
        );

        this._room.drawRectangle(
            centerX - (statusBarWidth / 2) + ((1 - hpRatio) * statusBarWidth),
            centerY - 0.5 - statusBarHeight,
            statusBarWidth * hpRatio,
            statusBarHeight,
            {fill: "#00ff00"}
        );

        const status = `${creepRole.charAt(0)} ${hpRatio * 100}%`;

        this._room.drawText(
            centerX,
            centerY - 0.5,
            {font: statusBarHeight},
            status
        );
    }

    _initializeMemory() {
        if (!this._getAction()) {
            this._setAction(Action.idle());
        }
    }

    _harvestBestSource() {
        const sources = this._room.sources;
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

        const spawns = this._room.spawns;
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

        const constructionSites = this._room.constructionSites;

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

        const controller = this._room.controller;

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

