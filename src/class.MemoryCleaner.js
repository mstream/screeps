const _ = require("lodash");


module.exports = class {

    constructor({
        memoryProvider = require("./memoryProvider"),
        gameProvider = require("./gameProvider")
    } = {}) {

        if (!memoryProvider) {
            throw new Error("memoryProvider can't be null");
        }

        if (!gameProvider) {
            throw new Error("gameProvider can't be null");
        }

        this._memoryProvider = memoryProvider;
        this._gameProvider = gameProvider;
    }

    clearCreepsMemory() {

        this._clearObjectsMemory("creeps");
    }

    clearRoomsMemory() {

        this._clearObjectsMemory("rooms");
    }

    _clearObjectsMemory(objectType) {

        const objects = this._memoryProvider.get()[objectType];

        _.keys(objects).forEach((objectName) => {
            const memoryShouldBeKept = this._gameProvider.get()[objectType][objectName];
            if (!memoryShouldBeKept) {
                delete this._memoryProvider.get()[objectType][objectName];
            }
        });
    }
};

