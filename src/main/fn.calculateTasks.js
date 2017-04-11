module.exports = (() => {


    const _ = require("lodash");

    const searchTypes = require("./const.searchTypes");
    const structureTypes = require("./const.structureTypes");
    const taskTypes = require("./const.taskTypes");


    const creepTasks = (ctx, room) =>
        ctx.memory.rooms[room.name].creepTasks;

    const initMemory = (ctx, room) => {

        if (!ctx.memory.rooms[room.name].creepTasks) {

            ctx.memory.rooms[room.name].creepTasks = {};

        }

        if (!creepTasks(ctx, room).required) {

            creepTasks(ctx, room).required = {};

        }

        if (!creepTasks(ctx, room).assignment) {

            creepTasks(ctx, room).assignment = {};

        }

        if (!creepTasks(ctx, room).priority) {

            creepTasks(ctx, room).priority = {};

        }

    };

    const clearMemory = (ctx, room) => {

        creepTasks(ctx, room).required = {};
        creepTasks(ctx, room).priority = {};

    };

    const addTask = (ctx, room, task) => {

        const {generateTaskIndex} = ctx;

        const taskIndex = generateTaskIndex(task);

        if (creepTasks(ctx, room).required[taskIndex]) {

            return;

        }

        if (!creepTasks(ctx, room).priority[task.priority]) {

            creepTasks(ctx, room).priority[task.priority] = [];

        }

        creepTasks(ctx, room).required[taskIndex] = task;
        creepTasks(ctx, room).priority[task.priority].push(taskIndex);

    };

    const createControllerUpgradingTasks = (ctx, room) => {

        const sources = room.find(searchTypes.SOURCES);

        _.forEach(sources, (source) => {

            const sourceId = source.id;

            const task = {
                priority: 4,
                sourceId,
                type: taskTypes.UPGRADING
            };

            const substituteTask = {
                priority: 10,
                sourceId,
                type: taskTypes.UPGRADING
            };

            addTask(ctx, room, task);
            addTask(ctx, room, substituteTask);

        });

    };

    const createStructureBuildingTasks = (ctx, room) => {

        const constructionSites = room.find(searchTypes.CONSTRUCTION_SITES);

        if (!constructionSites.length) {

            return;

        }

        const sources = room.find(searchTypes.SOURCES);

        _.forEach(sources, (source) => {

            const sourceId = source.id;
            const task = {
                priority: 6,
                sourceId,
                type: taskTypes.BUILDING
            };

            addTask(ctx, room, task);

        });

    };

    const createEnergyCollectingTasks = (ctx, room) => {

        const storageBuildings = room.find(searchTypes.STRUCTURES, {
            filter: (structure) =>
            structure.energy < structure.energyCapacity &&
            (structure.structureType === structureTypes.SPAWN ||
            structure.structureType === structureTypes.EXTENSION)
        });

        if (!storageBuildings.length) {

            return;

        }

        const sources = room.find(searchTypes.SOURCES);

        _.forEach(sources, (source) => {

            const sourceId = source.id;
            const task = {
                priority: 5,
                sourceId,
                type: taskTypes.COLLECTING
            };

            addTask(ctx, room, task);

        });

    };

    return (ctx, room) => {

        initMemory(ctx, room);
        clearMemory(ctx, room);
        createStructureBuildingTasks(ctx, room);
        createControllerUpgradingTasks(ctx, room);
        createEnergyCollectingTasks(ctx, room);

    };

})();


