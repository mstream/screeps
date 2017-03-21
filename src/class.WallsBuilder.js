const Cord = require("./class.Cord");
const Path = require("./class.Path");


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

    build(walls) {

        if (!walls) {
            throw new Error("walls can't be null");
        }

        const allowance = CONTROLLER_STRUCTURES[STRUCTURE_WALL][this._room.level];

        if (!allowance) {
            return;
        }

        _.forOwn(walls, (wallPath) => {
            if (!wallPath || wallPath == REQUESTED) {
                return;
            }
            wallPath = Path.fromJSON(wallPath);
            wallPath.toSegments().forEach((wallSegment) => {
                    wallSegment = Cord.fromJSON(wallSegment);
                    this._logger.info(
                        `creating wall blueprint at : ${wallSegment.hash}`
                    );
                    this._room.buildWall(wallSegment);
                }
            );
        });
    }
};

