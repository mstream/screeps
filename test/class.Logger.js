const expect = require("chai").expect;
const sinon = require("sinon");

const Logger = require("../src/class.Logger");

const stubConsole = () => ({
    log: () => undefined
});

const stubRoom = (name) => ({name});

const stubGame = (time) => ({time});


describe("Logger", () => {

    describe("constructor", () => {

        it("throws exception during logger creation when console type is null", () => {
            expect(
                () => new Logger({console: null, gameProvider: stubGame(0)})
            ).to.throw("console can't be null");
        });

        it("throws exception during logger creation when gameProvider type is null", () => {
            expect(
                () => new Logger({console: stubConsole(), gameProvider: null})
            ).to.throw("gameProvider can't be null");
        });
    });

    describe("#debug", () => {

        it("creates debug logs", () => {
            const console = stubConsole();
            const gameProvider = stubGame(123);
            const logSpy = sinon.spy(console, "log");
            const logger = new Logger({console, gameProvider});
            logger.debug("message");
            expect(logSpy.callCount).to.equal(1);
            expect(logSpy.calledWith(
                "123       DEBUG  message"
            )).to.be.true;
        });

        it("creates debug logs with room name", () => {
            const console = stubConsole();
            const room = stubRoom("room1");
            const gameProvider = stubGame(123);
            const logSpy = sinon.spy(console, "log");
            const logger = new Logger({console, gameProvider});
            logger.debug("message", room);
            expect(logSpy.callCount).to.equal(1);
            expect(logSpy.calledWith(
                "123       DEBUG room1      message"
            )).to.be.true;
        });
    });

    describe("#info", () => {

        it("creates info logs", () => {
            const console = stubConsole();
            const gameProvider = stubGame(123);
            const logSpy = sinon.spy(console, "log");
            const logger = new Logger({console, gameProvider});
            logger.info("message");
            expect(logSpy.callCount).to.equal(1);
            expect(logSpy.calledWith(
                "123       INFO   message"
            )).to.be.true;
        });

        it("creates info logs with room name", () => {
            const console = stubConsole();
            const room = stubRoom("room1");
            const gameProvider = stubGame(123);
            const logSpy = sinon.spy(console, "log");
            const logger = new Logger({console, gameProvider});
            logger.info("message", room);
            expect(logSpy.callCount).to.equal(1);
            expect(logSpy.calledWith(
                "123       INFO  room1      message"
            )).to.be.true;
        });
    });

    describe("#warn", () => {

        it("creates warn logs", () => {
            const console = stubConsole();
            const gameProvider = stubGame(123);
            const logSpy = sinon.spy(console, "log");
            const logger = new Logger({console, gameProvider});
            logger.warn("message");
            expect(logSpy.callCount).to.equal(1);
            expect(logSpy.calledWith(
                "123       WARN   message"
            )).to.be.true;
        });

        it("creates warn logs with room name", () => {
            const console = stubConsole();
            const room = stubRoom("room1");
            const gameProvider = stubGame(123);
            const logSpy = sinon.spy(console, "log");
            const logger = new Logger({console, gameProvider});
            logger.warn("message", room);
            expect(logSpy.callCount).to.equal(1);
            expect(logSpy.calledWith(
                "123       WARN  room1      message"
            )).to.be.true;
        });
    });

    describe("#error", () => {

        it("creates error logs", () => {
            const console = stubConsole();
            const gameProvider = stubGame(123);
            const logSpy = sinon.spy(console, "log");
            const logger = new Logger({console, gameProvider});
            logger.error("message");
            expect(logSpy.callCount).to.equal(1);
            expect(logSpy.calledWith(
                "123       ERROR  message"
            )).to.be.true;
        });

        it("creates error logs with room name", () => {
            const console = stubConsole();
            const room = stubRoom("room1");
            const gameProvider = stubGame(123);
            const logSpy = sinon.spy(console, "log");
            const logger = new Logger({console, gameProvider});
            logger.error("message", room);
            expect(logSpy.callCount).to.equal(1);
            expect(logSpy.calledWith(
                "123       ERROR room1      message"
            )).to.be.true;
        });
    });
});



