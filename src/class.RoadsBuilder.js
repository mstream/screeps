const _ = require("lodash");

const structureTypes = require("./const.structureTypes");

const Cord = require("./class.Cord");


const REQUESTED = "requested";


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

    build(room, paths) {

        if (!room) {
            throw new Error("room can't be null");
        }

        if (!paths) {
            throw new Error("paths can't be null");
        }

        const allowance = this._structureAllowances[structureTypes.WALL][room.level];

        if (!allowance) {
            return;
        }

        _.forEach(paths, (pathSegments) => {
            if (!pathSegments || pathSegments == REQUESTED) {
                return;
            }
            _.forEach(pathSegments, (pathSegment) => {
                if (!pathSegment) {
                    throw new Error("pathSegment can't be null");
                }
                pathSegment = Cord.fromJSON(pathSegment);
                this._logger.info(
                    `creating road blueprint at : ${pathSegment.hash}`
                );
                room.buildRoad(pathSegment);
            });
        });
    }
};

