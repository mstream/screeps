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
        throw new Error("creep behaviour should be implemented");
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
        if (!this._creepMemory.action) {
            this._creepMemory.action = Action.idle();
        }
    }
};

