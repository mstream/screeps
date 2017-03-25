const _ = require("lodash");

const structureTypes = require("./const.structureTypes");

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

        _.forEach(walls, (wall) => {
            if (!wall) {
                throw new Error("wall can't be null");
            }
            if (wall == REQUESTED) {
                return;
            }
            wall = Path.fromJSON(wall);
            _.forEach(wall.toSegments(), (wallSegment) => {
                this._logger.info(
                    `creating wall blueprint at : ${wallSegment.hash}`
                );
                this._room.buildWall(wallSegment);
            });
        });
    }
};

