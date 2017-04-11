module.exports = (() => {


    const _ = require("lodash");

    const actionTypes = require("./const.actionTypes");
    const resultTypes = require("./const.resultTypes");
    const roleTypes = require("./const.roleTypes");

    const logger = require("./fn.createLogger")("fn.controlSpawn");


    return (ctx, spawn) => {

        const {chooseCreepBody, game, generateCreepName} = ctx;

        if (_.keys(game.creeps).length >= 4) {

            return;

        }

        const role = roleTypes.WORKER;

        const body = chooseCreepBody(role);
        const name = generateCreepName(game, role);

        if (spawn.canCreateCreep(body, name) !== resultTypes.OK) {

            return;

        }

        spawn.createCreep(body, name, {
            action: {type: actionTypes.IDLE},
            role
        });

        logger.info(
            ctx,
            `creating creep: ${name} with body ${JSON.stringify(body)}`,
            spawn.room
        );

    };

})();
