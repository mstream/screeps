module.exports = (() => {


    const _ = require("lodash");

    const actionTypes = require("./const.actionTypes");
    const logger =
        require("./fn.createLogger")("fn.executeStructuresBuilding");
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

    const runOutOfEnergyDuringBuilding =
        (creep, currentActionType) =>
        currentActionType === actionTypes.BUILDING && !creep.carry.energy;

    const harvestedAllEnergyItCanCarry =
        (creep, currentActionType) =>
        currentActionType === actionTypes.HARVESTING &&
        creep.carry.energy === creep.carryCapacity;


    const shouldSwitchToHarvesting =
        (creep, currentActionType) =>
        isIdleWithLessThanHalfEnergy(creep, currentActionType) ||
        runOutOfEnergyDuringBuilding(creep, currentActionType);

    const shouldSwitchToBuilding =
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

    const buildStructures = _.curry(doActionOnTarget)(_, _, "build");
    const harvestSource = _.curry(doActionOnTarget)(_, _, "harvest");


    return (ctx, constructionSite, creep, source) => {

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

        if (shouldSwitchToBuilding(creep, previousActionType)) {

            setCurrentAction(
                ctx, creep, constructionSite.id, actionTypes.BUILDING
            );
            logger.debug(
                ctx,
                `${creep.name} is switching to building`,
                creep.room
            );

        }

        const currentActionType = getCurrentAction(ctx, creep).type;

        if (currentActionType === actionTypes.HARVESTING) {

            harvestSource(creep, source);

        }

        if (currentActionType === actionTypes.BUILDING) {

            buildStructures(creep, constructionSite);

        }

        return switchedToHarvesting;

    };

})();
