const bodyPartTypes = require("./const.bodyPartTypes");
const roles = require("./const.roles");


class CreepBodyAssembler {

    createBody(role) {
        switch (role) {
        case roles.BUILDER:
        case roles.HARVESTER:
        case roles.UPGRADER:
            return [
                bodyPartTypes.CARRY,
                bodyPartTypes.MOVE,
                bodyPartTypes.WORK
            ];
        default:
            throw new Error(`unknown role: ${role}`);
        }
    }
}


module.exports = CreepBodyAssembler;
