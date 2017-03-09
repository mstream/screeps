const objectTypes = require("const.objectTypes");
const roles = require("const.roles");
const roomEdges = require("const.roomEdges");
const taskTypes = require("const.taskTypes");

const buildCreepsIfNeeded = require("func.buildCreepsIfNeeded");

const Cord = require("class.Cord");
const ExitsCalculator = require("class.ExitsCalculator");
const RoomLogger = require("class.RoomLogger");
const Path = require("class.Path");
const TaskExecutor = require("class.TaskExecutor");
const TaskScheduler = require("class.TaskScheduler");
const WallsCalculator = require("class.WallsCalculator");


const objectTypesToFindMappings = {
    SOURCE: FIND_SOURCES,
    CONSTRUCTION_SITE: FIND_CONSTRUCTION_SITES
};

const REQUESTED = "REQUESTED";

const getIds = (objects) => objects.map((object) => object.id);


module.exports = class {

    constructor(room, game, memory) {

        if (!room) {
            throw new Error("room can't be null");
        }

        if (!game) {
            throw new Error("game can't be null");
        }

        if (!memory) {
            throw new Error("memory can't be null");
        }

        this._room = room;
        this._game = game;
        this._logger = new RoomLogger(room, game);

        if (!memory.rooms) {
            memory.rooms = {};
        }

        if (!memory.rooms[room.name]) {
            memory.rooms[room.name] = {};
        }

        this._memory = memory.rooms[room.name];

        this._calculatorConstructorForTaskType = {
            [taskTypes.EXITS_COMPUTING]: ExitsCalculator,
            [taskTypes.WALLS_COMPUTING]: WallsCalculator
        };

        this._taskScheduler = new TaskScheduler(
            this._game, this, this._memory, this._logger
        );

        this._initializeMemory();
        this._loadObjectsFromMemory();
        this._scheduleTasks();
    }

    _initializeMemory() {
        if (!this._memory.objectIds) {
            this._memory.objectIds = {};
        }

        if (!this._memory.objects) {
            this._memory.objects = {};
        }

        if (!this._memory.paths) {
            this._memory.paths = {};
        }

        if (!this._memory.exits) {
            this._memory.exits = {
                top: null,
                right: null,
                bottom: null,
                left: null
            };
        }

        if (!this._memory.walls) {
            this._memory.walls = {
                top: null,
                right: null,
                bottom: null,
                left: null
            };
        }
    }

    executeTasks() {
        const taskExecutor = new TaskExecutor(
            this._taskScheduler, this._game, this._room, this._logger
        );
        taskExecutor.execute();
    }

    buildCreeps() {

        const sourcesNumber = this.findObjects(objectTypes.SOURCE).length;

        buildCreepsIfNeeded(
            this._game,
            this.findObjects(objectTypes.SPAWN)[0],
            {
                [roles.HARVESTER]: sourcesNumber,
                [roles.UPGRADER]: sourcesNumber,
                [roles.BUILDER]: sourcesNumber
            }
        );
    }

    objectsInArea(type, top, left, bottom, right) {
        return this._room.lookForAtArea(type, top, left, bottom, right);
    }

    findObjects(objectsType) {
        const objects = this._objects[objectsType];
        if (objects) {
            return objects;
        }
        switch (objectsType) {
            case objectTypes.CONTROLLER:
                const controllers = [this._room.controller];
                this._objects[objectsType] = controllers;
                this._memory.objectIds[objectTypes.CONTROLLER] = getIds(controllers);
                return controllers;
            case objectTypes.SPAWN:
                const spawns = [];
                _.forOwn(this._game.spawns, (spawn) => {
                    if (spawn.room.name != this._room.name) {
                        return;
                    }
                    spawns.push(spawn);
                });
                this._objects[objectsType] = spawns;
                this._memory.objectIds[objectTypes.SPAWN] = getIds(spawns);
                return spawns;
            default:
                const objects = this._room.find(objectTypesToFindMappings[objectsType]);
                this._objects[objectsType] = objects;
                this._memory.objectIds[objectsType] = getIds(objects);
                return objects;
        }
    }

    harvestersAssignedToSource(source) {
        const sourceId = source.id;
        const sourceMemory = this._memory.objects[sourceId];
        if (!sourceMemory || !sourceMemory.harvesters) {
            return 0;
        }
        return sourceMemory.harvesters;
    }

    assignHarvesterTo(source) {
        const sourceId = source.id;
        if (!this._memory.objects[sourceId]) {
            this._memory.objects[sourceId] = {
                harvesters: 0
            }
        }
        this._memory.objects[sourceId].harvesters++;
    }

    unassignHarvesterFrom(source) {
        const sourceId = source.id;
        const sourceMemory = this._memory.objects[sourceId];
        if (!sourceMemory || !sourceMemory.harvesters) {
            throw new Error(
                `no harvester has ever being assign to source ${sourceId}`);
        }
        sourceMemory.harvesters--;
    }

    buildRoads() {
        const paths = this._memory.paths;

        if (!paths) {
            return;
        }

        const allowance = CONTROLLER_STRUCTURES[STRUCTURE_ROAD][this.level];
        if (!allowance) {
            return;
        }

        _.forOwn(paths, (pathSegments) => {
            if (!pathSegments || pathSegments == REQUESTED) {
                return;
            }
            pathSegments.forEach((pathSegment) => {
                    pathSegment = Cord.fromJSON(pathSegment);
                    this._logger.info(
                        `creating road blueprint at : ${pathSegment.hash}`
                    );
                    this._room.createConstructionSite(
                        this.cordToPos(pathSegment),
                        STRUCTURE_ROAD
                    );
                }
            );
        });
    }

    buildWalls() {

        const allowance = CONTROLLER_STRUCTURES[STRUCTURE_WALL][this.level];
        if (!allowance) {
            return;
        }

        roomEdges.forEach((edge) => {

            const walls = this._memory.walls[edge];

            if (!walls || walls == REQUESTED) {
                return;
            }

            walls.forEach((wall) => {

                wall = Path.fromJSON(wall);

                if (!wall.isPerpendicular()) {
                    throw new Error("wall is not perpendicular");
                }

                const wallSegments = wall.toSegments();

                wallSegments.forEach((wallSegment) => {
                    wallSegment = Cord.fromJSON(wallSegment);
                    this._logger.info(
                        `creating wall blueprint at : ${wallSegment.hash}`
                    );
                    this._room.createConstructionSite(
                        this.cordToPos(wallSegment),
                        STRUCTURE_WALL
                    );
                });
            });
        });
    }

    setPathSegments(pathHash, pathSegments) {
        this._memory.paths[pathHash] = pathSegments;
    }

    setEdgeObjects(objectType, edge, objects) {
        this._memory[objectType][edge] = objects;
    }

    drawText(x, y, style, text) {
        this._room.visual.text(text, x, y, style);
    }

    cordToPos(cord) {
        return new RoomPosition(cord.x, cord.y, this._room.name);
    }

    isPathRequested(path) {
        return this._memory.paths[path.hash] == REQUESTED;
    }

    isPathComputed(path) {
        return this._memory.paths[path.hash] != null;
    }

    requestPath(path) {
        return this._memory.paths[path.hash] = REQUESTED;
    }

    areExitsRequested(edge) {
        return this._memory.exits[edge] == REQUESTED;
    }

    areExitsComputed(edge) {
        return this._memory.exits[edge] != null;
    }

    requestExits(edge) {
        return this._memory.exits[edge] = REQUESTED;
    }

    areWallsRequested(edge) {
        return this._memory.walls[edge] == REQUESTED;
    }

    areWallsComputed(edge) {
        return this._memory.walls[edge] != null;
    }

    requestWalls(edge) {
        return this._memory.walls[edge] = REQUESTED;
    }

    get name() {
        return this._room.name;
    }

    get size() {
        return 50;
    }

    get level() {
        return this._room.controller.level;
    }

    _scheduleTasks() {
        this._taskScheduler.schedule();
    }

    _loadObjectsFromMemory() {

        if (!this._objects) {
            this._objects = {};
        }

        const objectIds = this._memory.objectIds;

        _.forOwn(objectIds, (ids, objectType) => {
            if (!ids) {
                objectIds[objectType] = [];
                this._objects[objectType] = [];
                return;
            }
            this._objects[objectType] =
                ids.map((id) => this._game.getObjectById(id));
        });
    }
};

