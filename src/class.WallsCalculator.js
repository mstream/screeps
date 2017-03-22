const lookTypes = require("./const.lookTypes");
const obstacleTypes = require("./const.obstacleTypes");

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
            lookTypes.TERRAIN,
            margin,
            margin,
            margin,
            this._roomSize - 1 - margin
        );

        const walls = [];

        for (let x = margin, start = null, end = null; x < this._roomSize - margin; x++) {

            const structures = terrain[margin][x];
            const wall = structures && structures[0] == obstacleTypes.WALL;
            const lastTile = x == this._roomSize - 1 - margin;

            if (!wall) {
                if (start == null) {
                    start = x;
                }
                end = x;
            }

            if (wall || lastTile) {
                if (start != null) {
                    walls.push(new Path(
                        new Cord(start, margin),
                        new Cord(end, margin))
                    );
                    start = null;
                    end = null;
                }
            }
        }
        return walls;
    }

    calculateRightWalls() {

        const terrain = this._room.findObjectsInArea(
            lookTypes.TERRAIN,
            margin,
            this._roomSize - 1 - margin,
            this._roomSize - 1 - margin,
            this._roomSize - 1 - margin
        );

        const walls = [];

        for (let y = margin, start = null, end = null; y < this._roomSize - margin; y++) {

            const structures = terrain[y][this._roomSize - 1 - margin];
            const wall = structures && structures[0] == obstacleTypes.WALL;
            const lastTile = y == this._roomSize - 1 - margin;

            if (!wall) {
                if (start == null) {
                    start = y;
                }
                end = y;
            }

            if (wall || lastTile) {
                if (start != null) {
                    walls.push(new Path(
                        new Cord(this._roomSize - 1 - margin, start),
                        new Cord(this._roomSize - 1 - margin, end))
                    );
                    start = null;
                    end = null;
                }
            }
        }
        return walls;
    }

    calculateBottomWalls() {

        const terrain = this._room.findObjectsInArea(
            lookTypes.TERRAIN,
            this._roomSize - 1 - margin,
            margin,
            this._roomSize - 1 - margin,
            this._roomSize - 1 - margin
        );

        const walls = [];

        for (let x = margin, start = null, end = null; x < this._roomSize - margin; x++) {

            const structures = terrain[this._roomSize - 1 - margin][x];
            const wall = structures && structures[0] == obstacleTypes.WALL;
            const lastTile = x == this._roomSize - 1 - margin;

            if (!wall) {
                if (start == null) {
                    start = x;
                }
                end = x;
            }

            if (wall || lastTile) {
                if (start != null) {
                    walls.push(new Path(
                        new Cord(start, this._roomSize - 1 - margin),
                        new Cord(end, this._roomSize - 1 - margin))
                    );
                    start = null;
                    end = null;
                }
            }
        }
        return walls;
    }

    calculateLeftWalls() {

        const terrain = this._room.findObjectsInArea(
            lookTypes.TERRAIN,
            margin,
            margin,
            this._roomSize - 1 - margin,
            margin
        );

        const walls = [];

        for (let y = margin, start = null, end = null; y < this._roomSize - margin; y++) {

            const structures = terrain[y][margin];
            const wall = structures && structures[0] == obstacleTypes.WALL;
            const lastTile = y == this._roomSize - 1 - margin;

            if (!wall) {
                if (start == null) {
                    start = y;
                }
                end = y;
            }

            if (wall || lastTile) {
                if (start != null) {
                    walls.push(new Path(
                        new Cord(margin, start),
                        new Cord(margin, end))
                    );
                    start = null;
                    end = null;
                }
            }
        }

        return walls;
    }
};

