const lookTypes = require("./const.lookTypes");
const obstacleTypes = require("./const.obstacleTypes");

const Cord = require("./class.Cord");
const Path = require("./class.Path");


module.exports = class {

    constructor(room) {

        if (!room) {
            throw new Error("room can't be null");
        }

        this._room = room;
        this._roomSize = room.size;
    }

    calculateTopExits() {

        const terrain = this._room.findObjectsInArea(
            lookTypes.TERRAIN, 0, 0, 0, this._roomSize - 1
        );

        const exits = [];

        for (let x = 0, start = null, end = null; x < this._roomSize; x++) {

            const structures = terrain[0][x];
            const wall = structures && structures[0] == obstacleTypes.WALL;
            const lastTile = x == this._roomSize - 1;

            if (!wall) {
                if (start == null) {
                    start = x;
                }
                end = x;
            }

            if (wall || lastTile) {
                if (start != null) {
                    exits.push(new Path(
                        new Cord(start, 0),
                        new Cord(end, 0))
                    );
                    start = null;
                    end = null;
                }
            }
        }

        return exits;
    }

    calculateRightExits() {

        const terrain = this._room.findObjectsInArea(
            lookTypes.TERRAIN, 0, this._roomSize - 1, this._roomSize - 1, this._roomSize - 1
        );

        const exits = [];

        for (let y = 0, start = null, end = null; y < this._roomSize; y++) {

            const structures = terrain[y][this._roomSize - 1];
            const wall = structures && structures[0] == obstacleTypes.WALL;
            const lastTile = y == this._roomSize - 1;

            if (!wall) {
                if (start == null) {
                    start = y;
                }
                end = y;
            }

            if (wall || lastTile) {
                if (start != null) {
                    exits.push(new Path(
                        new Cord(this._roomSize - 1, start),
                        new Cord(this._roomSize - 1, end))
                    );
                    start = null;
                    end = null;
                }
            }
        }
        return exits;
    }

    calculateBottomExits() {

        const terrain = this._room.findObjectsInArea(
            lookTypes.TERRAIN, this._roomSize - 1, 0, this._roomSize - 1, this._roomSize - 1
        );

        const exits = [];

        for (let x = 0, start = null, end = null; x < this._roomSize; x++) {

            const structures = terrain[this._roomSize - 1][x];
            const wall = structures && structures[0] == obstacleTypes.WALL;
            const lastTile = x == this._roomSize - 1;

            if (!wall) {
                if (start == null) {
                    start = x;
                }
                end = x;
            }

            if (wall || lastTile) {
                if (start != null) {
                    exits.push(new Path(
                        new Cord(start, this._roomSize - 1),
                        new Cord(end, this._roomSize - 1))
                    );
                    start = null;
                    end = null;
                }
            }
        }

        return exits;
    }

    calculateLeftExits() {

        const terrain = this._room.findObjectsInArea(
            lookTypes.TERRAIN, 0, 0, this._roomSize - 1, 0
        );

        const exits = [];

        for (let y = 0, start = null, end = null; y < this._roomSize; y++) {

            const structures = terrain[y][0];
            const wall = structures && structures[0] == obstacleTypes.WALL;
            const lastTile = y == this._roomSize - 1;

            if (!wall) {
                if (start == null) {
                    start = y;
                }
                end = y;
            }

            if (wall || lastTile) {
                if (start != null) {
                    exits.push(new Path(
                        new Cord(0, start),
                        new Cord(0, end))
                    );
                    start = null;
                    end = null;
                }
            }
        }

        return exits;
    }
};

