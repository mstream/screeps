const _ = require("lodash");

const roomEdges = require("./const.roomEdges");
const taskTypes = require("./const.taskTypes");

const Cord = require("./class.Cord");
const Path = require("./class.Path");


module.exports = class {

    constructor({
        taskScheduler = require("./taskScheduler"),
        gameProvider = require("./gameProvider"),
        exitsCalculator = require("./exitsCalculator"),
        extensionsCalculator = require("./extensionsCalculator"),
        wallsCalculator = require("./wallsCalculator"),
        roadCalculator = require("./roadCalculator"),
        logger = require("./logger")
    } = {}) {

        if (!taskScheduler) {
            throw new Error("taskScheduler can't be null");
        }

        if (!gameProvider) {
            throw new Error("gameProvider can't be null");
        }

        if (!exitsCalculator) {
            throw new Error("exitsCalculator can't be null");
        }

        if (!extensionsCalculator) {
            throw new Error("extensionsCalculator can't be null");
        }

        if (!wallsCalculator) {
            throw new Error("wallsCalculator can't be null");
        }

        if (!roadCalculator) {
            throw new Error("roadCalculator can't be null");
        }

        if (!logger) {
            throw new Error("logger can't be null");
        }

        this._taskScheduler = taskScheduler;
        this._gameProvider = gameProvider;
        this._exitsCalculator = exitsCalculator;
        this._extensionsCalculator = extensionsCalculator;
        this._wallsCalculator = wallsCalculator;
        this._roadCalculator = roadCalculator;
        this._logger = logger;
    }

    execute(room) {

        const task = this._taskScheduler.nextTask();

        if (!task) {
            return;
        }

        const shouldExecute = this._gameProvider.get().time % task.cost == 0;

        if (!shouldExecute) {
            return;
        }

        const taskType = task.type;

        switch (taskType) {

        case taskTypes.ROAD_COMPUTING: {

            const path = Path.fromJSON(task.options.path);
            const pathHash = path.hash;
            this._logger.info(`started path calculation: ${pathHash}`);
            const result = this._roadCalculator.calculate(
                room.cordToPos(path.from),
                room.cordToPos(path.to)
            );
            if (result.incomplete) {
                this._logger.warn(
                    `could not finish path calculation: ${pathHash}`
                );
                return;
            }
            this._logger.info(`finished path calculation: ${pathHash}`);
            const pathSegments = _.map(result.path, pos => Cord.fromPos(pos));
            room.setPathSegments(pathHash, pathSegments);
            break;
        }

        case taskTypes.EXITS_COMPUTING: {
            const edge = task.options.edge;
            const exits = this._computeEdge(
                room, this._exitsCalculator, edge
            );
            room.setEdgeObjects("exits", edge, exits);
            break;
        }

        case taskTypes.WALLS_COMPUTING: {
            const edge = task.options.edge;
            const walls = this._computeEdge(
                room, this._wallsCalculator, edge
            );
            room.setEdgeObjects("walls", edge, walls);
            break;
        }

        case taskTypes.EXTENSIONS_COMPUTING: {
            this._logger.info("started extensions calculation");
            const extensions = this._extensionsCalculator.calculate(10);
            room.setExtensions(extensions);
            this._logger.info("finished extensions calculation");
            break;
        }

        case taskTypes.ROADS_BUILDING:
            room.buildRoads();
            break;

        case taskTypes.WALLS_BUILDING:
            room.buildWalls();
            break;

        case taskTypes.EXTENSIONS_BUILDING:
            room.buildExtensions();
            break;

        default:
            throw new Error(`unknown task type in the queue: ${taskType}`);
        }
        this._taskScheduler.completeLastTask();
    }

    _computeEdge(room, calculator, edge) {
        const upperFirstEdge = edge.charAt(0).toUpperCase() + edge.slice(1);
        const calculationMethod = `calculate${upperFirstEdge}`;
        return calculator[calculationMethod](room);
    }
};