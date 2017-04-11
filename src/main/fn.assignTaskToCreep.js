module.exports = (() => {

    const _ = require("lodash");

    const logger = require("./fn.createLogger")("fn.assignTaskToCreep");

    const getTasks = (ctx, room) =>
        ctx.memory.rooms[room.name].creepTasks;

    const initMemory = (ctx, room) => {

        if (!ctx.memory.rooms[room.name].creepTasks) {

            ctx.memory.rooms[room.name].creepTasks = {};

        }

        if (!getTasks(ctx, room).required) {

            getTasks(ctx, room).required = {};

        }

        if (!getTasks(ctx, room).assignment) {

            getTasks(ctx, room).assignment = {};

        }

        if (!getTasks(ctx, room).priority) {

            getTasks(ctx, room).priority = {};

        }

    };

    const reclaimTasksFromDeadCreeps = (ctx, room) => {

        const {game} = ctx;
        const assignments = getTasks(ctx, room).assignment;

        _.forOwn(assignments, (creepName, taskIndex) => {

            if (game.creeps[creepName]) {

                return;

            }
            delete assignments[taskIndex];

        });

    };

    return (ctx, room, creep) => {

        const {memory} = ctx;

        initMemory(ctx, room);

        reclaimTasksFromDeadCreeps(ctx, room);

        const tasks = getTasks(ctx, room);

        const priorities = _.keys(tasks.priority);


        if (!priorities.length) {

            return;

        }

        const withdrawedTaskIndexesByPriority =
            _.chain(priorities).
                map((priority) => tasks.priority[priority]).
                flatten().
                filter((taskIndex) => !tasks.assignment[taskIndex]).
                value();

        if (!withdrawedTaskIndexesByPriority.length) {

            return;

        }

        const mostUrgentTaskIndex = _.first(withdrawedTaskIndexesByPriority);

        memory.creeps[creep.name].task = tasks.required[mostUrgentTaskIndex];
        tasks.assignment[mostUrgentTaskIndex] = creep.name;

        logger.info(
            ctx,
            `assigning task ${mostUrgentTaskIndex} to creep ${creep.name}`,
            room
        );

    };

})();
