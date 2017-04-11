module.exports = (() => {


    const _ = require("lodash");

    const roleTypes = require("./const.roleTypes");


    return (game, role) => {

        if (!_.has(_.invert(roleTypes), role)) {

            throw new Error(`unknown role: ${role}`);

        }

        return `${role}_${game.time}`;

    };

})();
