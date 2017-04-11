module.exports = (() => {


    const _ = require("lodash");

    const loggingLevels = require("./const.loggingLevels");


    const levelPriorities = {
        [loggingLevels.DEBUG]: 4,
        [loggingLevels.ERROR]: 1,
        [loggingLevels.INFO]: 3,
        [loggingLevels.WARN]: 2
    };

    const getLogger = (ctx) => ctx.memory.logger;


    const log = (ctx, level, module, message, room) => {

        const {game} = ctx;

        if (_.has(loggingLevels, level)) {

            throw new Error(`unknown logging level: ${level}`);

        }

        if (!ctx.memory.logger) {

            ctx.memory.logger = {};

        }

        if (!ctx.memory.logger.defaultLevel) {

            ctx.memory.logger.defaultLevel = loggingLevels.INFO;

        }

        if (!ctx.memory.logger.moduleLevels) {

            ctx.memory.logger.moduleLevels = {};

        }

        const logger = getLogger(ctx);

        const moduleLevel = logger.moduleLevels[module];

        const loggingLevel = moduleLevel
            ? moduleLevel
            : logger.defaultLevel;

        if (levelPriorities[loggingLevel] < levelPriorities[level]) {

            return;

        }

        const timeText = _.padRight(game.time.toString(), 9);
        const levelText = _.padRight(level, 5);
        const roomNameText = room
            ? _.padRight(room.name, 10)
            : "";

        console.log(`${timeText} ${levelText} ${roomNameText} ${message}`);

    };


    return (module) => ({
        debug: _.curry(log)(_, loggingLevels.DEBUG, module, _, _),
        error: _.curry(log)(_, loggingLevels.ERROR, module, _, _),
        info: _.curry(log)(_, loggingLevels.INFO, module, _, _),
        warn: _.curry(log)(_, loggingLevels.WARN, module, _, _)
    });

})();
