const RoomController = require("./class.RoomController");


module.exports = class {

    createFor(room, game, memory) {

        if (!room) {
            throw new Error("room can't be null");
        }

        if (!game) {
            throw new Error("game can't be null");
        }

        if (!memory) {
            throw new Error("memory can't be null");
        }

        return new RoomController(room, game, memory);
    }
};

