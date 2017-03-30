const lookTypes = require("./const.lookTypes");
const obstacleTypes = require("./const.obstacleTypes");

const Cord = require("./class.Cord");
const Path = require("./class.Path");


module.exports = class {

    calculateTopExits(room) {

        if (!room) {
            throw new Error("room can't be null");
        }

        const terrain = room.findObjectsInArea(
            lookTypes.TERRAIN, 0, 0, 0, room.size - 1
        );

        const exits = [];

        for (let x = 0, start = null, end = null; x < room.size; x++) {

            const structures = terrain[0][x];
            const wall = structures && structures[0] == obstacleTypes.WALL;
            const lastTile = x == room.size - 1;

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

    calculateRightExits(room) {

        if (!room) {
            throw new Error("room can't be null");
        }

        const terrain = room.findObjectsInArea(
            lookTypes.TERRAIN, 0, room.size - 1, room.size - 1, room.size - 1
        );

        const exits = [];

        for (let y = 0, start = null, end = null; y < room.size; y++) {

            const structures = terrain[y][room.size - 1];
            const wall = structures && structures[0] == obstacleTypes.WALL;
            const lastTile = y == room.size - 1;

            if (!wall) {
                if (start == null) {
                    start = y;
                }
                end = y;
            }

            if (wall || lastTile) {
                if (start != null) {
                    exits.push(new Path(
                        new Cord(room.size - 1, start),
                        new Cord(room.size - 1, end))
                    );
                    start = null;
                    end = null;
                }
            }
        }
        return exits;
    }

    calculateBottomExits(room) {

        if (!room) {
            throw new Error("room can't be null");
        }

        const terrain = room.findObjectsInArea(
            lookTypes.TERRAIN, room.size - 1, 0, room.size - 1, room.size - 1
        );

        const exits = [];

        for (let x = 0, start = null, end = null; x < room.size; x++) {

            const structures = terrain[room.size - 1][x];
            const wall = structures && structures[0] == obstacleTypes.WALL;
            const lastTile = x == room.size - 1;

            if (!wall) {
                if (start == null) {
                    start = x;
                }
                end = x;
            }

            if (wall || lastTile) {
                if (start != null) {
                    exits.push(new Path(
                        new Cord(start, room.size - 1),
                        new Cord(end, room.size - 1))
                    );
                    start = null;
                    end = null;
                }
            }
        }

        return exits;
    }

    calculateLeftExits(room) {

        if (!room) {
            throw new Error("room can't be null");
        }

        const terrain = room.findObjectsInArea(
            lookTypes.TERRAIN, 0, 0, room.size - 1, 0
        );

        const exits = [];

        for (let y = 0, start = null, end = null; y < room.size; y++) {

            const structures = terrain[y][0];
            const wall = structures && structures[0] == obstacleTypes.WALL;
            const lastTile = y == room.size - 1;

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

