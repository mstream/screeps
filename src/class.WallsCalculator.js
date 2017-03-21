const actionTypes = require("./const.actionTypes");

const Cord = require("./class.Cord");
const Path = require("./class.Path");


const margin = 2;

module.exports = class {

    constructor(room) {

        if (!room) {
            throw new Error("room can't be null");
        }

        this._room = room;
        this._roomSize = room.size;
    }

    calculateTopWalls() {

        const terrain = this._room.findObjectsInArea(
            LOOK_TERRAIN,
            margin,
            margin,
            margin,
            this._roomSize - 1 - margin
        );

        const walls = [];

        for (let x = margin, start = null, end = null; x < this._roomSize - margin; x++) {

            const structures = terrain[margin][x];
            const wall = structures && structures[0] == "wall";

            if (wall || x == this._roomSize - 1 - margin) {
                if (start != null) {
                    walls.push(new Path(
                        new Cord(start, margin),
                        new Cord(end, margin))
                    );
                    start = null;
                    end = null;
                }
                continue;
            }
            if (!start) {
                start = x;
            }
            end = x;
        }

        return walls;
    }

    calculateRightWalls() {

        const terrain = this._room.findObjectsInArea(
            LOOK_TERRAIN,
            margin,
            this._roomSize - 1 - margin,
            this._roomSize - 1 - margin,
            this._roomSize - 1 - margin
        );

        const walls = [];

        for (let y = margin, start = null, end = null; y < this._roomSize - margin; y++) {

            const structures = terrain[y][this._roomSize - 1 - margin];
            const wall = structures && structures[0] == "wall";

            if (wall || y == this._roomSize - 1 - margin) {
                if (start != null) {
                    walls.push(new Path(
                        new Cord(this._roomSize - 1 - margin, start),
                        new Cord(this._roomSize - 1 - margin, end))
                    );
                    start = null;
                    end = null;
                }
                continue;
            }
            if (!start) {
                start = y;
            }
            end = y;
        }
        return walls;
    }

    calculateBottomWalls() {

        const terrain = this._room.findObjectsInArea(
            LOOK_TERRAIN,
            this._roomSize - 1 - margin,
            margin,
            this._roomSize - 1 - margin,
            this._roomSize - 1 - margin
        );

        const walls = [];

        for (let x = margin, start = null, end = null; x < this._roomSize - margin; x++) {

            const structures = terrain[this._roomSize - 1 - margin][x];
            const wall = structures && structures[0] == "wall";

            if (wall || x == this._roomSize - 1 - margin) {
                if (start != null) {
                    walls.push(new Path(
                        new Cord(start, this._roomSize - 1 - margin),
                        new Cord(end, this._roomSize - 1 - margin))
                    );
                    start = null;
                    end = null;
                }
                continue;
            }
            if (!start) {
                start = x;
            }
            end = x;
        }

        return walls;
    }

    calculateLeftWalls() {

        const terrain = this._room.findObjectsInArea(
            LOOK_TERRAIN,
            margin,
            margin,
            this._roomSize - 1 - margin,
            margin
        );

        const walls = [];

        for (let y = margin, start = null, end = null; y < this._roomSize - margin; y++) {

            const structures = terrain[y][margin];
            const wall = structures && structures[0] == "wall";

            if (wall || y == this._roomSize - 1 - margin) {
                if (start != null) {
                    walls.push(new Path(
                        new Cord(margin, start),
                        new Cord(margin, end))
                    );
                    start = null;
                    end = null;
                }
                continue;
            }
            if (!start) {
                start = y;
            }
            end = y;
        }

        return walls;
    }
};

