const _ = require("lodash");

const structureTypes = require("./const.structureTypes");

const Cord = require("./class.Cord");


module.exports = class {

    constructor(room, logger, structureAllowance) {

        if (!room) {
            throw new Error("room can't be null");
        }

        if (!logger) {
            throw new Error("logger can't be null");
        }

        if (!structureAllowance) {
            throw new Error("structureAllowance can't be null");
        }

        this._room = room;
        this._logger = logger;
        this._structureAllowance = structureAllowance;
    }

    build(extensions) {

        if (!extensions) {
            throw new Error("extensions can't be null");
        }

        const allowance = this._structureAllowance[structureTypes.EXTENSION][this._room.level];

        if (!allowance) {
            return;
        }

        _.forEach(extensions, (extension) => {
            if (!extension) {
                throw new Error("extension can't be null");
            }
            extension = Cord.fromJSON(extension);
            this._logger.info(
                `creating road blueprint at : ${extension.hash}`
            );
            this._room.buildExtension(extension);
        });
    }
};

