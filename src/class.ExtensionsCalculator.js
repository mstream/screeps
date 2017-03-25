const _ = require("lodash");

const lookTypes = require("./const.lookTypes");

const Cord = require("./class.Cord");


const obstacleTypes = [
    lookTypes.CONSTRUCTION_SITE,
    lookTypes.STRUCTURE,
    lookTypes.SOURCE
];


module.exports = class {

    constructor(room) {

        if (!room) {
            throw new Error("room can't be null");
        }

        this._room = room;
        this._roomSize = room.size;
    }

    calculate(quantity) {
        const extensions = [];
        let radius = 2;
        while (radius < 10) {
            const offsets = this._offsetsWithinRadius(radius);
            _.forEach(offsets, (offset) => {
                _.forEach(this._room.sources, (source => {
                    if (extensions.length >= quantity) {
                        return;
                    }
                    if (this._canBuildAtOffset(source, offset.x, offset.y)) {
                        extensions.push(new Cord(
                            source.pos.x + offset.x,
                            source.pos.y + offset.y
                        ));
                    }
                }));
            });
            radius += 2;
        }
        return extensions;
    }

    _offsetsWithinRadius(radius) {
        const offsets = [];

        for (let x = -radius; x <= radius; x += 2) {
            offsets.push({x, y: -radius});
        }
        for (let y = -radius; y <= radius; y += 2) {
            offsets.push({x: radius, y});
        }
        for (let x = radius; x >= -radius; x -= 2) {
            offsets.push({x, y: radius});
        }
        for (let y = radius; y >= -radius; y -= 2) {
            offsets.push({x: -radius, y});
        }

        return offsets;
    }

    _canBuildAtOffset(source, dx, dy) {
        const sourceX = source.pos.x;
        const sourceY = source.pos.y;
        const x = sourceX + dx;
        const y = sourceY + dy;
        const objects = this._room.findObjectsAt(x, y);
        const obstacles = _.filter(objects, (object) =>
            _.includes(obstacleTypes, object.type) ||
            (object.type == lookTypes.TERRAIN && object.terrain == "wall")
        );
        return !obstacles.length;
    }
};

