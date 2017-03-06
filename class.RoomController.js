const objectTypes = require("const.objectTypes");
const roles = require("const.roles");
const taskTypes = require("const.taskTypes");

const buildCreepsIfNeeded = require("func.buildCreepsIfNeeded");
const generateRoadPath = require("func.generateRoadPath");

const Cord = require("class.Cord");
const RoomLogger = require("class.RoomLogger");
const Path = require("class.Path");
const Task = require("class.Task");


const schedulingFrequencies = {
    [taskTypes.PATH_COMPUTING]: 100
};

const objectTypesToFindMappings = {
    SOURCE: FIND_SOURCES,
    CONSTRUCTION_SITE: FIND_CONSTRUCTION_SITES

};

const getIds = (objects) => objects.map((object) => object.id);

const roomSize = 50;


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

        this._roomMemory = memory.rooms[room.name];

        this._initializeMemory();
        this._loadObjectsFromMemory();
        this._scheduleTasks();
    }

    executeTasks() {
        const task = this._nextTask();

        if (!task) {
            return;
        }

        const time = this._game.time;

        const shouldExecute = time % task.cost == 0;

        if (!shouldExecute) {
            return;
        }

        if (task.type == taskTypes.PATH_COMPUTING) {
            const path = Path.fromJSON(task.options.path);
            const pathHash = path.hash;
            this._logger.info(`started path calculation: ${pathHash}`);
            const result = generateRoadPath(
                this._cordToPos(path.from),
                this._cordToPos(path.to)
            );
            if (result.incomplete) {
                this._logger.warn(
                    `could not finish path calculation: ${pathHash}`
                );
                return;
            }
            this._logger.info(`finished path calculation: ${pathHash}`);
            this._roomMemory.paths[pathHash] =
                _.map(result.path, pos => Cord.fromPos(pos));
            this._completeLastTask();
        }
    }

    buildCreeps() {

        const sorcesNumber = this.findObjects(objectTypes.SOURCE).length;

        buildCreepsIfNeeded(
            this._game,
            this.findObjects(objectTypes.SPAWN)[0],
            {
                [roles.HARVESTER]: sorcesNumber,
                [roles.UPGRADER]: sorcesNumber,
                [roles.BUILDER]: sorcesNumber
            }
        );
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
                this._roomMemory.objectIds[objectTypes.CONTROLLER] = getIds(controllers);
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
                this._roomMemory.objectIds[objectTypes.SPAWN] = getIds(spawns);
                return spawns;
            default:
                const objects = this._room.find(objectTypesToFindMappings[objectsType]);
                this._objects[objectsType] = objects;
                this._roomMemory.objectIds[objectsType] = getIds(objects);
                return objects;
        }
    }

    harvestersAssignedToSource(source) {
        const sourceId = source.id;
        const sourceMemory = this._roomMemory.objects[sourceId];
        if (!sourceMemory || !sourceMemory.harvesters) {
            return 0;
        }
        return sourceMemory.harvesters;
    }

    assignHarvesterTo(source) {
        const sourceId = source.id;
        if (!this._roomMemory.objects[sourceId]) {
            this._roomMemory.objects[sourceId] = {
                harvesters: 0
            }
        }
        this._roomMemory.objects[sourceId].harvesters++;
    }

    unassignHarvesterFrom(source) {
        const sourceId = source.id;
        const sourceMemory = this._roomMemory.objects[sourceId];
        if (!sourceMemory || !sourceMemory.harvesters) {
            throw new Error(
                `no harvester has ever being assign to source ${sourceId}`);
        }
        sourceMemory.harvesters--;
    }

    buildRoadBlueprints() {
        const paths = this._roomMemory.paths;

        if (!paths) {
            return;
        }

        _.forOwn(paths, (pathSegments) => {
            if (!pathSegments || !pathSegments.length) {
                return;
            }
            pathSegments.forEach((pathSegment) =>
                this._room.createConstructionSite(
                    this._cordToPos(pathSegment),
                    STRUCTURE_ROAD
                )
            );
        });
    }

    drawText(x, y, style, text) {
        this._room.visual.text(text, x, y, style);
    }

    _scheduleTasks() {
        this._requestExitsCalculation();
        _.forOwn(schedulingFrequencies, (frequency, taskType) => {
            const lastUpdate = this._roomMemory.lastUpdates[taskType];
            const gameTime = this._game.time;
            if (lastUpdate && gameTime - lastUpdate < frequency) {
                return;
            }
            this._logger.info(`scheduling tasks: ${taskType}`);
            if (taskType == taskTypes.PATH_COMPUTING) {
                this._requestPathsCalculation();
            }
            this._roomMemory.lastUpdates[taskType] = gameTime;
        });
    }

    _requestPathsCalculation() {
        this.findObjects(objectTypes.SOURCE).forEach((source) => {
            this.findObjects(objectTypes.SPAWN).forEach((spawn) => {
                this._requestPathCalculation(source, spawn)
            });
            this.findObjects(objectTypes.CONTROLLER).forEach((roomCtrl) => {
                this._requestPathCalculation(source, roomCtrl)
            });
        });
    }

    _requestPathCalculation(fromObj, toObj) {
        const path = new Path(
            Cord.fromPos(fromObj.pos),
            Cord.fromPos(toObj.pos)
        );
        const task = new Task(
            taskTypes.PATH_COMPUTING,
            {path}
        );
        if (this._isPathRequested(path)) {
            return;
        }
        this._requestPath(path);
        this._queueTask(task);
    }

    _requestExitsCalculation() {
        const exits = this._roomMemory.exits;

        if (exits.top && exits.right && exits.bottom && exits.left) {
            return;
        }

        this._calculateTopExit();
        this._calculateRightExit();
        this._calculateBottomExit();
        this._calculateLeftExit();
    }

    _calculateTopExit() {

        const terrain = this._room.lookForAtArea(
            LOOK_TERRAIN, 0, 0, 0, roomSize - 1
        );

        const exits = [];

        for (let x = 0, start = null, end = null; x < roomSize; x++) {

            const structures = terrain[0][x];
            const wall = structures && structures[0] == "wall";

            if (wall || x == roomSize - 1) {
                if (start != null) {
                    exits.push(new Path(
                        new Cord(start, 0),
                        new Cord(end, 0))
                    );
                    start = null;
                    end = null;
                }
                continue;
            }
            if (!start) {
                start = x;
            }
            end = x;
        }

        this._roomMemory.exits.top = exits;
    }

    _calculateRightExit() {

        const terrain = this._room.lookForAtArea(
            LOOK_TERRAIN, 0, roomSize - 1, roomSize - 1, roomSize - 1
        );

        const exits = [];

        for (let y = 0, start = null, end = null; y < roomSize; y++) {

            const structures = terrain[y][roomSize - 1];
            const wall = structures && structures[0] == "wall";

            if (wall || y == roomSize - 1) {
                if (start != null) {
                    exits.push(new Path(
                        new Cord(roomSize - 1, start),
                        new Cord(roomSize - 1, end))
                    );
                    start = null;
                    end = null;
                }
                continue;
            }
            if (!start) {
                start = y;
            }
            end = y;
        }

        this._roomMemory.exits.right = exits;
    }

    _calculateBottomExit() {

        const terrain = this._room.lookForAtArea(
            LOOK_TERRAIN, roomSize - 1, 0, roomSize - 1, roomSize - 1
        );

        const exits = [];

        for (let x = 0, start = null, end = null; x < roomSize; x++) {

            const structures = terrain[roomSize - 1][x];
            const wall = structures && structures[0] == "wall";

            if (wall || x == roomSize - 1) {
                if (start != null) {
                    exits.push(new Path(
                        new Cord(start, roomSize - 1),
                        new Cord(end, roomSize - 1))
                    );
                    start = null;
                    end = null;
                }
                continue;
            }
            if (!start) {
                start = x;
            }
            end = x;
        }

        this._roomMemory.exits.bottom = exits;
    }

    _calculateLeftExit() {

        const terrain = this._room.lookForAtArea(
            LOOK_TERRAIN, 0, 0, roomSize - 1, 0
        );

        const exits = [];

        for (let y = 0, start = null, end = null; y < roomSize; y++) {

            const structures = terrain[y][0];
            const wall = structures && structures[0] == "wall";

            if (wall || y == roomSize - 1) {
                if (start != null) {
                    exits.push(new Path(
                        new Cord(0, start),
                        new Cord(0, end))
                    );
                    start = null;
                    end = null;
                }
                continue;
            }
            if (!start) {
                start = y;
            }
            end = y;
        }

        this._roomMemory.exits.left = exits;
    }

    _initializeMemory() {
        if (!this._roomMemory.objectIds) {
            this._roomMemory.objectIds = {};
        }

        if (!this._roomMemory.objects) {
            this._roomMemory.objects = {};
        }

        if (!this._roomMemory.tasks) {
            this._roomMemory.tasks = [];
        }

        if (!this._roomMemory.paths) {
            this._roomMemory.paths = {};
        }

        if (!this._roomMemory.lastUpdates) {
            this._roomMemory.lastUpdates = {};
        }

        if (!this._roomMemory.exits) {
            this._roomMemory.exits = {
                top: null,
                right: null,
                bottom: null,
                left: null
            };
        }
    }

    _loadObjectsFromMemory() {

        if (!this._objects) {
            this._objects = {};
        }

        const objectIds = this._roomMemory.objectIds;

        _.forOwn(objectIds, (ids, objectType) => {
            if (!ids) {
                objectIds[objectType] = [];
                this._objects[objectType] = [];
                return;
            }
            this._objects[objectType] =
                ids.map((id) => this._game.getObjectById(id));
        });
    };

    _queueTask(task) {
        if (!this._roomMemory.tasks) {
            this._roomMemory.tasks = [task];
            return;
        }
        this._roomMemory.tasks.push(task);
    }

    _nextTask() {
        if (!this._roomMemory.tasks.length) {
            return;
        }
        return Task.fromJSON(this._roomMemory.tasks[0]);
    }

    _completeLastTask() {
        if (!this._roomMemory.tasks) {
            throw new Error("no queued tasks");
        }
        this._roomMemory.tasks.shift();
    }

    _isPathRequested(path) {
        return this._roomMemory.paths[path.hash];
    }

    _requestPath(path) {
        return this._roomMemory.paths[path.hash] = [];
    }

    _cordToPos(cord) {
        return new RoomPosition(cord.x, cord.y, this._room.name);
    }
};

