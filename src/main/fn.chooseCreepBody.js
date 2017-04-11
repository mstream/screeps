module.exports = (() => {


    const partTypes = require("./const.partTypes");
    const roleTypes = require("./const.roleTypes");


    return (role) => {

        switch (role) {
        case roleTypes.WORKER:
            return [
                partTypes.CARRY,
                partTypes.MOVE,
                partTypes.WORK
            ];
        default:
            throw new Error(`unknown role: ${role}`);
        }

    };

})();
