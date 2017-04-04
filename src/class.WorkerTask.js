const _ = require("lodash");


class WorkerTask {

    static get types() {
        return {
            UPGRADING: "upgrading"
        };
    }

    constructor(type, sourceId, targetId) {

        if (!type) {
            throw new Error("type can't be null");
        }

        if (!_.include(_.values(WorkerTask.types), type)) {
            throw new Error(`unknown task type: ${type}`);
        }

        if (!sourceId) {
            throw new Error("sourceId can't be null");
        }

        if (!targetId) {
            throw new Error("targetId can't be null");
        }

        this._type = type;
        this._sourceId = sourceId;
        this._targetId = targetId;
    }

    toJSON() {
        return {
            hash: this.hash,
            type: this._type,
            sourceId: this._sourceId,
            targetId: this._targetId
        };
    }

    get type() {
        return this._type
    }

    get sourceId() {
        return this._sourceId
    }

    get targetId() {
        return this._targetId
    }

    get hash() {
        return `${this._type}_${this._targetId}_using_${this._sourceId}`;
    }
}


module.exports = WorkerTask;

