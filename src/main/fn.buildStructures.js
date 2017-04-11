module.exports = (() => {

    const _ = require("lodash");
    const logger = require("./fn.createLogger")("fn.buildStructures");
    const resultTypes = require("./const.resultTypes");
    const structureTypes = require("./const.structureTypes");

    const formatError = (type, error, x, y) =>
        `can't create construction site for ${type} at (${x},${y}): ${error}`;

    const build = (ctx, room, structureType) => {

        const {structures} = ctx.memory.rooms[room.name];

        if (
            !structures[structureType] || !structures[structureType].calculated
        ) {

            throw new Error(`no calculated ${structureType}s`);

        }

        const calculatedStructures = structures[structureType].calculated;

        _.forEach(calculatedStructures, (cord) => {

            const result = room.createConstructionSite(
                    cord.x, cord.y, structureType
                );

            if (result !== resultTypes.OK) {

                const error = _.invert(resultTypes)[result];

                if (
                        result === resultTypes.ERR_FULL ||
                        result === resultTypes.ERR_RCL_NOT_ENOUGH ||
                        result === resultTypes.ERR_INVALID_TARGET
                    ) {

                    logger.debug(
                            ctx,
                            formatError(structureType, error, cord.x, cord.y),
                            room
                        );

                } else {

                    logger.error(
                            ctx,
                            formatError(structureType, error, cord.x, cord.y),
                            room
                        );

                }

            }

        }
        );

    };


    const buildExtensions =
        _.curry(build)(_, _, structureTypes.EXTENSION);

    const buildRoads =
        _.curry(build)(_, _, structureTypes.ROAD);

    return (ctx, room) => {

        if (!ctx.memory.rooms[room.name].structures) {

            throw new Error("no calculated structures");

        }

        buildExtensions(ctx, room);


        buildRoads(ctx, room);

    };

})();
