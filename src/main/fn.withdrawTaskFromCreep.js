module.exports = (() => {

    const getTasks = (ctx, room) =>
        ctx.memory.rooms[room.name].creepTasks;

    const getCreepTask = (ctx, creep) =>
        ctx.memory.creeps[creep.name].task;

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

    return (ctx, room, creep) => {

        const {generateTaskIndex} = ctx;

        initMemory(ctx, room);

        const creepTask = getCreepTask(ctx, creep);

        creep.task = null;

        getTasks(ctx, room).assignment[generateTaskIndex(creepTask)] = null;

    };

})();
