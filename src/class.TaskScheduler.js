const _ = require("lodash");

const roomEdges = require("./const.roomEdges");
const taskTypes = require("./const.taskTypes");

const Cord = require("./class.Cord");
const Path = require("./class.Path");
const TaskFactory = require("./class.TaskFactory");


module.exports = class {

    constructor(time, room, memory, logger) {

        if (!time) {
            throw new Error("time can't be null");
        }

        if (!room) {
            throw new Error("room can't be null");
        }

        if (!memory) {
            throw new Error("memory can't be null");
        }

        if (!logger) {
            throw new Error("logger can't be null");
        }

        this._time = time;
        this._room = room;
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

        this._taskFactory = new TaskFactory();

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

    _initializeMemory() {
        if (!this._memory.lastUpdates) {
            this._memory.lastUpdates = {};
        }
        if (!this._memory.tasks) {
            this._memory.tasks = [];
        }
    }

    schedule() {

        this._requestExitsCalculation();
        this._requestWallsCalculation();

        _.forOwn(this._schedulingFrequencies, (frequency, taskType) => {
            const lastUpdate = this._memory.lastUpdates[taskType];
            if (lastUpdate && this._time - lastUpdate < frequency) {
                return;
            }
            this._schedulingMethods[taskType].bind(this)();
            this._memory.lastUpdates[taskType] = this._time;
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

    _requestPathsCalculation() {
        this._room.sources.forEach((source) => {
            this._room.spawns.forEach((spawn) => {
                this._requestPathCalculation(source, spawn);
            });
            this._requestPathCalculation(source, this._room.controller);
        });
    }

    _requestPathCalculation(fromObj, toObj) {
        const path = new Path(
            Cord.fromPos(fromObj.pos),
            Cord.fromPos(toObj.pos)
        );

        if (this._room.isPathRequested(path) || this._room.isPathComputed(path)) {
            return;
        }

        this._logger.info(
            `scheduling tasks: ${taskTypes.ROAD_COMPUTING} for ${path.hash}`
        );

        this._room.requestPath(path);
        this._queueTask(this._taskFactory.create(
            taskTypes.ROAD_COMPUTING,
            {path}
        ));
    }

    _requestExitsCalculation() {

        roomEdges.forEach((edge) => {

            if (this._room.areExitsRequested(edge) || this._room.areExitsComputed(edge)) {
                return;
            }

            this._logger.info(
                `scheduling tasks ${taskTypes.EXITS_COMPUTING} for ${edge}`
            );

            this._room.requestExits(edge);

            this._queueTask(this._taskFactory.create(
                taskTypes.EXITS_COMPUTING,
                {edge}
            ));

            this._memory.lastUpdates[taskTypes.EXITS_COMPUTING] = this._time;
        });
    }

    _requestWallsCalculation() {

        roomEdges.forEach((edge) => {

            if (this._room.areWallsRequested(edge) || this._room.areWallsComputed(edge)) {
                return;
            }

            this._logger.info(
                `scheduling tasks ${taskTypes.WALLS_COMPUTING} for ${edge}`
            );

            this._room.requestWalls(edge);

            this._queueTask(this._taskFactory.create(
                taskTypes.WALLS_COMPUTING,
                {edge}
            ));

            this._memory.lastUpdates[taskTypes.WALL] = this._time;
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

