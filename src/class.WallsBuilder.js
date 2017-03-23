const _ = require("lodash");

const structureTypes = require("./const.structureTypes");

const Cord = require("./class.Cord");
const Path = require("./class.Path");


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

    build(walls) {

        if (!walls) {
            throw new Error("walls can't be null");
        }

        const allowance = this._structureAllowance[structureTypes.WALL][this._room.level];

        if (!allowance) {
            return;
        }

        _.forEach(walls, (wallPaths) => {
            if (!wallPaths || wallPaths == REQUESTED) {
                return;
            }
            _.forEach(wallPaths, (wallPath) => {
                if (!wallPath) {
                    throw new Error("wallPath can't be null");
                }
                wallPath = Path.fromJSON(wallPath);
                _.forEach(wallPath.toSegments(), (wallSegment) => {
                    wallSegment = Cord.fromJSON(wallSegment);
                    this._logger.info(
                        `creating wall blueprint at : ${wallSegment.hash}`
                    );
                    this._room.buildWall(wallSegment);
                });
            });
        });
    }
};

