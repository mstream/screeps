const Cord = require("class.Cord");


module.exports = class {

    constructor(room) {

        if (!room) {
            throw new Error("room can't be null");
        }

        this._room = room;
        this._roomSize = room.size;
    }

    callculate(quantity) {
        const extensions = [];
        let radius = 2;
        while (radius < 10) {
            for (let x = -radius; x <= radius; x++) {
                extensions.push(...this._calculateForSourcesForOffset(x, -radius));
            }
            for (let y = -radius; y <= radius; y++) {
                extensions.push(...this._calculateForSourcesForOffset(radius, y));
            }
            for (let x = radius; x >= -radius; x++) {
                extensions.push(...this._calculateForSourcesForOffset(x, radius));
            }
            for (let y = radius; y >= -radius; y++) {
                extensions.push(...this._calculateForSourcesForOffset(-radius, y));
            }
            if (extensions.length > quantity) {
                break;
            }
            radius += 2;
        }
        return extensions;
    }

    _calculateForSourcesForOffset(dx, dy) {
        const extensions = [];
        _.forEach(this._room.sources, (source) => {
            const sourceX = source.pos.x;
            const sourceY = source.pos.y;
            const x = sourceX + dx;
            const y = sourceY + dy;
            const objects = this._room.findObjectsAt(x, y);
            let structureExists = false;
            _.forOwn(objects, (object, objectType) => {
                if (objectType == LOOK_STRUCTURES) {
                    structureExists = true;
                }
            });
            if (structureExists) {
                return;
            }
            extensions.push(new Cord(x, y));
        });

        return extensions;
    }
};

