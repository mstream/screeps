const _ = require("lodash");


module.exports = class {

    constructor({
        gameProvider = require("./gameProvider"),
        memoryProvider = require("./memoryProvider"),
        roomControllerFactory = require("./roomControllerFactory"),
        creepControllerFactory = require("./creepControllerFactory")
    } = {}) {

        if (!gameProvider) {
            throw new Error("gameProvider can't be null");
        }

        if (!memoryProvider) {
            throw new Error("memoryProvider can't be null");
        }

        if (!roomControllerFactory) {
            throw new Error("roomControllerFactory can't be null");
        }

        if (!creepControllerFactory) {
            throw new Error("creepControllerFactory can't be null");
        }

        this._gameProvider = gameProvider;
        this._memoryProvider = memoryProvider;
        this._creepControllerFactory = creepControllerFactory;

        this._rooms = _.mapValues(gameProvider.get().rooms, (room) =>
            roomControllerFactory.createFor(room)
        );
    }

    execute() {

        _.forEach(this._rooms, (room) => {

            room.execute();

            _.forOwn(this._gameProvider.get().creeps, (creep) => {

                if (room.name != creep.room.name) {
                    return;
                }

                const creepController = this._creepControllerFactory.createFor(
                    creep, room
                );

                if (!creepController.task) {
                    const task = this._chooseMostImportantUnassignedTaskForCreep(
                        creepController, room
                    );
                    if (task) {
                        creepController.assignTask(task);
                        room.assignCreepToTask(creepController, task);
                    }
                }
                creepController.execute();
            });
        });
    }

    get rooms() {
        return this._rooms;
    }

    get time() {
        return this._gameProvider.get().time;
    }

    _chooseMostImportantUnassignedTaskForCreep(creep, room) {
        const tasksForCreep = room.creepTasks[creep.role];

        const tasksPriorities = _.keys(tasksForCreep);
        if (!tasksPriorities.length) {
            return;
        }

        tasksPriorities.sort((a, b) => b - a);

        const tasksInPriorityOrder = _.flatten(_.map(tasksPriorities, priority => tasksForCreep[priority]));
        const taskHashesInPriorityOrder = _.flatten(_.map(tasksInPriorityOrder, (tasks) => _.keys(tasks)));
        const unassignedTaskHashes = _.filter(taskHashesInPriorityOrder, (taskHash) => {
            return !room.creepTaskAssignments[taskHash];
        });

        const taskHash = unassignedTaskHashes[0];

        return _.find(tasksInPriorityOrder, (tasks) => tasks[taskHash])[taskHash];
    }
};

