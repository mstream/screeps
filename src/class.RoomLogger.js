const levels = {
    DEBUG: "DEBUG",
    ERROR: "ERROR",
    INFO: "INFO",
    WARN: "WARN"
};


const padEnd = (text, paddingLength) => {
    const padding = " ".repeat(Math.max(0, paddingLength - text.length));
    return `${text}${padding}`;
};


module.exports = class {

    constructor(console, room, game) {

        if (!console) {
            throw new Error("console can't be null");
        }

        if (!room) {
            throw new Error("room can't be null");
        }

        if (!game) {
            throw new Error("game can't be null");
        }

        this._console = console;
        this._room = room;
        this._game = game;
    }

    debug(message) {
        this._log(levels.DEBUG, message);
    }

    info(message) {
        this._log(levels.INFO, message);
    }

    warn(message) {
        this._log(levels.WARN, message);
    }

    error(message) {
        this._log(levels.ERROR, message);
    }

    _log(level, message) {
        const paddedTime = padEnd(this._game.time.toString(), 9);
        const paddedLevel = padEnd(level, 5);
        const paddedRoomName = padEnd(this._room.name, 10);

        this._console.log(`${paddedTime} ${paddedLevel} ${paddedRoomName} ${message}`);
    }
};

