const _ = require("lodash");

const structureTypes = require("./const.structureTypes");

const Cord = require("./class.Cord");


module.exports = class {

    constructor({
        structureAllowances = require("./structureAllowances"),
        logger = require("./logger")
    } = {}) {

        if (!structureAllowances) {
            throw new Error("structureAllowances can't be null");
        }

        if (!logger) {
            throw new Error("logger can't be null");
        }

        this._structureAllowances = structureAllowances;
        this._logger = logger;
    }

    build(room, extensions) {

        if (!room) {
            throw new Error("room can't be null");
        }

        if (!extensions) {
            throw new Error("extensions can't be null");
        }

        const allowance = this._structureAllowances[structureTypes.EXTENSION][room.level];

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
            room.buildExtension(extension);
        });
    }
};

