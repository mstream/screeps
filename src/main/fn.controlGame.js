module.exports = (() => {


    const _ = require("lodash");

    const initMemoryContainerForObjects = (ctx, objectType) => {

        const {memory} = ctx;

        if (!memory[objectType]) {

            memory[objectType] = {};

        }

    };

    const initMemoryContainerForCreeps =
        _.curry(initMemoryContainerForObjects)(_, "creeps");

    const initMemoryContainerForRooms =
        _.curry(initMemoryContainerForObjects)(_, "rooms");

    const initMemoryContainerForObject = (ctx, objectId, objectType) => {

        const {memory} = ctx;

        if (!memory[objectType][objectId]) {

            memory[objectType][objectId] = {};

        }

    };

    const initMemoryContainerForCreep =
        _.curry(initMemoryContainerForObject)(_, _, "creeps");

    const initMemoryContainerForRoom =
        _.curry(initMemoryContainerForObject)(_, _, "rooms");

    return (ctx) => {

        const {controlCreep, controlRoom, controlSpawn, game} = ctx;

        initMemoryContainerForCreeps(ctx);
        initMemoryContainerForRooms(ctx);

        _.forEach(game.rooms, (room) => {

            initMemoryContainerForRoom(ctx, room.name);
            controlRoom(ctx, room);

        });

        _.forEach(game.creeps, (creep) => {

            initMemoryContainerForCreep(ctx, creep.name);
            controlCreep(ctx, creep);

        });

        _.forEach(game.spawns, (spawn) => {

            controlSpawn(ctx, spawn);

        });

    };

})();

