const objectTypes = require("const.objectTypes");
const roles = require("const.roles");

const buildCreepsIfNeeded = require("func.buildCreepsIfNeeded");
const generateRoadPath = require("func.generateRoadPath");


module.exports = class {

    constructor(room, memory) {

        this._room = room;

        if (!memory.rooms) {
            memory.rooms = {};
        }

        if (!memory.rooms[room.name]) {
            memory.rooms[room.name] = {};
        }

        this._roomMemory = memory.rooms[room.name];

        this._loadObjectsFromMemory();
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

        const serializedPaths = [];

        this._findObjects(objectTypes.SPAWN).forEach((spawn) => {
            this._findObjects(objectTypes.SOURCES).forEach((source) => {
                const result = generateRoadPath(spawn, source);
                if (result.incomplete) {
                    console.log("could not finish a path calculation");
                    return;
                }
                serializedPaths.push(result.path.map(pos =>
                    ({x: pos.x, y: pos.y})
                ));
            });
        });

        this._roomMemory.paths = serializedPaths;
    }

    buildRoadBlueprints() {

        const serializedPaths = this._roomMemory.paths;

        if (!serializedPaths || !serializedPaths.length) {
            throw new Error("no stored paths");
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

    _loadObjectsFromMemory() {

        if (!this._objects) {
            this._objects = {};
        }

        if (!this._roomMemory.objectIds) {
            this._roomMemory.objectIds = {};
            return;
        }

        const objectIds = this._roomMemory.objectIds;

        _.forOwn(objectIds, (ids, objectType) => {
            if (!ids) {
                objectIds[objectType] = [];
                this._objects[objectType] = [];
                return;
            }
            const objects = ids.map((id) => Game.getObjectById(id));
            this._objects[objectType] = objects;
        });
    };

    _findObjects(objectsType) {
        const objects = this._objects[objectsType];
        if (objects) {
            return objects;
        }
        if (objectsType == objectTypes.SPAWN) {
            const spawns = [];
            _.forOwn(Game.spawns, (spawn) => {
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


};


const getIds = (objects) => objects.map((object) => object.id);

