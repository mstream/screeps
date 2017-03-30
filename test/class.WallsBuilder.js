const expect = require("chai").expect;
const sinon = require("sinon");

const WallsBuilder = require("../src/class.WallsBuilder");
const structureTypes = require("../src/const.structureTypes");


const stubRoom = (level) => ({
    level,
    buildWall: () => undefined
});

const stubLogger = () => ({
    debug: () => undefined,
    info: () => undefined,
    warn: () => undefined,
    alert: () => undefined
});

const stubStructureAllowances = (level, structureAllowances) => ({
    [structureTypes.WALL]: {[level]: structureAllowances}
});


describe("WallsBuilder", () => {

    describe("constructor", () => {

        it("throws exception structureAllowance is null", () => {
            expect(
                () => new WallsBuilder({
                    structureAllowances: null,
                    logger: stubLogger()
                })
            ).to.throw("structureAllowances can't be null");
        });

        it("throws exception logger is null", () => {
            expect(
                () => new WallsBuilder({
                    structureAllowances: stubStructureAllowances(1, 1),
                    logger: null
                })
            ).to.throw("logger can't be null");
        });
    });

    describe("#build()", () => {

        it("throws exception when room is null", () => {
            const structureAllowances = stubStructureAllowances(1, 0);
            const logger = stubLogger();
            const wallsBuilder = new WallsBuilder({structureAllowances, logger});
            expect(
                () => wallsBuilder.build(
                    null, [{from: {x: 0, y: 0}, to: {x: 1, y: 0}}]
                )
            ).to.throw("room can't be null");
        });

        it("throws exception when walls is null", () => {
            const structureAllowances = stubStructureAllowances(1, 0);
            const logger = stubLogger();
            const wallsBuilder = new WallsBuilder({structureAllowances, logger});
            expect(
                () => wallsBuilder.build(
                    stubRoom(1), null
                )
            ).to.throw("walls can't be null");
        });

        it("does not do anything when walls is not empty but structureAllowance is zero", () => {
            const room = stubRoom(1);
            const buildWallSpy = sinon.spy(room, "buildWall");
            const logger = stubLogger();
            const structureAllowances = stubStructureAllowances(1, 0);
            const walls = [{from: {x: 0, y: 0}, to: {x: 1, y: 0}}];
            const wallsBuilder = new WallsBuilder({structureAllowances, logger});
            wallsBuilder.build(room, walls);
            expect(buildWallSpy.callCount).to.equal(0);
        });

        it("does not do anything when walls are requested", () => {
            const room = stubRoom(1);
            const buildWallSpy = sinon.spy(room, "buildWall");
            const logger = stubLogger();
            const structureAllowances = stubStructureAllowances(1, 1);
            const walls = ["requested", "requested"];
            const wallsBuilder = new WallsBuilder({structureAllowances, logger});
            wallsBuilder.build(room, walls);
            expect(buildWallSpy.callCount).to.equal(0);
        });

        it("throws exception when one of the walls is null", () => {
            const room = stubRoom(1);
            const buildWallSpy = sinon.spy(room, "buildWall");
            const logger = stubLogger();
            const structureAllowances = stubStructureAllowances(1, 1);
            const walls = [null];
            const wallsBuilder = new WallsBuilder({structureAllowances, logger});
            expect(
                () => wallsBuilder.build(room, walls)
            ).to.throw("wall can't be null");

            expect(buildWallSpy.callCount).to.equal(0);
        });

        it("throws exception when one of wall is in a wrong format", () => {
            const room = stubRoom(1);
            const buildWallSpy = sinon.spy(room, "buildWall");
            const logger = stubLogger();
            const structureAllowances = stubStructureAllowances(1, 1);
            const walls = [{from: 0, to: 0}];
            const wallsBuilder = new WallsBuilder({structureAllowances, logger});
            expect(
                () => wallsBuilder.build(room, walls)
            ).to.throw(Error);

            expect(buildWallSpy.callCount).to.equal(0);
        });

        it("calls room's 'build' method for every wall segment when structureAllowance is more than zero", () => {
            const room = stubRoom(1);
            const buildWallSpy = sinon.spy(room, "buildWall");
            const logger = stubLogger();
            const structureAllowances = stubStructureAllowances(1, 1);
            const walls = [
                {from: {x: 0, y: 0}, to: {x: 1, y: 0}},
                {from: {x: 3, y: 0}, to: {x: 4, y: 0}},
                {from: {x: 0, y: 1}, to: {x: 0, y: 3}}
            ];
            new WallsBuilder({structureAllowances, logger}).build(room, walls);
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



