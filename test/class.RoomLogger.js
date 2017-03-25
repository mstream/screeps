const expect = require("chai").expect;
const sinon = require("sinon");

const RoomLogger = require("../src/class.RoomLogger");

const stubConsole = () => ({
    log: () => undefined
});

const stubRoom = (name) => ({name});

const stubGame = (time) => ({time});


describe("RoomLogger", () => {

    describe("constructor", () => {

        it("throws exception during roomLogger creation when console type is null", () => {
            expect(() => new RoomLogger(null, stubRoom("room1"), stubGame(0))).to.throw("console can't be null");
        });

        it("throws exception during roomLogger creation when console type is undefined", () => {
            expect(() => new RoomLogger(undefined, stubRoom("room1"), stubGame(0))).to.throw("console can't be null");
        });

        it("throws exception during roomLogger creation when console type is null", () => {
            expect(() => new RoomLogger(stubConsole(), null, stubGame(0))).to.throw("room can't be null");
        });

        it("throws exception during roomLogger creation when console type is undefined", () => {
            expect(() => new RoomLogger(stubConsole(), undefined, stubGame(0))).to.throw("room can't be null");
        });

        it("throws exception during roomLogger creation when console type is null", () => {
            expect(() => new RoomLogger(stubConsole(), stubRoom("room1"), null)).to.throw("game can't be null");
        });

        it("throws exception during roomLogger creation when console type is undefined", () => {
            expect(() => new RoomLogger(stubConsole(), stubRoom("room1"), undefined)).to.throw("game can't be null");
        });

        it("creates debug logs", () => {
            const console = stubConsole();
            const room = stubRoom("room1");
            const game = stubGame(123);
            const logSpy = sinon.spy(console, "log");
            const roomLogger = new RoomLogger(console, room, game);
            roomLogger.debug("message");
            expect(logSpy.callCount).to.equal(1);
            expect(logSpy.calledWith(
                "123       DEBUG room1      message"
            )).to.be.true;
        });

        it("creates info logs", () => {
            const console = stubConsole();
            const room = stubRoom("room1");
            const game = stubGame(123);
            const logSpy = sinon.spy(console, "log");
            const roomLogger = new RoomLogger(console, room, game);
            roomLogger.info("message");
            expect(logSpy.callCount).to.equal(1);
            expect(logSpy.calledWith(
                "123       INFO  room1      message"
            )).to.be.true;
        });

        it("creates warn logs", () => {
            const console = stubConsole();
            const room = stubRoom("room1");
            const game = stubGame(123);
            const logSpy = sinon.spy(console, "log");
            const roomLogger = new RoomLogger(console, room, game);
            roomLogger.warn("message");
            expect(logSpy.callCount).to.equal(1);
            expect(logSpy.calledWith(
                "123       WARN  room1      message"
            )).to.be.true;
        });

        it("creates error logs", () => {
            const console = stubConsole();
            const room = stubRoom("room1");
            const game = stubGame(123);
            const logSpy = sinon.spy(console, "log");
            const roomLogger = new RoomLogger(console, room, game);
            roomLogger.error("message");
            expect(logSpy.callCount).to.equal(1);
            expect(logSpy.calledWith(
                "123       ERROR room1      message"
            )).to.be.true;
        });
    });
});



