module.exports = (() => {


    const _ = require("lodash");
    const logger = require("./fn.createLogger")("fn.calculateExtensions");

    const searchTypes = require("./const.searchTypes");
    const structureTypes = require("./const.structureTypes");

    const roomSize = 50;

    const extensionStructures = (ctx, room) =>
        ctx.memory.rooms[room.name].structures[structureTypes.EXTENSION];

    const initMemory = (ctx, room) => {

        const {memory} = ctx;

        if (!memory.rooms[room.name].structures) {

            memory.rooms[room.name].structures = {};

        }

        if (!memory.rooms[room.name].structures[structureTypes.EXTENSION]) {

            memory.rooms[room.name].structures[structureTypes.EXTENSION] = {};

        }

        if (!extensionStructures(ctx, room).requested) {

            extensionStructures(ctx, room).requested = [];

        }

        if (!extensionStructures(ctx, room).requestingDone) {

            extensionStructures(ctx, room).requestingDone = false;

        }

        if (!extensionStructures(ctx, room).calculated) {

            extensionStructures(ctx, room).calculated = [];

        }

        if (!extensionStructures(ctx, room).calculationDone) {

            extensionStructures(ctx, room).calculationDone = false;

        }

        if (!extensionStructures(ctx, room).index) {

            extensionStructures(ctx, room).index = {};

        }

    };

    const initRequestedExtensions = (ctx, room) => {

        const spawns = room.find(searchTypes.MY_SPAWNS);

        extensionStructures(ctx, room).requested = _.map(spawns, (spawn) =>
            ({spawnId: spawn.id})
        );

    };

    const registerCalculatedExtensions = (ctx, extensions, room) => {

        const {reserveRoomTile} = ctx;

        _.forEach(extensions, (cord) => {

            const cordIndex = `(${cord.x},${cord.y})`;

            if (_.has(extensionStructures(ctx, room).index, cordIndex)) {

                return;

            }
            reserveRoomTile(ctx, room, cord.x, cord.y);
            extensionStructures(ctx, room).index[cordIndex] = true;
            extensionStructures(ctx, room).calculated.push(cord);

        });

    };

    const calculateExtensions = (ctx, room, extensions) => {

        const {isRoomTileReserved} = ctx;

        const extensionsSpawn = _.first(room.find(
            searchTypes.MY_SPAWNS,
            {filter: (spawn) => spawn.id === extensions.spawnId}));

        if (!extensionsSpawn) {

            logger.error(
                ctx,
                `can't find spawn with id ${extensions.spawnId}`,
                room
            );

            return null;

        }

        const sx = extensionsSpawn.pos.x;
        const sy = extensionsSpawn.pos.y;

        let radius = 0;
        let toCalculate = 15;
        let x = 0;
        let y = 0;
        let dx = 0;
        let dy = 0;

        const cords = [];

        while (toCalculate) {

            if (x === -radius && y === -radius) {

                radius += 1;
                x = -radius;
                y = -radius;
                dx = 2;
                dy = 0;

            } else if (x === radius && y === -radius) {

                dx = 0;
                dy = 2;

            } else if (x === radius && y === radius) {

                dx = -2;
                dy = 0;

            } else if (x === -radius && y === radius) {

                dx = 0;
                dy = -2;

            }

            const rx = sx + x;
            const ry = sy + y;


            if (
                rx >= 0 &&
                ry >= 0 &&
                rx < roomSize - 1 &&
                ry < roomSize - 1 && !isRoomTileReserved(ctx, room, rx, ry)
            ) {

                cords.push({
                    x: rx,
                    y: ry
                });

                toCalculate -= 1;

            }

            x += dx;
            y += dy;

        }

        return cords;

    };

    return (ctx, room) => {

        initMemory(ctx, room);

        if (extensionStructures(ctx, room).calculationDone) {

            return true;

        }

        if (!extensionStructures(ctx, room).requestingDone) {

            initRequestedExtensions(ctx, room);
            extensionStructures(ctx, room).requestingDone = true;

            return false;

        }

        const requestedExtensions = extensionStructures(ctx, room).requested;
        const extensionsToCalculate = requestedExtensions.pop();

        if (!extensionsToCalculate) {

            logger.error(
                ctx,
                " calculation in progress with no requested extensions left",
                room
            );

            return false;

        }

        const calculatedExtensions = calculateExtensions(
            ctx, room, extensionsToCalculate
        );

        if (!calculatedExtensions) {

            requestedExtensions.push(extensionsToCalculate);

            return false;

        }

        registerCalculatedExtensions(ctx, calculatedExtensions, room);

        if (!requestedExtensions.length) {

            extensionStructures(ctx, room).index = {};
            extensionStructures(ctx, room).calculationDone = true;

            return true;

        }

        return false;

    };

})();


