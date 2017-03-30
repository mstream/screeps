const _ = require("lodash");

const structureTypes = require("./const.structureTypes");

const Path = require("./class.Path");


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

    build(room, walls) {

        if (!room) {
            throw new Error("room can't be null");
        }

        if (!walls) {
            throw new Error("walls can't be null");
        }

        const allowance = this._structureAllowances[structureTypes.WALL][room.level];

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
                room.buildWall(wallSegment);
            });
        });
    }
};

