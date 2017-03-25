const _ = require("lodash");


module.exports = class {

    constructor(memory, game) {

        if (!memory) {
            throw new Error("memory can't be null");
        }

        if (!game) {
            throw new Error("game can't be null");
        }

        this._memory = memory;
        this._game = game;
    }

    clearCreepsMemory() {

        this._clearObjectsMemory("creeps");
    }

    clearRoomsMemory() {

        this._clearObjectsMemory("rooms");
    }

    _clearObjectsMemory(objectType) {

        const objects = this._memory[objectType];

        if (!objects) {
            return;
        }

        _.keys(objects).forEach((objectName) => {
            const memoryShouldBeKept = this._game[objectType][objectName];
            if (!memoryShouldBeKept) {
                delete this._memory[objectType][objectName];
            }
        });
    }
};

