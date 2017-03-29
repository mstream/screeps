const _ = require("lodash");

const structureAllowance = require("./const.structureAllowance");
const structureTypes = require("./const.structureTypes");

const CreepBodyAssembler = require("./class.CreepBodyAssembler");
const CreepNameGenerator = require("./class.CreepNameGenerator");
const ExtensionsBuilder = require("./class.ExtensionsBuilder");
const RoomLogger = require("./class.RoomLogger");
const RoadsBuilder = require("./class.RoadsBuilder");
const SpawnController = require("./class.SpawnController");
const TaskExecutor = require("./class.TaskExecutor");
const TaskScheduler = require("./class.TaskScheduler");
const WallsBuilder = require("./class.WallsBuilder");


const REQUESTED = "requested";


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
        this._logger = new RoomLogger(console, room, game);
        this._objectsByType = {};

        if (!memory.rooms) {
            memory.rooms = {};
        }

        if (!memory.rooms[room.name]) {
            memory.rooms[room.name] = {};
        }

        this._memory = memory.rooms[room.name];
    }

    execute() {
        this._initializeMemory();
        this._createScheduler();
        this._scheduleTasks();
        this._delegateWorkToSpawns();
        this._executeTasks();
    }

    _initializeMemory() {
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

        if (!this._memory.extensions) {
            this._memory.extensions = {};
        }
    }

    _createScheduler() {
        this._taskScheduler = new TaskScheduler(
            this._game.time, this, this._memory, this._logger
        );
    }

    _executeTasks() {
        const taskExecutor = new TaskExecutor(
            this._taskScheduler, this._game.time, this, this._logger
        );
        taskExecutor.execute();
    }

    findObjectsAt(x, y) {
        return this._room.lookAt(x, y);
    }

    findObjectsInArea(type, top, left, bottom, right) {
        return this._room.lookForAtArea(type, top, left, bottom, right);
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
            };
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

    buildExtensions() {
        const extensions = this._memory.extensions;
        if (!extensions || !extensions.length) {
            return;
        }
        new ExtensionsBuilder(this, this._logger, structureAllowance).build(extensions);
    }

    buildRoads() {
        const paths = _.values(this._memory.paths);
        if (!paths || !paths.length) {
            return;
        }
        new RoadsBuilder(this, this._logger, structureAllowance).build(paths);
    }

    buildWalls() {
        const walls = _.flatten(_.values(this._memory.walls));
        if (!walls || !walls.length) {
            return;
        }
        new WallsBuilder(this, this._logger, structureAllowance).build(walls);
    }

    buildExtension(cord) {
        this._build(structureTypes.EXTENSION, cord);
    }

    buildRoad(cord) {
        this._build(structureTypes.ROAD, cord);
    }

    buildWall(cord) {
        this._build(structureTypes.WALL, cord);
    }

    setExtensions(extensions) {
        this._memory.extensions = extensions;
    }

    setPathSegments(pathHash, pathSegments) {
        this._memory.paths[pathHash] = pathSegments;
    }

    setEdgeObjects(objectType, edge, objects) {
        this._memory[objectType][edge] = objects;
    }

    drawCircle(x, y, style) {
        this._room.visual.circle(x, y, style);
    }

    drawRectangle(x, y, w, h, style) {
        this._room.visual.rect(x, y, w, h, style);
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

    get controller() {
        return this._room.controller;
    }

    get sources() {
        return this._findObjects(FIND_SOURCES);
    }

    get spawns() {
        return this._findObjects(FIND_MY_SPAWNS);
    }

    get constructionSites() {
        return this._findObjects(FIND_CONSTRUCTION_SITES);
    }

    _scheduleTasks() {
        this._taskScheduler.schedule();
    }

    _delegateWorkToSpawns() {

        const creepBodyAssembler = new CreepBodyAssembler();
        const creepNameGenerator = new CreepNameGenerator(this._game.time);

        _.forEach(this.spawns, (spawn) => {
            const spawnController = new SpawnController(
                spawn,
                this._game,
                creepBodyAssembler,
                creepNameGenerator,
                this._logger
            );
            spawnController.execute();
        });
    }

    _findObjects(searchType) {

        const cachedObjects = this._objectsByType[searchType];

        if (cachedObjects) {
            return cachedObjects;
        }

        const objects = this._room.find(searchType);
        this._objectsByType[searchType] = objects;
        return objects;
    }

    _build(structureType, cord) {
        this._room.createConstructionSite(
            this.cordToPos(cord),
            structureType
        );
    }
};


