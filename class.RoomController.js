const objectTypes = require("const.objectTypes");
const roles = require("const.roles");
const taskTypes = require("const.taskTypes");

const buildCreepsIfNeeded = require("func.buildCreepsIfNeeded");
const generateRoadPath = require("func.generateRoadPath");

const Task = require("class.Task");


const getIds = (objects) => objects.map((object) => object.id);
const posToCord = (pos) => ({x: pos.x, y: pos.y});


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

        if (!memory.rooms) {
            memory.rooms = {};
        }

        if (!memory.rooms[room.name]) {
            memory.rooms[room.name] = {};
        }

        this._roomMemory = memory.rooms[room.name];

        this._initializeMemory();
        this._loadObjectsFromMemory();
        this._loadTaskHashesFromMemory();
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
            const options = task.options;
            const result = generateRoadPath(
                this._cordToPos(options.from),
                this._cordToPos(options.to)
            );
            if (result.incomplete) {
                console.log("could not finish a path calculation");
                return;
            }
            const path = _.map(result.path, pos => posToCord(pos));
            this._roomMemory.paths.push(path);
            this._completeLastTask();
        }
    }

    buildCreeps() {
        buildCreepsIfNeeded(
            this._findObjects(objectTypes.SPAWN)[0],
            new Map([
                [roles.BUILDER, 1],
                [roles.HARVESTER, 1],
                [roles.UPGRADER, 1]
            ])
        );
    }

    calculatePaths() {
        this._findObjects(objectTypes.SPAWN).forEach((spawn) => {
            this._findObjects(objectTypes.SOURCES).forEach((source) => {
                const task = new Task({
                    type: taskTypes.PATH_COMPUTING,
                    options: {
                        from: posToCord(spawn.pos),
                        to: posToCord(source.pos)
                    }
                });
                if (this._taskExists(task)) {
                    return;
                }
                this._queueTask(task);
            });
        });
    }

    buildRoadBlueprints() {
        const serializedPaths = this._roomMemory.paths;

        if (!serializedPaths || !serializedPaths.length) {
            return;
        }

        serializedPaths.forEach((serializedPath) => {
            const path = serializedPath.map((cord) =>
                new RoomPosition(cord.x, cord.y, this._room.name)
            );
            path.forEach((pos) =>
                this._room.createConstructionSite(pos, STRUCTURE_ROAD)
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
            this._roomMemory.paths = [];
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
            const objects = ids.map((id) => this._game.getObjectById(id));
            this._objects[objectType] = objects;
        });
    };

    _loadTaskHashesFromMemory() {
        this._taskHashes = new Map(this._roomMemory.tasks);
    }

    _findObjects(objectsType) {
        const objects = this._objects[objectsType];
        if (objects) {
            return objects;
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
        if (objectsType == objectTypes.SOURCES) {
            const sources = this._room.find(FIND_SOURCES);
            this._objects[objectsType] = sources;
            this._roomMemory.objectIds[objectTypes.SOURCES] = getIds(sources);
            return sources;
        }
    };

    _queueTask(task) {
        const hashAndTask = [task.hash, task.toJSON()];
        if (!this._roomMemory.tasks) {
            this._roomMemory.tasks = [hashAndTask];
            return;
        }
        this._roomMemory.tasks.push(hashAndTask);
    }

    _nextTask() {
        if (!this._roomMemory.tasks.length) {
            return;
        }
        return new Task(this._roomMemory.tasks[0][1]);
    }

    _completeLastTask() {
        if (!this._roomMemory.tasks) {
            throw new Error("no queued tasks");
        }
        this._roomMemory.tasks.shift();
    }

    _taskExists(task) {
        return this._taskHashes.has(task.hash);
    }

    _cordToPos(cord) {
        return new RoomPosition(cord.x, cord.y, this._room.name);
    }
};

