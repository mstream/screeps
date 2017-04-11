module.exports = (() => {


    const _ = require("lodash");

    const actionTypes = require("./const.actionTypes");
    const logger =
        require("./fn.createLogger")("fn.executeEnergyCollecting");
    const resourceTypes = require("./const.resourceTypes");
    const resultTypes = require("./const.resultTypes");


    const getCurrentAction =
        (ctx, creep) => ctx.memory.creeps[creep.name].action;

    const setCurrentAction =
        (ctx, creep, targetId, type) => {

            ctx.memory.creeps[creep.name].action = {
                targetId,
                type
            };

        };

    const isIdleWithLessThanHalfEnergy =
        (creep, currentActionType) =>
        currentActionType === actionTypes.IDLE &&
        creep.carry.energy < creep.carryCapacity / 2;

    const isIdleWithAtLeastHalfEnergy =
        (creep, currentActionType) =>
        currentActionType === actionTypes.IDLE &&
        creep.carry.energy >= creep.carryCapacity / 2;

    const runOutOfEnergyDuringStoring =
        (creep, currentActionType) =>
        currentActionType === actionTypes.STORING && !creep.carry.energy;

    const harvestedAllEnergyItCanCarry =
        (creep, currentActionType) =>
        currentActionType === actionTypes.HARVESTING &&
        creep.carry.energy === creep.carryCapacity;

    const shouldSwitchToHarvesting =
        (creep, currentActionType) =>
        isIdleWithLessThanHalfEnergy(creep, currentActionType) ||
        runOutOfEnergyDuringStoring(creep, currentActionType);

    const shouldSwitchToStoring =
        (creep, currentActionType) =>
        isIdleWithAtLeastHalfEnergy(creep, currentActionType) ||
        harvestedAllEnergyItCanCarry(creep, currentActionType);

    const doActionOnTarget = (creep, target, action, actionArg) => {

        const actionResult = actionArg
            ? creep[action](target, actionArg)
            : creep[action](target);

        if (actionResult === resultTypes.ERR_NOT_IN_RANGE) {

            creep.moveTo(
                target,
                {visualizePathStyle: {stroke: "#ffffff"}}
            );

        }

    };

    const storeEnergy = _.curry(doActionOnTarget)(
        _, _, "transfer", resourceTypes.ENERGY
    );

    const harvestSource = _.curry(doActionOnTarget)(_, _, "harvest", null);


    return (ctx, storage, creep, source) => {

        const previousActionType = getCurrentAction(ctx, creep).type;

        let switchedToHarvesting = false;

        if (shouldSwitchToHarvesting(creep, previousActionType)) {

            switchedToHarvesting = true;
            setCurrentAction(ctx, creep, source.id, actionTypes.HARVESTING);
            logger.debug(
                ctx,
                `${creep.name} is switching to harvesting`,
                creep.room
            );

        }

        if (shouldSwitchToStoring(creep, previousActionType)) {

            setCurrentAction(ctx, creep, storage.id, actionTypes.STORING);
            logger.debug(
                ctx,
                `${creep.name} is switching to storing`,
                creep.room
            );

        }

        const currentActionType = getCurrentAction(ctx, creep).type;

        if (currentActionType === actionTypes.HARVESTING) {

            harvestSource(creep, source);

        }

        if (currentActionType === actionTypes.STORING) {

            storeEnergy(creep, storage);

        }

        return switchedToHarvesting;

    };

})();
