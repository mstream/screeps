const objectTypes = require("const.objectTypes");
const roles = require("const.roles");
const taskTypes = require("const.taskTypes");

const buildCreepsIfNeeded = require("func.buildCreepsIfNeeded");
const generateRoadPath = require("func.generateRoadPath");

const Cord = require("class.Cord");
const Path = require("class.Path");
const Task = require("class.Task");


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

        if (!memory.rooms) {
            memory.rooms = {};
        }

        if (!memory.rooms[room.name]) {
            memory.rooms[room.name] = {};
        }

        this._roomMemory = memory.rooms[room.name];

        this._initializeMemory();
        this._loadObjectsFromMemory();
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
            const result = generateRoadPath(
                this._cordToPos(path.from),
                this._cordToPos(path.to)
            );
            if (result.incomplete) {
                console.log("could not finish a path calculation");
                return;
            }
            this._roomMemory.paths[path.hash] =
                _.map(result.path, pos => Cord.fromPos(pos));
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

    requestPathsCalculation() {
        this._findObjects(objectTypes.SPAWN).forEach((spawn) => {
            this._findObjects(objectTypes.SOURCE).forEach((source) => {
                const path = new Path(
                    Cord.fromPos(spawn.pos),
                    Cord.fromPos(source.pos)
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
            });
        });
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
        if (objectsType == objectTypes.SOURCE) {
            const sources = this._room.find(FIND_SOURCES);
            this._objects[objectsType] = sources;
            this._roomMemory.objectIds[objectTypes.SOURCE] = getIds(sources);
            return sources;
        }
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

