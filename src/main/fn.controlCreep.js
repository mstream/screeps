module.exports = (() => {


    const _ = require("lodash");

    const actionTypes = require("./const.actionTypes");
    const searchTypes = require("./const.searchTypes");
    const structureTypes = require("./const.structureTypes");
    const taskTypes = require("./const.taskTypes");

    const logger = require("./fn.createLogger")("fn.controlCreep");


    const getCurrentTask =
        (ctx, creep) => ctx.memory.creeps[creep.name].task;

    const setCurrentTask = (ctx, creep, task) => {

        ctx.memory.creeps[creep.name].task = task;

    };

    const getCurrentAction =
        (ctx, creep) => ctx.memory.creeps[creep.name].action;

    const isTaskStillRequired = (ctx, room, taskIndex) =>
        ctx.memory.rooms[room.name].creepTasks &&
        ctx.memory.rooms[room.name].creepTasks.required[taskIndex];

    const setCurrentAction = (ctx, creep, targetId, type) => {

        ctx.memory.creeps[creep.name].action = {
            targetId,
            type
        };

    };

    const withdrawNotRequiredTask = (ctx, creep) => {

        const {generateTaskIndex} = ctx;

        const currentTask = getCurrentTask(ctx, creep);

        if (!currentTask) {

            return;

        }

        const taskIndex = generateTaskIndex(currentTask);

        if (!isTaskStillRequired(ctx, creep.room, taskIndex)) {

            setCurrentTask(ctx, creep, null);

        }

    };


    return (ctx, creep) => {

        const {
            assignTaskToCreep,
            drawCreepStatus,
            executeStructuresBuilding,
            executeControllerUpgrading,
            executeEnergyCollecting,
            withdrawTaskFromCreep
        } = ctx;

        const previousTask = getCurrentTask(ctx, creep);

        if (previousTask) {

            withdrawNotRequiredTask(ctx, creep);

        }

        if (!getCurrentAction(ctx, creep)) {

            setCurrentAction(ctx, creep, null, actionTypes.IDLE);

        }

        drawCreepStatus(ctx, creep);


        if (!previousTask) {

            assignTaskToCreep(ctx, creep.room, creep);

        }

        const currentTask = getCurrentTask(ctx, creep);

        if (!currentTask) {

            return;

        }

        if (currentTask.type === taskTypes.COLLECTING) {

            const sources = creep.room.find(searchTypes.SOURCES);

            const storageBuildings = creep.room.find(searchTypes.STRUCTURES, {
                filter: (structure) =>
                structure.energy < structure.energyCapacity &&
                (structure.structureType === structureTypes.SPAWN ||
                structure.structureType === structureTypes.EXTENSION)
            });

            if (!storageBuildings.length) {

                setCurrentAction(ctx, creep, null, actionTypes.IDLE);

                if (!getCurrentAction(ctx, creep) === actionTypes.IDLE) {

                    logger.warn(
                        ctx,
                        `${creep.name} is becoming idle: no empty storage`,
                        creep.room
                    );

                }

                return;

            }

            const assignedSource = _.first(_.filter(
                sources, {id: currentTask.sourceId}
            ));

            const storageBuilding = _.first(storageBuildings);

            const taskFinished = executeEnergyCollecting(
                ctx, storageBuilding, creep, assignedSource
            );

            if (previousTask && taskFinished) {

                withdrawTaskFromCreep(ctx, creep.room, creep);

            }

            return;

        }

        if (currentTask.type === taskTypes.BUILDING) {

            const sources = creep.room.find(searchTypes.SOURCES);

            const constructionSites = creep.room.find(
                searchTypes.CONSTRUCTION_SITES
            );

            if (!constructionSites.length) {

                setCurrentAction(ctx, creep, null, actionTypes.IDLE);

                if (!getCurrentAction(ctx, creep) === actionTypes.IDLE) {

                    logger.warn(
                        ctx,
                        `${creep.name} is becoming idle: nothing to build`,
                        creep.room
                    );

                }

                return;

            }

            const assignedSource = _.first(_.filter(
                sources, {id: currentTask.sourceId}
            ));

            const constructionSite = _.first(constructionSites);

            const taskFinished = executeStructuresBuilding(
                ctx, constructionSite, creep, assignedSource
            );

            if (previousTask && taskFinished) {

                withdrawTaskFromCreep(ctx, creep.room, creep);

            }

            return;

        }

        if (currentTask.type === taskTypes.UPGRADING) {

            const sources = creep.room.find(searchTypes.SOURCES);

            const assignedSource = _.first(_.filter(
                sources, {id: currentTask.sourceId}
            ));

            const taskFinished = executeControllerUpgrading(
                ctx, creep.room.controller, creep, assignedSource
            );

            if (previousTask && taskFinished) {

                withdrawTaskFromCreep(ctx, creep.room, creep);

            }

        }

    };

})();

