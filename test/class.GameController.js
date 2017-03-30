const expect = require("chai").expect;
const sinon = require("sinon");

const GameController = require("../src/class.GameController");


const stubGame = (time = 0, rooms = {}, creeps = {}) => ({time, rooms, creeps});

const stubMemory = () => ({});

const stubRoomControllerFactory = (executeSpies = []) => {
    let spyIdx = 0;
    return {
        createFor: (room) => ({
            name: room.name,
            execute: executeSpies[spyIdx++]
        })
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

        it("throws exception during gameController.js creation when game is null", () => {
            expect(() => new GameController({
                game: null,
                memory: stubMemory(),
                roomControllerFactory: stubRoomControllerFactory(),
                creepControllerFactory: stubCreepControllerFactory()
            })).to.throw("game can't be null");
        });

        it("throws exception during gameController.js creation when memory is null", () => {
            expect(() => new GameController({
                game: stubGame(),
                memory: null,
                roomControllerFactory: stubRoomControllerFactory(),
                creepControllerFactory: stubCreepControllerFactory()
            })).to.throw("memory can't be null");
        });

        it("throws exception during gameController.js creation when roomControllerFactory is null", () => {
            expect(() => new GameController({
                game: stubGame(),
                memory: stubMemory(),
                roomControllerFactory: null,
                creepControllerFactory: stubCreepControllerFactory()
            })).to.throw("roomControllerFactory can't be null");
        });

        it("throws exception during gameController.js creation when creepControllerFactory is null", () => {
            expect(() => new GameController({
                game: stubGame(),
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

            const game = stubGame(
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
            const roomControllerFactory = stubRoomControllerFactory(roomExecuteSpies);
            const roomCreateForSpy = sinon.spy(roomControllerFactory, "createFor");
            const creepExecuteSpies = [sinon.spy(), sinon.spy(), sinon.spy()];
            const creepControllerFactory = stubCreepControllerFactory(creepExecuteSpies);
            const creepCreateForSpy = sinon.spy(creepControllerFactory, "createFor");
            const gameController = new GameController({
                game,
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
});



