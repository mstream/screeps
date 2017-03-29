const _ = require("lodash");

const operationResults = require("./const.operationResults");
const roles = require("./const.roles");


module.exports = class {

    constructor(spawn, game, creepBodyAssembler, creepNameGenerator, logger) {

        if (!spawn) {
            throw new Error("spawn can't be null");
        }

        if (!game) {
            throw new Error("game can't be null");
        }

        if (!creepBodyAssembler) {
            throw new Error("creepBodyAssembler can't be null");
        }

        if (!creepNameGenerator) {
            throw new Error("creepNameGenerator can't be null");
        }

        if (!logger) {
            throw new Error("logger can't be null");
        }

        this._spawn = spawn;
        this._game = game;
        this._creepBodyAssembler = creepBodyAssembler;
        this._creepNameGenerator = creepNameGenerator;
        this._logger = logger;
    }

    execute() {
        const sourcesNumber = _.chain(_.values(this._game.rooms))
            .map(room => room.sources)
            .flatten()
            .value().length;

        const creepsDemand = {
            [roles.HARVESTER]: sourcesNumber,
            [roles.UPGRADER]: sourcesNumber,
            [roles.BUILDER]: sourcesNumber
        };

        this._buildCreepsIfNeeded(creepsDemand);
    }

    _buildCreepsIfNeeded(demand) {

        const existingRolesCounter = {};

        _.forOwn(this._game.creeps, (creep) => {
            const role = creep.memory.role;
            const prevCount = existingRolesCounter[role];
            existingRolesCounter[role] = prevCount ? prevCount + 1 : 1;
        });

        const desiredRoles = {};

        _.forOwn(demand, (slotsCount, role) => {
            const existingCount = existingRolesCounter[role];
            let desiredCount = slotsCount;
            if (existingCount) {
                desiredCount -= existingCount;
            }
            if (desiredCount > 0) {
                desiredRoles[role] = desiredCount;
            }
        });

        _.forOwn(desiredRoles, (desiredCount, role) => {
            const creepBody = this._creepBodyAssembler.createBody(role);
            if (!this._spawn.canCreateCreep(creepBody) == operationResults.OK) {
                return;
            }
            const creepName = this._creepNameGenerator.generate(role, creepBody);
            this._logger.info(`creating creep: ${creepName}`);
            this._spawn.createCreep(creepBody, creepName, {role});
        });
    }
};

