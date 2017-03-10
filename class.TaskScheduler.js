const roomEdges = require("const.roomEdges");
const taskTypes = require("const.taskTypes");

const Cord = require("class.Cord");
const Path = require("class.Path");
const Task = require("class.Task");


module.exports = class {

    constructor(game, room, memory, logger) {

        if (!game) {
            throw new Error("game can't be null");
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

        this._game = game;
        this._room = room;
        this._logger = logger;

        if (!memory.schedule) {
            memory.schedule = {};
        }

        this._memory = memory.schedule;

        this._schedulingFrequencies = {
            [taskTypes.ROADS_BUILDING]: 50,
            [taskTypes.WALLS_BUILDING]: 50,
            [taskTypes.PATHS_COMPUTING]: 100
        };

        this._schedulingMethods = {
            [taskTypes.ROADS_BUILDING]: () =>
                this._queueTask(new Task(taskTypes.ROADS_BUILDING)),
            [taskTypes.WALLS_BUILDING]: () =>
                this._queueTask(new Task(taskTypes.WALLS_BUILDING)),
            [taskTypes.PATHS_COMPUTING]: this._requestPathsCalculation
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

        const gameTime = this._game.time;

        this._requestExitsCalculation();
        this._requestWallsCalculation();

        _.forOwn(this._schedulingFrequencies, (frequency, taskType) => {
            const lastUpdate = this._memory.lastUpdates[taskType];
            if (lastUpdate && gameTime - lastUpdate < frequency) {
                return;
            }
            this._schedulingMethods[taskType].bind(this)();
            this._memory.lastUpdates[taskType] = gameTime;
        });
    }

    nextTask() {
        if (!this._memory.tasks.length) {
            return;
        }
        return Task.fromJSON(this._memory.tasks[0]);
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
                this._requestPathCalculation(source, spawn)
            });
            this._requestPathCalculation(source, this._room.controller)
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
            `scheduling tasks: ${taskTypes.PATHS_COMPUTING} for ${path.hash}`
        );

        this._room.requestPath(path);
        this._queueTask(new Task(
            taskTypes.PATHS_COMPUTING,
            {path}
        ));
    }

    _requestExitsCalculation() {

        const gameTime = this._game.time;

        roomEdges.forEach((edge) => {

            if (this._room.areExitsRequested(edge) || this._room.areExitsComputed(edge)) {
                return;
            }

            this._logger.info(
                `scheduling tasks ${taskTypes.EXITS_COMPUTING} for ${edge}`
            );

            this._room.requestExits(edge);

            this._queueTask(new Task(
                taskTypes.EXITS_COMPUTING,
                {edge}
            ));

            this._memory.lastUpdates[taskTypes.EXITS_COMPUTING] = gameTime;
        });
    }

    _requestWallsCalculation() {

        const gameTime = this._game.time;

        roomEdges.forEach((edge) => {

            if (this._room.areWallsRequested(edge) || this._room.areWallsComputed(edge)) {
                return;
            }

            this._logger.info(
                `scheduling tasks ${taskTypes.WALLS_COMPUTING} for ${edge}`
            );

            this._room.requestWalls(edge);

            this._queueTask(new Task(
                taskTypes.WALLS_COMPUTING,
                {edge}
            ));

            this._memory.lastUpdates[taskTypes.WALL] = gameTime;
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

