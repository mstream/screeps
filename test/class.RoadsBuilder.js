const expect = require("chai").expect;
const sinon = require("sinon");

const RoadsBuilder = require("../src/class.RoadsBuilder");
const structureTypes = require("../src/const.structureTypes");


const stubRoom = (level) => ({
    level,
    buildRoad: () => undefined
});

const stubRoomLogger = () => ({
    debug: () => undefined,
    info: () => undefined,
    warn: () => undefined,
    alert: () => undefined
});

const stubStructureAllowance = (level, allowance) => ({
    [structureTypes.ROAD]: {[level]: allowance}
});

const stubPaths = (top, bottom, left, right) => ({top, bottom, left, right});


describe("RoadsBuilder", () => {

    describe("constructor", () => {

        it("throws exception during roadsBuilder creation when room is null", () => {
            expect(
                () => new RoadsBuilder(null, stubRoomLogger(), stubStructureAllowance(1, 0))
            ).to.throw("room can't be null");
        });

        it("throws exception during roadsBuilder creation when room is undefined", () => {
            expect(
                () => new RoadsBuilder(undefined, stubRoomLogger(), stubStructureAllowance(1, 0))
            ).to.throw("room can't be null");
        });

        it("throws exception during roadsBuilder creation when room is null", () => {
            expect(
                () => new RoadsBuilder(stubRoom(1), null, stubStructureAllowance(1, 0))
            ).to.throw("logger can't be null");
        });

        it("throws exception during roadsBuilder creation when room is undefined", () => {
            expect(
                () => new RoadsBuilder(stubRoom(1), null, stubStructureAllowance(1, 0))
            ).to.throw("logger can't be null");
        });

        it("throws exception during roadsBuilder creation when structureAllowance is null", () => {
            expect(
                () => new RoadsBuilder(stubRoom(1), stubRoomLogger(), null)
            ).to.throw("structureAllowance can't be null");
        });

        it("throws exception during roadsBuilder creation when structureAllowance is undefined", () => {
            expect(
                () => new RoadsBuilder(stubRoom(1), stubRoomLogger(), null)
            ).to.throw("structureAllowance can't be null");
        });
    });

    describe("#build()", () => {

        it("throws exception when paths is null", () => {
            expect(
                () => new RoadsBuilder(stubRoom(1), stubRoomLogger(), stubStructureAllowance(1, 0)).build(null)
            ).to.throw("paths can't be null");
        });

        it("throws exception when paths is undefined", () => {
            expect(
                () => new RoadsBuilder(stubRoom(1), stubRoomLogger(), stubStructureAllowance(1, 0)).build(undefined)
            ).to.throw("paths can't be null");
        });

        it("does not do anything when paths is not empty but allowance is zero", () => {
            const room = stubRoom(1);
            const buildRoadSpy = sinon.spy(room, "buildRoad");
            const logger = stubRoomLogger();
            const allowance = stubStructureAllowance(1, 0);
            const paths = stubPaths(
                [{x: 0, y: 0}]
            );
            new RoadsBuilder(room, logger, allowance).build(paths);
            expect(buildRoadSpy.callCount).to.equal(0);
        });

        it("does not do anything when allowance is more than zero but paths are undefined", () => {
            const room = stubRoom(1);
            const buildRoadSpy = sinon.spy(room, "buildRoad");
            const logger = stubRoomLogger();
            const allowance = stubStructureAllowance(1, 1);
            const paths = stubPaths(undefined, undefined, undefined, undefined);
            new RoadsBuilder(room, logger, allowance).build(paths);
            expect(buildRoadSpy.callCount).to.equal(0);
        });

        it("does not do anything when allowance is more than zero but pathSegments are null", () => {
            const room = stubRoom(1);
            const buildRoadSpy = sinon.spy(room, "buildRoad");
            const logger = stubRoomLogger();
            const allowance = stubStructureAllowance(1, 1);
            const paths = stubPaths(null, null, null, null);
            new RoadsBuilder(room, logger, allowance).build(paths);
            expect(buildRoadSpy.callCount).to.equal(0);
        });

        it("does not do anything when allowance is more than zero but pathSegments are undefined", () => {
            const room = stubRoom(1);
            const buildRoadSpy = sinon.spy(room, "buildRoad");
            const logger = stubRoomLogger();
            const allowance = stubStructureAllowance(1, 1);
            const paths = stubPaths(undefined, undefined, undefined, undefined);
            new RoadsBuilder(room, logger, allowance).build(paths);
            expect(buildRoadSpy.callCount).to.equal(0);
        });

        it("does not do anything when allowance is more than zero but pathSegments are requested", () => {
            const room = stubRoom(1);
            const buildRoadSpy = sinon.spy(room, "buildRoad");
            const logger = stubRoomLogger();
            const allowance = stubStructureAllowance(1, 1);
            const paths = stubPaths("requested", "requested", "requested", "requested");
            new RoadsBuilder(room, logger, allowance).build(paths);
            expect(buildRoadSpy.callCount).to.equal(0);
        });

        it("does not do anything when allowance is more than zero but pathSegments are empty", () => {
            const room = stubRoom(1);
            const buildRoadSpy = sinon.spy(room, "buildRoad");
            const logger = stubRoomLogger();
            const allowance = stubStructureAllowance(1, 1);
            const paths = stubPaths([], [], [], []);
            new RoadsBuilder(room, logger, allowance).build(paths);
            expect(buildRoadSpy.callCount).to.equal(0);
        });

        it("throws exception when allowance is more than zero but one of pathSegments is null", () => {
            const room = stubRoom(1);
            const buildRoadSpy = sinon.spy(room, "buildRoad");
            const logger = stubRoomLogger();
            const allowance = stubStructureAllowance(1, 1);
            const paths = stubPaths([null], [], [], []);

            expect(
                () => new RoadsBuilder(room, logger, allowance).build(paths)
            ).to.throw("pathSegment can't be null");

            expect(buildRoadSpy.callCount).to.equal(0);
        });

        it("throws exception when allowance is more than zero but one of pathSegments is undefined", () => {
            const room = stubRoom(1);
            const buildRoadSpy = sinon.spy(room, "buildRoad");
            const logger = stubRoomLogger();
            const allowance = stubStructureAllowance(1, 1);
            const paths = stubPaths([undefined], [], [], []);

            expect(
                () => new RoadsBuilder(room, logger, allowance).build(paths)
            ).to.throw("pathSegment can't be null");

            expect(buildRoadSpy.callCount).to.equal(0);
        });

        it("throws exception when allowance is more than zero but one of pathSegments is in a wrong format", () => {
            const room = stubRoom(1);
            const buildRoadSpy = sinon.spy(room, "buildRoad");
            const logger = stubRoomLogger();
            const allowance = stubStructureAllowance(1, 1);
            const paths = stubPaths([{a: 0, b: 0}], [], [], []);

            expect(
                () => new RoadsBuilder(room, logger, allowance).build(paths)
            ).to.throw(Error);

            expect(buildRoadSpy.callCount).to.equal(0);
        });

        it("calls room's 'build' method for every path segment when allowance is more than zero", () => {
            const room = stubRoom(1);
            const buildRoadSpy = sinon.spy(room, "buildRoad");
            const logger = stubRoomLogger();
            const allowance = stubStructureAllowance(1, 1);
            const paths = stubPaths(
                [{x: 0, y: 0}, {x: 1, y: 1}],
                [{x: 2, y: 2}],
                [{x: 3, y: 3}],
                [{x: 4, y: 4}]
            );
            new RoadsBuilder(room, logger, allowance).build(paths);
            expect(buildRoadSpy.callCount).to.equal(5);
            expect(buildRoadSpy.calledWith(
                sinon.match({x: 0, y: 0})
            )).to.be.true;
            expect(buildRoadSpy.calledWith(
                sinon.match({x: 1, y: 1})
            )).to.be.true;
            expect(buildRoadSpy.calledWith(
                sinon.match({x: 2, y: 2})
            )).to.be.true;
            expect(buildRoadSpy.calledWith(
                sinon.match({x: 3, y: 3})
            )).to.be.true;
            expect(buildRoadSpy.calledWith(
                sinon.match({x: 4, y: 4})
            )).to.be.true;
        });
    });
});



