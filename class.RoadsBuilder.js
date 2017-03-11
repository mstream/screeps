const Cord = require("class.Cord");


const REQUESTED = "requested";

module.exports = class {

    constructor(room, logger) {

        if (!room) {
            throw new Error("room can't be null");
        }

        if (!logger) {
            throw new Error("logger can't be null");
        }

        this._room = room;
        this._logger = logger;
    }

    build(paths) {

        if (!paths) {
            throw new Error("paths can't be null");
        }

        const allowance = CONTROLLER_STRUCTURES[STRUCTURE_ROAD][this._room.level];

        if (!allowance) {
            return;
        }

        _.forOwn(paths, (pathSegments) => {
            if (!pathSegments || pathSegments == REQUESTED) {
                return;
            }
            pathSegments.forEach((pathSegment) => {
                    pathSegment = Cord.fromJSON(pathSegment);
                    this._logger.info(
                        `creating road blueprint at : ${pathSegment.hash}`
                    );
                    this._room.buildRoad(pathSegment);
                }
            );
        });
    }
};

