const _ = require("lodash");


class Action {

    static get types() {
        return {
            BUILDING: "building",
            HARVESTING: "harvesting",
            IDLE: "idle",
            TRANSFERRING: "transferring",
            UPGRADING: "upgrading"
        };
    }

    static idle() {
        return new Action({
            type: Action.types.IDLE,
            targetId: null
        });
    }

    constructor({
        type,
        targetId
    } = {}) {

        if (!type) {
            throw new Error("type can't be null");
        }

        if (!_.include(_.values(Action.types), type)) {
            throw new Error("unknown action type: " + type);
        }

        if (type != Action.types.IDLE) {

            if (!targetId) {
                throw new Error("targetId can't be null");
            }

            if (typeof targetId != "string") {
                throw new Error("targetId should be a string");
            }
        }

        this._type = type;
        this._targetId = targetId;
    }

    toJSON() {
        return {
            type: this.type,
            targetId: this.targetId
        };
    }

    get type() {
        return this._type;
    }

    get targetId() {
        return this._targetId;
    }
}


module.exports = Action;

