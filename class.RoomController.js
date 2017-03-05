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
        buildCreepsIfNeeded(
            this.findObjects(objectTypes.SPAWN)[0],
            new Map([
                [roles.BUILDER, 1],
                [roles.HARVESTER, 1],
                [roles.UPGRADER, 1]
            ])
        );
    }


    findObjects(objectsType) {
        const objects = this._objects[objectsType];
        if (objects) {
            return objects;
        }
        if (objectsType == objectTypes.ROOM_CONTROLLER) {
            return [this._room.controller];
        }
        if (objectsType == objectTypes.SPAWN) {
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
        }
        if (objectsType == objectTypes.SOURCE) {
            const sources = this._room.find(FIND_SOURCES);
            this._objects[objectsType] = sources;
            this._roomMemory.objectIds[objectTypes.SOURCE] = getIds(sources);
            return sources;
        }
    };

    _scheduleTasks() {
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
            this.findObjects(objectTypes.ROOM_CONTROLLER).forEach((roomCtrl) => {
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

    _initializeMemory() {
        if (!this._roomMemory.objectIds) {
            this._roomMemory.objectIds = {};
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

