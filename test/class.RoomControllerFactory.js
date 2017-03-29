const expect = require("chai").expect;

const roles = require("../src/const.roles");

const RoomControllerFactory = require("../src/class.RoomControllerFactory");


const stubRoom = () => ({});
const stubGame = () => ({});
const stubMemory = () => ({});


describe("RoomControllerFactory", () => {


    describe("#createFor", () => {

        it("throws an exception when room is null", () => {
            expect(() => new RoomControllerFactory().createFor(
                null,
                stubGame(),
                stubMemory()
            )).to.throw("room can't be null");
        });

        it("throws an exception when room is undefined", () => {
            expect(() => new RoomControllerFactory().createFor(
                undefined,
                stubGame(),
                stubMemory()
            )).to.throw("room can't be null");
        });

        it("throws an exception when game is null", () => {
            expect(() => new RoomControllerFactory().createFor(
                stubRoom(roles.BUILDER),
                null,
                stubMemory()
            )).to.throw("game can't be null");
        });

        it("throws an exception when game is undefined", () => {
            expect(() => new RoomControllerFactory().createFor(
                stubRoom(roles.BUILDER),
                undefined,
                stubMemory()
            )).to.throw("game can't be null");
        });

        it("throws an exception when memory is null", () => {
            expect(() => new RoomControllerFactory().createFor(
                stubRoom(roles.BUILDER),
                stubGame(),
                null
            )).to.throw("memory can't be null");
        });

        it("throws an exception when memory is undefined", () => {
            expect(() => new RoomControllerFactory().createFor(
                stubRoom(roles.BUILDER),
                stubGame(),
                undefined
            )).to.throw("memory can't be null");
        });

        it("returns an executable controller", () => {
            const room = stubRoom();
            const game = stubGame();
            const memory = stubMemory();
            const roomControllerFactory = new RoomControllerFactory();
            const roomController = roomControllerFactory.createFor(
                room, game, memory
            );
            expect(typeof roomController.execute).to.equal("function");
        });
    });
});



