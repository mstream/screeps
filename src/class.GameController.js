const _ = require("lodash");


module.exports = class {

    constructor(game, memory, roomControllerFactory, creepControllerFactory) {

        if (!game) {
            throw new Error("game can't be null");
        }

        if (!memory) {
            throw new Error("memory can't be null");
        }

        if (!roomControllerFactory) {
            throw new Error("roomControllerFactory can't be null");
        }

        if (!creepControllerFactory) {
            throw new Error("creepControllerFactory can't be null");
        }

        this._game = game;
        this._memory = memory;
        this._creepControllerFactory = creepControllerFactory;

        this._rooms = _.mapValues(game.rooms, (room) =>
            roomControllerFactory.createFor(room, game, memory)
        );
    }

    execute() {

        _.forEach(this._rooms, (room) => {

            room.execute();

            _.forOwn(this._game.creeps, (creep) => {

                if (room.name != creep.room.name) {
                    return;
                }

                const creepController = this._creepControllerFactory.createFor(creep, room);
                creepController.execute();
            });
        });
    }

    get rooms() {
        return this._rooms;
    }

    get time() {
        return this._game.time;
    }
};

