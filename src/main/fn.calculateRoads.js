module.exports = (() => {


    const _ = require("lodash");

    const searchTypes = require("./const.searchTypes");
    const structureTypes = require("./const.structureTypes");

    const roomSize = 50;

    const roadStructures = (ctx, room) =>
        ctx.memory.rooms[room.name].structures[structureTypes.ROAD];

    const initMemory = (ctx, room) => {

        const {memory} = ctx;

        if (!memory.rooms[room.name].structures) {

            memory.rooms[room.name].structures = {};

        }

        if (!memory.rooms[room.name].structures[structureTypes.ROAD]) {

            memory.rooms[room.name].structures[structureTypes.ROAD] = {};

        }

        if (!roadStructures(ctx, room).requested) {

            roadStructures(ctx, room).requested = [];

        }

        if (!roadStructures(ctx, room).requestingDone) {

            roadStructures(ctx, room).requestingDone = false;

        }

        if (!roadStructures(ctx, room).calculated) {

            roadStructures(ctx, room).calculated = [];

        }

        if (!roadStructures(ctx, room).calculationDone) {

            roadStructures(ctx, room).calculationDone = false;

        }

        if (!roadStructures(ctx, room).index) {

            roadStructures(ctx, room).index = {};

        }

    };

    const initRequestedRoads = (ctx, room) => {

        const sources = room.find(searchTypes.SOURCES);
        const controllerPos = room.controller.pos;

        roadStructures(ctx, room).requested = _.map(sources, (source) => ({
            "from": controllerPos,
            "to": source.pos
        }));

    };

    const registerCalculatedRoad = (ctx, road, room) => {

        const {reserveRoomTile} = ctx;

        _.forEach(road, (cord) => {

            const cordIndex = `(${cord.x},${cord.y})`;

            if (_.has(roadStructures(ctx, room).index, cordIndex)) {

                return;

            }
            reserveRoomTile(ctx, room, cord.x, cord.y);
            roadStructures(ctx, room).index[cordIndex] = true;
            roadStructures(ctx, room).calculated.push(cord);

        });

    };

    const calculateRoad = (ctx, requestedRoad) => {

        const {game, isRoomTileReserved, pathFinder} = ctx;

        const result = pathFinder.search(
            requestedRoad.from,
            [{
                pos: requestedRoad.to,
                range: 1
            }],
            {
                maxRooms: 1,
                plainCost: 1,
                roomCallback: (roomName) => {

                    const room = game.rooms[roomName];

                    if (!room) {

                        return false;

                    }

                    const cost = new PathFinder.CostMatrix();

                    for (let y = 0; y < roomSize; y += 1) {

                        for (let x = 0; x < roomSize; x += 1) {

                            if (isRoomTileReserved(ctx, room, x, y)) {

                                cost.set(x, y, 0xff);

                            }

                        }

                    }

                    _.forEach(room.find(structureTypes.ROAD), (road) =>
                        cost.set(road.pos.x, road.pos.y, 1)
                    );

                    return cost;

                },
                swampCost: 2
            }
        );

        if (result.incomplete) {

            return null;

        }

        return _.map(result.path, (cord) => ({
            x: cord.x,
            y: cord.y
        }));

    };

    return (ctx, room) => {

        initMemory(ctx, room);

        if (roadStructures(ctx, room).calculationDone) {

            return true;

        }

        if (!roadStructures(ctx, room).requestingDone) {

            initRequestedRoads(ctx, room);
            roadStructures(ctx, room).requestingDone = true;

            return false;

        }

        const requestedRoads = roadStructures(ctx, room).requested;
        const roadToCalculate = requestedRoads.pop();
        const calculatedRoad = calculateRoad(ctx, roadToCalculate);

        if (!calculatedRoad) {

            requestedRoads.push(roadToCalculate);

            return false;

        }

        registerCalculatedRoad(ctx, calculatedRoad, room);

        if (!requestedRoads.length) {

            roadStructures(ctx, room).index = {};
            roadStructures(ctx, room).calculationDone = true;

            return true;

        }

        return false;

    };

})();


