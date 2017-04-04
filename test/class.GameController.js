const expect = require("chai").expect;
const sinon = require("sinon");

const GameController = require("../src/class.GameController");

const roles = require("../src/const.roles");
const WorkerTask = require("../src/class.WorkerTask");


const stubGame = (time = 0, rooms = {}, creeps = {}) => ({time, rooms, creeps});

const stubMemory = () => ({});

const stubRoomControllerFactory = (executeSpies = [],
                                   creepTasks = [],
                                   creepTaskAssignments = []) => {
    let spyIdx = 0;
    return {
        createFor: (room) => {
            const idx = spyIdx++;
            return {
                name: room.name,
                execute: executeSpies[idx],
                creepTasks: creepTasks[idx],
                creepTaskAssignments: creepTaskAssignments[idx]
            };
        }
    };
};

const stubCreepControllerFactory = (executeSpies = []) => {
    let spyIdx = 0;
    return {
        createFor: () => ({
            execute: executeSpies[spyIdx++]
        })
    };
};

const stubRoom = (name) => ({name});


describe("GameController", () => {

    describe("constructor", () => {

        it("throws exception during gameController.js creation when gameProvider is null", () => {
            expect(() => new GameController({
                gameProvider: null,
                memory: stubMemory(),
                roomControllerFactory: stubRoomControllerFactory(),
                creepControllerFactory: stubCreepControllerFactory()
            })).to.throw("gameProvider can't be null");
        });

        it("throws exception during gameController.js creation when memory is null", () => {
            expect(() => new GameController({
                gameProvider: stubGame(),
                memory: null,
                roomControllerFactory: stubRoomControllerFactory(),
                creepControllerFactory: stubCreepControllerFactory()
            })).to.throw("memory can't be null");
        });

        it("throws exception during gameController.js creation when roomControllerFactory is null", () => {
            expect(() => new GameController({
                gameProvider: stubGame(),
                memory: stubMemory(),
                roomControllerFactory: null,
                creepControllerFactory: stubCreepControllerFactory()
            })).to.throw("roomControllerFactory can't be null");
        });

        it("throws exception during gameController.js creation when creepControllerFactory is null", () => {
            expect(() => new GameController({
                gameProvider: stubGame(),
                memory: stubMemory(),
                roomControllerFactory: stubRoomControllerFactory(),
                creepControllerFactory: null
            })).to.throw("creepControllerFactory can't be null");
        });
    });

    describe("#execute", () => {

        it("creates controllers for every room and creep and executes them", () => {

            const room1 = stubRoom("room1");
            const room2 = stubRoom("room2");

            const gameProvider = stubGame(
                123,
                {room1, room2},
                {
                    "creep1": {room: room1},
                    "creep2": {room: room1},
                    "creep3": {room: room2}
                }
            );
            const memory = stubMemory();
            const roomExecuteSpies = [sinon.spy(), sinon.spy()];
            const creepTasks = [{
                [roles.WORKER]: {
                    1: {
                        "hash1": {
                            type: WorkerTask.types.UPGRADING,
                            sourceId: "source1",
                            controllerId: "controllerId"
                        },
                        "hash2": {
                            type: WorkerTask.types.UPGRADING,
                            sourceId: "source2",
                            controllerId: "controllerId"
                        }
                    },
                    2: {
                        "hash3": {
                            type: WorkerTask.types.UPGRADING,
                            sourceId: "source3",
                            controllerId: "controllerId"
                        },
                        "hash4": {
                            type: WorkerTask.types.UPGRADING,
                            sourceId: "source4",
                            controllerId: "controllerId"
                        }
                    }
                }
            },
                {},
                {}
            ];
            const creepTaskAssignments = [{
                "hash1": "creep1",
                "hash3": "creep2"
            }, {}, {}];

            const roomControllerFactory = stubRoomControllerFactory(
                roomExecuteSpies, creepTasks, creepTaskAssignments
            );
            const roomCreateForSpy = sinon.spy(roomControllerFactory, "createFor");
            const creepExecuteSpies = [sinon.spy(), sinon.spy(), sinon.spy()];
            const creepControllerFactory = stubCreepControllerFactory(creepExecuteSpies);
            const creepCreateForSpy = sinon.spy(creepControllerFactory, "createFor");
            const gameController = new GameController({
                gameProvider,
                memory,
                roomControllerFactory,
                creepControllerFactory
            });
            gameController.execute();
            expect(roomCreateForSpy.callCount).to.equal(2);
            expect(creepCreateForSpy.callCount).to.equal(3);
            expect(roomExecuteSpies[0].callCount).to.equal(1);
            expect(roomExecuteSpies[1].callCount).to.equal(1);
            expect(creepExecuteSpies[0].callCount).to.equal(1);
            expect(creepExecuteSpies[1].callCount).to.equal(1);
            expect(creepExecuteSpies[2].callCount).to.equal(1);
        });
    });
})
;



