const roles = require("const.roles");

const actions = new Map([
    [roles.BUILDER, require("action.build")],
    [roles.HARVESTER, require("action.harvest")],
    [roles.UPGRADER, require("action.upgrade")]
]);

const statusTextStyle = {
    font: 0.5
};

module.exports = class {

    constructor(creep, roomController) {

        if (!creep) {
            throw new Error("creep can't be null");
        }

        if (!roomController) {
            throw new Error("roomController can't be null");
        }

        this._creep = creep;
        this._roomController = roomController;
        this._creepMemory = creep.memory;

        this._initializeMemory();
        this._drawStatus();
    }

    work() {
        const creepRole = this._creep.memory.role;

        if (!creepRole) {
            throw new Error("no role assigned to creep: " + this._creep.name);
        }

        const action = actions.get(creepRole);

        if (!action) {
            throw new Error("no action for role: " + creepRole);
        }

        action(this._creep, this._roomController);
    }

    _drawStatus() {
        const creepRole = this._creepMemory.role;
        const currentHp = this._creep.hits;
        const maxHp = this._creep.hitsMax;

        const status = `${creepRole} (${currentHp}/${maxHp})`;

        this._roomController.drawText(
            this._creep.pos.x,
            this._creep.pos.y - 0.5,
            statusTextStyle,
            status
        );
    }

    _initializeMemory() {
        if (!this._creepMemory.action) {
            this._creepMemory.action = {};
        }
    }
};

