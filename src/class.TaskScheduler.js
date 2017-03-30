const _ = require("lodash");

const roomEdges = require("./const.roomEdges");
const taskTypes = require("./const.taskTypes");

const Cord = require("./class.Cord");
const Path = require("./class.Path");


module.exports = class {

    constructor({
        game = require("./game"),
        memory = require("./memory"),
        taskFactory = require("./taskFactory"),
        logger = require("./logger")
    } = {}) {

        if (!game) {
            throw new Error("game can't be null");
        }

        if (!memory) {
            throw new Error("memory can't be null");
        }

        if (!taskFactory) {
            throw new Error("taskFactory can't be null");
        }

        if (!logger) {
            throw new Error("logger can't be null");
        }

        this._game = game;
        this._taskFactory = taskFactory;
        this._logger = logger;

        if (!memory.schedule) {
            memory.schedule = {};
        }

        this._memory = memory.schedule;

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
            const lastUpdate = this._memory.lastUpdates[taskType];
            if (lastUpdate && this._game.time - lastUpdate < frequency) {
                return;
            }
            this._schedulingMethods[taskType].bind(this)(room);
            this._memory.lastUpdates[taskType] = this._game.time;
        });
    }

    nextTask() {
        if (!this._memory.tasks.length) {
            return;
        }
        return this._taskFactory.fromJSON(this._memory.tasks[0]);
    }

    completeLastTask() {
        if (!this._memory.tasks.length) {
            throw new Error("no queued tasks");
        }
        this._memory.tasks.shift();
    }

    _initializeMemory() {
        if (!this._memory.lastUpdates) {
            this._memory.lastUpdates = {};
        }
        if (!this._memory.tasks) {
            this._memory.tasks = [];
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

            this._memory.lastUpdates[taskTypes.EXITS_COMPUTING] = this._game.time;
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

            this._memory.lastUpdates[taskTypes.WALL] = this._game.time;
        });
    }

    _queueTask(task) {
        if (!this._memory.tasks) {
            this._memory.tasks = [task];
            return;
        }
        this._memory.tasks.push(task);
    }
};

