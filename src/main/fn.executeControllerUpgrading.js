module.exports = (() => {


    const _ = require("lodash");

    const actionTypes = require("./const.actionTypes");
    const logger =
        require("./fn.createLogger")("fn.executeControllerUpgrading");
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

    const runOutOfEnergyDuringUpgrading =
        (creep, currentActionType) =>
        currentActionType === actionTypes.UPGRADING && !creep.carry.energy;

    const harvestedAllEnergyItCanCarry =
        (creep, currentActionType) =>
        currentActionType === actionTypes.HARVESTING &&
        creep.carry.energy === creep.carryCapacity;

    const shouldSwitchToHarvesting =
        (creep, currentActionType) =>
        isIdleWithLessThanHalfEnergy(creep, currentActionType) ||
        runOutOfEnergyDuringUpgrading(creep, currentActionType);

    const shouldSwitchToUpgrading =
        (creep, currentActionType) =>
        isIdleWithAtLeastHalfEnergy(creep, currentActionType) ||
        harvestedAllEnergyItCanCarry(creep, currentActionType);

    const doActionOnTarget = (creep, target, action) => {

        if (creep[action](target) === resultTypes.ERR_NOT_IN_RANGE) {

            creep.moveTo(
                target,
                {visualizePathStyle: {stroke: "#ffffff"}}
            );

        }

    };

    const upgradeController =
        _.curry(doActionOnTarget)(_, _, "upgradeController");

    const harvestSource = _.curry(doActionOnTarget)(_, _, "harvest");

    return (ctx, controller, creep, source) => {

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

        if (shouldSwitchToUpgrading(creep, previousActionType)) {

            setCurrentAction(ctx, creep, controller.id, actionTypes.UPGRADING);
            logger.debug(
                ctx,
                `${creep.name} is switching to upgrading`,
                creep.room
            );

        }

        const currentActionType = getCurrentAction(ctx, creep).type;

        if (currentActionType === actionTypes.HARVESTING) {

            harvestSource(creep, source);

        }

        if (currentActionType === actionTypes.UPGRADING) {

            upgradeController(creep, controller);

        }

        return switchedToHarvesting;

    };

})();
