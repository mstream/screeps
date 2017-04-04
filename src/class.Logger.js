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

    constructor({
        console = require("./console"),
        gameProvider = require("./gameProvider")
    } = {}) {

        if (!console) {
            throw new Error("console can't be null");
        }

        if (!gameProvider) {
            throw new Error("gameProvider can't be null");
        }

        this._console = console;
        this._gameProvider = gameProvider;
    }

    debug(message, room) {
        this._log(levels.DEBUG, message, room);
    }

    info(message, room) {
        this._log(levels.INFO, message, room);
    }

    warn(message, room) {
        this._log(levels.WARN, message, room);
    }

    error(message, room) {
        this._log(levels.ERROR, message, room);
    }

    _log(level, message, room) {
        const paddedTime = padEnd(this._gameProvider.get().time.toString(), 9);
        const paddedLevel = padEnd(level, 5);
        const paddedRoomName = room ? padEnd(room.name, 10) : "";

        this._console.log(`${paddedTime} ${paddedLevel} ${paddedRoomName} ${message}`);
    }
};

