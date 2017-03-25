const expect = require("chai").expect;
const sinon = require("sinon");

const WallsBuilder = require("../src/class.WallsBuilder");
const structureTypes = require("../src/const.structureTypes");


const stubRoom = (level) => ({
    level,
    buildWall: () => undefined
});

const stubRoomLogger = () => ({
    debug: () => undefined,
    info: () => undefined,
    warn: () => undefined,
    alert: () => undefined
});

const stubStructureAllowance = (level, allowance) => ({
    [structureTypes.WALL]: {[level]: allowance}
});


describe("WallsBuilder", () => {

    describe("constructor", () => {

        it("throws exception during wallsBuilder creation when room is null", () => {
            expect(
                () => new WallsBuilder(null, stubRoomLogger(), stubStructureAllowance(1, 0))
            ).to.throw("room can't be null");
        });

        it("throws exception during wallsBuilder creation when room is undefined", () => {
            expect(
                () => new WallsBuilder(undefined, stubRoomLogger(), stubStructureAllowance(1, 0))
            ).to.throw("room can't be null");
        });

        it("throws exception during wallsBuilder creation when room is null", () => {
            expect(
                () => new WallsBuilder(stubRoom(1), null, stubStructureAllowance(1, 0))
            ).to.throw("logger can't be null");
        });

        it("throws exception during wallsBuilder creation when room is undefined", () => {
            expect(
                () => new WallsBuilder(stubRoom(1), null, stubStructureAllowance(1, 0))
            ).to.throw("logger can't be null");
        });

        it("throws exception during wallsBuilder creation when structureAllowance is null", () => {
            expect(
                () => new WallsBuilder(stubRoom(1), stubRoomLogger(), null)
            ).to.throw("structureAllowance can't be null");
        });

        it("throws exception during wallsBuilder creation when structureAllowance is undefined", () => {
            expect(
                () => new WallsBuilder(stubRoom(1), stubRoomLogger(), null)
            ).to.throw("structureAllowance can't be null");
        });
    });

    describe("#build()", () => {

        it("throws exception when walls is null", () => {
            expect(
                () => new WallsBuilder(stubRoom(1), stubRoomLogger(), stubStructureAllowance(1, 0)).build(null)
            ).to.throw("walls can't be null");
        });

        it("throws exception when walls is undefined", () => {
            expect(
                () => new WallsBuilder(stubRoom(1), stubRoomLogger(), stubStructureAllowance(1, 0)).build(undefined)
            ).to.throw("walls can't be null");
        });

        it("does not do anything when walls is not empty but allowance is zero", () => {
            const room = stubRoom(1);
            const buildWallSpy = sinon.spy(room, "buildWall");
            const logger = stubRoomLogger();
            const allowance = stubStructureAllowance(1, 0);
            const walls = [{from: {x: 0, y: 0}}];
            new WallsBuilder(room, logger, allowance).build(walls);
            expect(buildWallSpy.callCount).to.equal(0);
        });

        it("does not do anything when allowance is more than zero but walls are requested", () => {
            const room = stubRoom(1);
            const buildWallSpy = sinon.spy(room, "buildWall");
            const logger = stubRoomLogger();
            const allowance = stubStructureAllowance(1, 1);
            const walls = ["requested", "requested"];
            new WallsBuilder(room, logger, allowance).build(walls);
            expect(buildWallSpy.callCount).to.equal(0);
        });

        it("throws exception when allowance is more than zero but one of the walls is null", () => {
            const room = stubRoom(1);
            const buildWallSpy = sinon.spy(room, "buildWall");
            const logger = stubRoomLogger();
            const allowance = stubStructureAllowance(1, 1);
            const walls = [null];

            expect(
                () => new WallsBuilder(room, logger, allowance).build(walls)
            ).to.throw("wall can't be null");

            expect(buildWallSpy.callCount).to.equal(0);
        });

        it("throws exception when allowance is more than zero but one of the walls is undefined", () => {
            const room = stubRoom(1);
            const buildWallSpy = sinon.spy(room, "buildWall");
            const logger = stubRoomLogger();
            const allowance = stubStructureAllowance(1, 1);
            const walls = [undefined];

            expect(
                () => new WallsBuilder(room, logger, allowance).build(walls)
            ).to.throw("wall can't be null");

            expect(buildWallSpy.callCount).to.equal(0);
        });

        it("throws exception when allowance is more than zero but one of wall is in a wrong format", () => {
            const room = stubRoom(1);
            const buildWallSpy = sinon.spy(room, "buildWall");
            const logger = stubRoomLogger();
            const allowance = stubStructureAllowance(1, 1);
            const walls = [{from: 0, to: 0}];

            expect(
                () => new WallsBuilder(room, logger, allowance).build(walls)
            ).to.throw(Error);

            expect(buildWallSpy.callCount).to.equal(0);
        });

        it("calls room's 'build' method for every wall segment when allowance is more than zero", () => {
            const room = stubRoom(1);
            const buildWallSpy = sinon.spy(room, "buildWall");
            const logger = stubRoomLogger();
            const allowance = stubStructureAllowance(1, 1);
            const walls = [
                {from: {x: 0, y: 0}, to: {x: 1, y: 0}},
                {from: {x: 3, y: 0}, to: {x: 4, y: 0}},
                {from: {x: 0, y: 1}, to: {x: 0, y: 3}}
            ];
            new WallsBuilder(room, logger, allowance).build(walls);
            expect(buildWallSpy.callCount).to.equal(7);
            expect(buildWallSpy.calledWith(
                sinon.match({x: 0, y: 0})
            )).to.be.true;
            expect(buildWallSpy.calledWith(
                sinon.match({x: 1, y: 0})
            )).to.be.true;
            expect(buildWallSpy.calledWith(
                sinon.match({x: 3, y: 0})
            )).to.be.true;
            expect(buildWallSpy.calledWith(
                sinon.match({x: 4, y: 0})
            )).to.be.true;
            expect(buildWallSpy.calledWith(
                sinon.match({x: 0, y: 1})
            )).to.be.true;
            expect(buildWallSpy.calledWith(
                sinon.match({x: 0, y: 2})
            )).to.be.true;
            expect(buildWallSpy.calledWith(
                sinon.match({x: 0, y: 3})
            )).to.be.true;
        });
    });
});



