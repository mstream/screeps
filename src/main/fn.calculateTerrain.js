module.exports = (() => {


    const _ = require("lodash");


    const roomSize = 50;

    const wallTerrain = (ctx, room) =>
        ctx.memory.rooms[room.name].terrain.walls;

    const initMemory = (ctx, room) => {

        if (!ctx.memory.rooms[room.name].terrain) {

            ctx.memory.rooms[room.name].terrain = {};

        }

        if (!ctx.memory.rooms[room.name].terrain.walls) {

            ctx.memory.rooms[room.name].terrain.walls = {};

        }

        if (!wallTerrain(ctx, room).requested) {

            wallTerrain(ctx, room).requested = [];

        }

        if (!wallTerrain(ctx, room).requestingDone) {

            wallTerrain(ctx, room).requestingDone = false;

        }

        if (!wallTerrain(ctx, room).calculated) {

            wallTerrain(ctx, room).calculated = [];

        }

        if (!wallTerrain(ctx, room).calculationDone) {

            wallTerrain(ctx, room).calculationDone = false;

        }

    };

    const initRequestedWalls = (ctx, room) => {

        wallTerrain(ctx, room).requested = _.range(roomSize);

    };

    const registerCalculatedWalls = (ctx, room, walls) => {

        const {reserveRoomTile} = ctx;

        _.forEach(walls, (cord) => {

            reserveRoomTile(ctx, room, cord.x, cord.y);
            wallTerrain(ctx, room).calculated.push(cord);

        });

    };

    const calculateWalls = (ctx, room, rowIdx) => {

        const rowObjects = room.lookAtArea(
            rowIdx, 0, rowIdx, roomSize - 1, true
        );
        const rowWalls = _.filter(rowObjects, (tile) =>
            tile.type === "terrain" && _.includes(tile.terrain, "wall")
        );


        return _.map(rowWalls, (tile) => ({
            "x": tile.x,
            "y": tile.y
        }));

    };

    return (ctx, room) => {

        initMemory(ctx, room);

        if (wallTerrain(ctx, room).calculationDone) {

            return true;

        }

        if (!wallTerrain(ctx, room).requestingDone) {

            initRequestedWalls(ctx, room);
            wallTerrain(ctx, room).requestingDone = true;

            return false;

        }

        const requestedWalls = wallTerrain(ctx, room).requested;

        const rowToCalculate = requestedWalls.pop();
        const calculatedWalls = calculateWalls(ctx, room, rowToCalculate);

        registerCalculatedWalls(ctx, room, calculatedWalls);

        if (!requestedWalls.length) {

            wallTerrain(ctx, room).calculationDone = true;

            return true;

        }

        return false;

    };

})();


