const expect = require("chai").expect;
const sinon = require("sinon");

const SpawnController = require("../src/class.SpawnController");

const bodyPartTypes = require("../src/const.bodyPartTypes");
const operationResults = require("../src/const.operationResults");
const roles = require("../src/const.roles");


const stubSpawn = (canCreateCreep) => ({
    canCreateCreep: () => canCreateCreep,
    createCreep: () => undefined
});

const stubGame = (time = 0, rooms = {}, creeps) => ({time, rooms, creeps});

const stubCreepBodyAssembler = (body) => ({
    createBody: () => body
});

const stubCreepBodyNameGenerator = (name) => ({
    generate: () => name
});

const stubLogger = () => ({
    debug: () => undefined,
    info: () => undefined,
    warn: () => undefined,
    alert: () => undefined
});

const stubCreep = (role) => ({memory: {role}});


describe("SpawnController", () => {

    describe("constructor", () => {

        it("throws exception during spawnController creation when spawn is null", () => {
            expect(() => new SpawnController(
                null,
                stubGame(),
                stubCreepBodyAssembler(),
                stubCreepBodyNameGenerator(),
                stubLogger()
            )).to.throw("spawn can't be null");
        });

        it("throws exception during spawnController creation when spawn is undefined", () => {
            expect(() => new SpawnController(
                undefined,
                stubGame(),
                stubCreepBodyAssembler(),
                stubCreepBodyNameGenerator(),
                stubLogger()
            )).to.throw("spawn can't be null");
        });

        it("throws exception during spawnController creation when game is null", () => {
            expect(() => new SpawnController(
                stubSpawn(),
                null,
                stubCreepBodyAssembler(),
                stubCreepBodyNameGenerator(),
                stubLogger()
            )).to.throw("game can't be null");
        });

        it("throws exception during spawnController creation when game is undefined", () => {
            expect(() => new SpawnController(
                stubSpawn(),
                undefined,
                stubCreepBodyAssembler(),
                stubCreepBodyNameGenerator(),
                stubLogger()
            )).to.throw("game can't be null");
        });

        it("throws exception during spawnController creation when creepBodyAssembler is null", () => {
            expect(() => new SpawnController(
                stubSpawn(),
                stubGame(),
                null,
                stubCreepBodyNameGenerator(),
                stubLogger()
            )).to.throw("creepBodyAssembler can't be null");
        });

        it("throws exception during spawnController creation when creepBodyAssembler is undefined", () => {
            expect(() => new SpawnController(
                stubSpawn(),
                stubGame(),
                undefined,
                stubCreepBodyNameGenerator(),
                stubLogger()
            )).to.throw("creepBodyAssembler can't be null");
        });

        it("throws exception during spawnController creation when creepNameGenerator is null", () => {
            expect(() => new SpawnController(
                stubSpawn(),
                stubGame(),
                stubCreepBodyAssembler(),
                null,
                stubLogger()
            )).to.throw("creepNameGenerator can't be null");
        });

        it("throws exception during spawnController creation when creepNameGenerator is undefined", () => {
            expect(() => new SpawnController(
                stubSpawn(),
                stubGame(),
                stubCreepBodyAssembler,
                undefined,
                stubLogger()
            )).to.throw("creepNameGenerator can't be null");
        });

        it("throws exception during spawnController creation when logger is null", () => {
            expect(() => new SpawnController(
                stubSpawn(),
                stubGame(),
                stubCreepBodyAssembler(),
                stubCreepBodyNameGenerator(),
                null
            )).to.throw("logger can't be null");
        });

        it("throws exception during spawnController creation when logger is undefined", () => {
            expect(() => new SpawnController(
                stubSpawn(),
                stubGame(),
                stubCreepBodyAssembler(),
                stubCreepBodyNameGenerator(),
                undefined
            )).to.throw("logger can't be null");
        });
    });

    describe("#execute", () => {

        it("creates a demanded creep type", () => {

            const spawn = stubSpawn(operationResults.OK);
            const createCreepSpy = sinon.spy(spawn, "createCreep");

            const creepBodyAssembler = stubCreepBodyAssembler(
                [bodyPartTypes.CARRY, bodyPartTypes.MOVE, bodyPartTypes.WORK]
            );
            const createBodySpy = sinon.spy(creepBodyAssembler, "createBody");

            const creepNameGenerator = stubCreepBodyNameGenerator("creepName");
            const generateSpy = sinon.spy(creepNameGenerator, "generate");

            const game = stubGame(
                123,
                {
                    "room1": {
                        sources: [{}, {}]
                    },
                    "room2": {
                        sources: [{}]
                    }
                },
                {
                    "creep1": stubCreep(roles.BUILDER),
                    "creep2": stubCreep(roles.BUILDER),
                    "creep3": stubCreep(roles.BUILDER),
                    "creep4": stubCreep(roles.HARVESTER),
                    "creep5": stubCreep(roles.HARVESTER),
                    "creep6": stubCreep(roles.HARVESTER),
                    "creep7": stubCreep(roles.UPGRADER),
                    "creep8": stubCreep(roles.UPGRADER)
                }
            );

            const logger = stubLogger();

            const spawnController = new SpawnController(
                spawn, game, creepBodyAssembler, creepNameGenerator, logger
            );

            spawnController.execute();

            expect(createBodySpy.callCount).to.equal(1);
            expect(generateSpy.callCount).to.equal(1);
            expect(createCreepSpy.callCount).to.equal(1);

            expect(createBodySpy.calledWith(roles.UPGRADER)).to.be.true;

            expect(generateSpy.calledWith(
                roles.UPGRADER,
                [bodyPartTypes.CARRY, bodyPartTypes.MOVE, bodyPartTypes.WORK]
            )).to.be.true;

            expect(createCreepSpy.calledWith(
                [bodyPartTypes.CARRY, bodyPartTypes.MOVE, bodyPartTypes.WORK],
                "creepName",
                sinon.match({role: roles.UPGRADER})
            )).to.be.true;
        });

        it("does not generate name or try create creep when not enough energy", () => {

            const spawn = stubSpawn(operationResults.ERR_NOT_ENOUGH_ENERGY);
            const createCreepSpy = sinon.spy(spawn, "createCreep");

            const creepBodyAssembler = stubCreepBodyAssembler(
                [bodyPartTypes.CARRY, bodyPartTypes.MOVE, bodyPartTypes.WORK]
            );
            const createBodySpy = sinon.spy(creepBodyAssembler, "createBody");

            const creepNameGenerator = stubCreepBodyNameGenerator("creepName");
            const generateSpy = sinon.spy(creepNameGenerator, "generate");

            const game = stubGame(
                123,
                {
                    "room1": {
                        sources: [{}, {}]
                    },
                    "room2": {
                        sources: [{}]
                    }
                },
                {
                    "creep1": stubCreep(roles.BUILDER),
                    "creep2": stubCreep(roles.BUILDER),
                    "creep3": stubCreep(roles.BUILDER),
                    "creep4": stubCreep(roles.HARVESTER),
                    "creep5": stubCreep(roles.HARVESTER),
                    "creep6": stubCreep(roles.HARVESTER),
                    "creep7": stubCreep(roles.UPGRADER),
                    "creep8": stubCreep(roles.UPGRADER)
                }
            );

            const logger = stubLogger();

            const spawnController = new SpawnController(
                spawn, game, creepBodyAssembler, creepNameGenerator, logger
            );

            spawnController.execute();

            expect(createBodySpy.callCount).to.equal(1);
            expect(generateSpy.callCount).to.equal(0);
            expect(createCreepSpy.callCount).to.equal(0);

            expect(createBodySpy.calledWith(roles.UPGRADER)).to.be.true;
        });
    });
});



