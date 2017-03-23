const _ = require("lodash");

const structureTypes = require("./const.structureTypes");

const Cord = require("./class.Cord");


const REQUESTED = "requested";

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

    build(paths) {

        if (!paths) {
            throw new Error("paths can't be null");
        }

        const allowance = this._structureAllowance[structureTypes.ROAD][this._room.level];

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
                this._room.buildRoad(pathSegment);
            });
        });
    }
};

