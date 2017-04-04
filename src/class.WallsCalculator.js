const lookTypes = require("./const.lookTypes");
const obstacleTypes = require("./const.obstacleTypes");

const Cord = require("./class.Cord");
const Path = require("./class.Path");


const margin = 2;


module.exports = class {

    calculateTop(room) {

        if (!room) {
            throw new Error("room can't be null");
        }

        const terrain = room.findObjectsInArea(
            lookTypes.TERRAIN,
            margin,
            margin,
            margin,
            room.size - 1 - margin
        );

        const walls = [];

        for (let x = margin, start = null, end = null; x < room.size - margin; x++) {

            const structures = terrain[margin][x];
            const wall = structures && structures[0] == obstacleTypes.WALL;
            const lastTile = x == room.size - 1 - margin;

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

    calculateRight(room) {

        if (!room) {
            throw new Error("room can't be null");
        }

        const terrain = room.findObjectsInArea(
            lookTypes.TERRAIN,
            margin,
            room.size - 1 - margin,
            room.size - 1 - margin,
            room.size - 1 - margin
        );

        const walls = [];

        for (let y = margin, start = null, end = null; y < room.size - margin; y++) {

            const structures = terrain[y][room.size - 1 - margin];
            const wall = structures && structures[0] == obstacleTypes.WALL;
            const lastTile = y == room.size - 1 - margin;

            if (!wall) {
                if (start == null) {
                    start = y;
                }
                end = y;
            }

            if (wall || lastTile) {
                if (start != null) {
                    walls.push(new Path(
                        new Cord(room.size - 1 - margin, start),
                        new Cord(room.size - 1 - margin, end))
                    );
                    start = null;
                    end = null;
                }
            }
        }
        return walls;
    }

    calculateBottom(room) {

        if (!room) {
            throw new Error("room can't be null");
        }

        const terrain = room.findObjectsInArea(
            lookTypes.TERRAIN,
            room.size - 1 - margin,
            margin,
            room.size - 1 - margin,
            room.size - 1 - margin
        );

        const walls = [];

        for (let x = margin, start = null, end = null; x < room.size - margin; x++) {

            const structures = terrain[room.size - 1 - margin][x];
            const wall = structures && structures[0] == obstacleTypes.WALL;
            const lastTile = x == room.size - 1 - margin;

            if (!wall) {
                if (start == null) {
                    start = x;
                }
                end = x;
            }

            if (wall || lastTile) {
                if (start != null) {
                    walls.push(new Path(
                        new Cord(start, room.size - 1 - margin),
                        new Cord(end, room.size - 1 - margin))
                    );
                    start = null;
                    end = null;
                }
            }
        }
        return walls;
    }

    calculateLeft(room) {

        if (!room) {
            throw new Error("room can't be null");
        }

        const terrain = room.findObjectsInArea(
            lookTypes.TERRAIN,
            margin,
            margin,
            room.size - 1 - margin,
            margin
        );

        const walls = [];

        for (let y = margin, start = null, end = null; y < room.size - margin; y++) {

            const structures = terrain[y][margin];
            const wall = structures && structures[0] == obstacleTypes.WALL;
            const lastTile = y == room.size - 1 - margin;

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

