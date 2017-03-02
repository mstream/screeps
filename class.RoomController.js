const objectTypes = require("const.objectTypes");
const roles = require("const.roles");

const buildCreepsIfNeeded = require("func.buildCreepsIfNeeded");


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

