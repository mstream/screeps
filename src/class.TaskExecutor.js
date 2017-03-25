const _ = require("lodash");

const roomEdges = require("./const.roomEdges");
const taskTypes = require("./const.taskTypes");

const generateRoadPath = require("./func.generateRoadPath");

const Cord = require("./class.Cord");
const ExitsCalculator = require("./class.ExitsCalculator");
const ExtensionsCalculator = require("./class.ExtensionsCalculator");
const Path = require("./class.Path");
const WallsCalculator = require("./class.WallsCalculator");


module.exports = class {

    constructor(taskScheduler, game, room, logger) {

        if (!taskScheduler) {
            throw new Error("taskScheduler can't be null");
        }

        if (!game) {
            throw new Error("game can't be null");
        }

        if (!room) {
            throw new Error("room can't be null");
        }

        if (!logger) {
            throw new Error("logger can't be null");
        }

        this._taskScheduler = taskScheduler;
        this._game = game;
        this._room = room;
        this._logger = logger;

        this._calculatorConstructorForTaskType = {
            [taskTypes.EXITS_COMPUTING]: ExitsCalculator,
            [taskTypes.EXTENSIONS_COMPUTING]: ExtensionsCalculator,
            [taskTypes.WALLS_COMPUTING]: WallsCalculator
        };
    }

    execute() {

        const task = this._taskScheduler.nextTask();

        if (!task) {
            return;
        }

        const time = this._game.time;
        const shouldExecute = time % task.cost == 0;

        if (!shouldExecute) {
            return;
        }

        const taskType = task.type;

        switch (taskType) {

        case taskTypes.PATHS_COMPUTING: {

            const path = Path.fromJSON(task.options.path);
            const pathHash = path.hash;
            this._logger.info(`started path calculation: ${pathHash}`);
            const result = generateRoadPath(
                this._room.cordToPos(path.from),
                this._room.cordToPos(path.to)
            );
            if (result.incomplete) {
                this._logger.warn(
                    `could not finish path calculation: ${pathHash}`
                );
                return;
            }
            this._logger.info(`finished path calculation: ${pathHash}`);
            const pathSegments = _.map(result.path, pos => Cord.fromPos(pos));
            this._room.setPathSegments(pathHash, pathSegments);
            break;
        }

        case taskTypes.EXITS_COMPUTING:
        case taskTypes.WALLS_COMPUTING: {

            const objectKeyword = taskType.split("_")[0].toLowerCase();
            const edge = task.options.edge;

            if (!roomEdges.includes(edge)) {
                throw new Error(`unknown room edge ${edge}`);
            }

            const upperFirstEdge =
                edge.charAt(0).toUpperCase() + edge.slice(1);

            const upperFirstObjectKeyword =
                objectKeyword.charAt(0).toUpperCase() + objectKeyword.slice(1);

            const calculationMethod = `calculate${upperFirstEdge}${upperFirstObjectKeyword}`;
            this._logger.info(`started ${objectKeyword} calculation: ${edge}`);
            const calculator = new this._calculatorConstructorForTaskType[taskType](this._room);
            const objects = calculator[calculationMethod]();
            this._room.setEdgeObjects(objectKeyword, edge, objects);
            this._logger.info(`finished ${objectKeyword} calculation: ${edge}`);
            break;
        }

        case taskTypes.EXTENSIONS_COMPUTING:
            this._logger.info(`started extensions calculation`);
            const calculator = new this._calculatorConstructorForTaskType[taskType](this._room);
            const extensions = calculator.calculate(10);
            this._room.setExtensions(extensions);
            this._logger.info(`finished extensions calculation`);
            break;

        case taskTypes.ROADS_BUILDING:
            this._room.buildRoads();
            break;

        case taskTypes.WALLS_BUILDING:
            this._room.buildWalls();
            break;

        default:
            throw new Error(`unknown task type in the queue: ${taskType}`);
        }
        this._taskScheduler.completeLastTask();
    }
};