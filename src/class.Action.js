const actionTypes = require("./const.actionTypes");


class Action {

    static fromJSON({type, targetId}) {
        return new Action(type, targetId);
    }

    static idle() {
        return new Action(actionTypes.IDLE, null);
    }

    constructor(type, targetId) {

        if (!type) {
            throw new Error("type can't be null");
        }

        if (!actionTypes[type]) {
            throw new Error("unknown action type: " + type);
        }

        if (type != actionTypes.IDLE) {

            if (!targetId) {
                throw new Error("targetId can't be null");
            }

            if (typeof targetId != "string") {
                throw new Error("targetId should be a string");
            }
        }

        this.type = type;
        this.targetId = targetId;
    }

    toJSON() {
        return {type: this.type, targetId: this.targetId};
    }
}


module.exports = Action;

