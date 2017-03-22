const roles = require("./const.roles");


module.exports = (role) => {

    switch (role) {
    case roles.BUILDER:
    case roles.HARVESTER:
    case roles.UPGRADER:
    default:
        return [CARRY, MOVE, WORK];
    }
};