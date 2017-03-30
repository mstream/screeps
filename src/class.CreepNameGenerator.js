const _ = require("lodash");

const bodyPartTypes = require("./const.bodyPartTypes");
const roles = require("./const.roles");


module.exports = class {

    constructor({
        game = require("./game")
    } = {}) {

        if (!game) {
            throw new Error("game can't be null");
        }

        this._game = game;
    }

    generate(role, body) {

        if (!role) {
            throw new Error("role can't be null");
        }

        if (!_.includes(_.values(roles), role)) {
            throw new Error(`unknown role: ${role}`);
        }

        if (!body) {
            throw new Error("body can't be null");
        }

        const roleSegment = _.camelCase(role);

        const bodySegment = _.chain(body)
            .map(bodyPart => {
                if (!_.includes(_.values(bodyPartTypes), bodyPart)) {
                    throw new Error(`unknown bodyPart: ${bodyPart}`);
                }
                return bodyPart;
            })
            .map(bodyPart => bodyPart.substr(0, 2).toLowerCase())
            .countBy(bodyPartSymbol => bodyPartSymbol)
            .pairs()
            .sort((a, b) => {
                const quantityDifference = b[1] - a[1];
                if (!quantityDifference) {
                    const symbolsDifference = a[0].localeCompare(b[0]);
                    return symbolsDifference / Math.abs(symbolsDifference);
                }
                return quantityDifference / Math.abs(quantityDifference);
            })
            .map(pair => pair[1] + pair[0])
            .value()
            .join("");

        return [roleSegment, bodySegment, this._game.time].join("_");
    }
};

