const _ = require("lodash");

const roomEdges = require("./const.roomEdges");
const taskTypes = require("./const.taskTypes");

const Cord = require("./class.Cord");
const Path = require("./class.Path");


module.exports = class {

    constructor({
        gameProvider = require("./gameProvider"),
        memoryProvider = require("./memoryProvider"),
        taskFactory = require("./taskFactory"),
        logger = require("./logger")
    } = {}) {

        if (!gameProvider) {
            throw new Error("gameProvider can't be null");
        }

        if (!memoryProvider) {
            throw new Error("memoryProvider can't be null");
        }

        if (!taskFactory) {
            throw new Error("taskFactory can't be null");
        }

        if (!logger) {
            throw new Error("logger can't be null");
        }

        this._gameProvider = gameProvider;
        this._taskFactory = taskFactory;
        this._logger = logger;

        if (!memoryProvider.get().schedule) {
            memoryProvider.get().schedule = {};
        }

        this._memoryProvider = {
            get: () => memoryProvider.get().schedule
        };

        this._schedulingFrequencies = {
            [taskTypes.EXTENSIONS_BUILDING]: 100,
            [taskTypes.EXTENSIONS_COMPUTING]: 200,
            [taskTypes.ROAD_COMPUTING]: 200,
            [taskTypes.ROADS_BUILDING]: 100,
            [taskTypes.WALLS_BUILDING]: 100
        };

        this._schedulingMethods = {
            [taskTypes.EXTENSIONS_COMPUTING]: () =>
                this._queueTask(this._taskFactory.create(taskTypes.EXTENSIONS_COMPUTING)),
            [taskTypes.EXTENSIONS_BUILDING]: () =>
                this._queueTask(this._taskFactory.create(taskTypes.EXTENSIONS_BUILDING)),
            [taskTypes.ROADS_BUILDING]: () =>
                this._queueTask(this._taskFactory.create(taskTypes.ROADS_BUILDING)),
            [taskTypes.WALLS_BUILDING]: () =>
                this._queueTask(this._taskFactory.create(taskTypes.WALLS_BUILDING)),
            [taskTypes.ROAD_COMPUTING]: this._requestPathsCalculation
        };

        this._initializeMemory();
    }

    schedule(room) {

        this._requestExitsCalculation(room);
        this._requestWallsCalculation(room);

        _.forOwn(this._schedulingFrequencies, (frequency, taskType) => {
            const lastUpdate = this._memoryProvider.get().lastUpdates[taskType];
            if (lastUpdate && this._gameProvider.time - lastUpdate < frequency) {
                return;
            }
            this._schedulingMethods[taskType].bind(this)(room);
            this._memoryProvider.get().lastUpdates[taskType] = this._gameProvider.time;
        });
    }

    nextTask() {
        if (!this._memoryProvider.get().tasks.length) {
            return;
        }
        return this._taskFactory.fromJSON(this._memoryProvider.get().tasks[0]);
    }

    completeLastTask() {
        if (!this._memoryProvider.get().tasks.length) {
            throw new Error("no queued tasks");
        }
        this._memoryProvider.get().tasks.shift();
    }

    _initializeMemory() {
        if (!this._memoryProvider.get().lastUpdates) {
            this._memoryProvider.get().lastUpdates = {};
        }
        if (!this._memoryProvider.get().tasks) {
            this._memoryProvider.get().tasks = [];
        }
    }

    _requestPathsCalculation(room) {
        room.sources.forEach((source) => {
            room.spawns.forEach((spawn) => {
                this._requestPathCalculation(room, source, spawn);
            });
            this._requestPathCalculation(room, source, room.controller);
        });
    }

    _requestPathCalculation(room, fromObj, toObj) {
        const path = new Path(
            Cord.fromPos(fromObj.pos),
            Cord.fromPos(toObj.pos)
        );

        if (room.isPathRequested(path) || room.isPathComputed(path)) {
            return;
        }

        this._logger.info(
            `scheduling tasks: ${taskTypes.ROAD_COMPUTING} for ${path.hash}`
        );

        room.requestPath(path);
        this._queueTask(this._taskFactory.create(
            taskTypes.ROAD_COMPUTING,
            {path}
        ));
    }

    _requestExitsCalculation(room) {

        roomEdges.forEach((edge) => {

            if (room.areExitsRequested(edge) || room.areExitsComputed(edge)) {
                return;
            }

            this._logger.info(
                `scheduling tasks ${taskTypes.EXITS_COMPUTING} for ${edge}`
            );

            room.requestExits(edge);

            this._queueTask(this._taskFactory.create(
                taskTypes.EXITS_COMPUTING,
                {edge}
            ));

            this._memory.lastUpdates[taskTypes.EXITS_COMPUTING] = this._gameProvider.time;
        });
    }

    _requestWallsCalculation(room) {

        roomEdges.forEach((edge) => {

            if (room.areWallsRequested(edge) || room.areWallsComputed(edge)) {
                return;
            }

            this._logger.info(
                `scheduling tasks ${taskTypes.WALLS_COMPUTING} for ${edge}`
            );

            room.requestWalls(edge);

            this._queueTask(this._taskFactory.create(
                taskTypes.WALLS_COMPUTING,
                {edge}
            ));

            this._memoryProvider.get().lastUpdates[taskTypes.WALL] = this._gameProvider.time;
        });
    }

    _queueTask(task) {
        if (!this._memoryProvider.get().tasks) {
            this._memoryProvider.get().tasks = [task];
            return;
        }
        this._memoryProvider.get().tasks.push(task);
    }
};

