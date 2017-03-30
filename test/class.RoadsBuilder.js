const expect = require("chai").expect;
const sinon = require("sinon");

const RoadsBuilder = require("../src/class.RoadsBuilder");
const structureTypes = require("../src/const.structureTypes");


const stubRoom = (level) => ({
    level,
    buildRoad: () => undefined
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


describe("RoadsBuilder", () => {

    describe("constructor", () => {

        it("throws exception structureAllowance is null", () => {
            expect(
                () => new RoadsBuilder({
                    structureAllowances: null,
                    logger: stubLogger()
                })
            ).to.throw("structureAllowances can't be null");
        });

        it("throws exception logger is null", () => {
            expect(
                () => new RoadsBuilder({
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
            const roadsBuilder = new RoadsBuilder({
                structureAllowances,
                logger
            });
            expect(
                () => roadsBuilder.build(
                    null, [[{x: 0, y: 0}, {x: 1, y: 1}]]
                )
            ).to.throw("room can't be null");
        });

        it("throws exception when room is undefined", () => {
            const structureAllowances = stubStructureAllowances(1, 0);
            const logger = stubLogger();
            const roadsBuilder = new RoadsBuilder({
                structureAllowances,
                logger
            });
            expect(
                () => roadsBuilder.build(
                    undefined, [[{x: 0, y: 0}, {x: 1, y: 1}]]
                )
            ).to.throw("room can't be null");
        });

        it("throws exception when paths is null", () => {
            const structureAllowances = stubStructureAllowances(1, 0);
            const logger = stubLogger();
            const roadsBuilder = new RoadsBuilder({
                structureAllowances,
                logger
            });
            expect(
                () => roadsBuilder.build(
                    stubRoom(1), null
                )
            ).to.throw("paths can't be null");
        });

        it("throws exception when paths is undefined", () => {
            const structureAllowances = stubStructureAllowances(1, 0);
            const logger = stubLogger();
            const roadsBuilder = new RoadsBuilder({
                structureAllowances,
                logger
            });
            expect(
                () => roadsBuilder.build(
                    stubRoom(1), undefined
                )
            ).to.throw("paths can't be null");
        });

        it("does not do anything when paths is not empty but structureAllowance is zero", () => {
            const room = stubRoom(1);
            const buildRoadSpy = sinon.spy(room, "buildRoad");
            const logger = stubLogger();
            const structureAllowances = stubStructureAllowances(1, 0);
            const paths = [[{x: 0, y: 0}]];
            const roadsBuilder = new RoadsBuilder({
                structureAllowances,
                logger
            });
            roadsBuilder.build(room, paths);
            expect(buildRoadSpy.callCount).to.equal(0);
        });

        it("does not do anything when pathSegments are null", () => {
            const room = stubRoom(1);
            const buildRoadSpy = sinon.spy(room, "buildRoad");
            const logger = stubLogger();
            const structureAllowances = stubStructureAllowances(1, 1);
            const paths = [null, null];
            const roadsBuilder = new RoadsBuilder({
                structureAllowances,
                logger
            });
            roadsBuilder.build(room, paths);
            expect(buildRoadSpy.callCount).to.equal(0);
        });

        it("does not do anything when pathSegments are undefined", () => {
            const room = stubRoom(1);
            const buildRoadSpy = sinon.spy(room, "buildRoad");
            const logger = stubLogger();
            const structureAllowances = stubStructureAllowances(1, 1);
            const paths = [undefined, undefined];
            const roadsBuilder = new RoadsBuilder({
                structureAllowances,
                logger
            });
            roadsBuilder.build(room, paths);
            expect(buildRoadSpy.callCount).to.equal(0);
        });

        it("does not do anything when pathSegments are requested", () => {
            const room = stubRoom(1);
            const buildRoadSpy = sinon.spy(room, "buildRoad");
            const logger = stubLogger();
            const structureAllowances = stubStructureAllowances(1, 1);
            const paths = ["requested", "requested"];
            const roadsBuilder = new RoadsBuilder({
                structureAllowances,
                logger
            });
            roadsBuilder.build(room, paths);
            expect(buildRoadSpy.callCount).to.equal(0);
        });

        it("does not do anything when pathSegments are empty", () => {
            const room = stubRoom(1);
            const buildRoadSpy = sinon.spy(room, "buildRoad");
            const logger = stubLogger();
            const structureAllowances = stubStructureAllowances(1, 1);
            const paths = [[], []];
            const roadsBuilder = new RoadsBuilder({
                structureAllowances,
                logger
            });
            roadsBuilder.build(room, paths);
            expect(buildRoadSpy.callCount).to.equal(0);
        });

        it("throws exception when one of pathSegments is null", () => {
            const room = stubRoom(1);
            const buildRoadSpy = sinon.spy(room, "buildRoad");
            const logger = stubLogger();
            const structureAllowances = stubStructureAllowances(1, 1);
            const paths = [[null], [], [], []];
            const roadsBuilder = new RoadsBuilder({
                structureAllowances,
                logger
            });
            expect(
                () => roadsBuilder.build(room, paths)
            ).to.throw("pathSegment can't be null");

            expect(buildRoadSpy.callCount).to.equal(0);
        });

        it("throws exception when one of pathSegments is undefined", () => {
            const room = stubRoom(1);
            const buildRoadSpy = sinon.spy(room, "buildRoad");
            const logger = stubLogger();
            const structureAllowances = stubStructureAllowances(1, 1);
            const paths = [[undefined], [], [], []];
            const roadsBuilder = new RoadsBuilder({
                structureAllowances,
                logger
            });
            expect(
                () => roadsBuilder.build(room, paths)
            ).to.throw("pathSegment can't be null");

            expect(buildRoadSpy.callCount).to.equal(0);
        });

        it("throws exception when one of pathSegments is in a wrong format", () => {
            const room = stubRoom(1);
            const buildRoadSpy = sinon.spy(room, "buildRoad");
            const logger = stubLogger();
            const structureAllowances = stubStructureAllowances(1, 1);
            const paths = [[{a: 0, b: 0}], [], [], []];
            const roadsBuilder = new RoadsBuilder({
                structureAllowances,
                logger
            });
            expect(
                () => roadsBuilder.build(room, paths)
            ).to.throw(Error);

            expect(buildRoadSpy.callCount).to.equal(0);
        });

        it("calls room's 'build' method for every path segment when structureAllowance is more than zero", () => {
            const room = stubRoom(1);
            const buildRoadSpy = sinon.spy(room, "buildRoad");
            const logger = stubLogger();
            const structureAllowances = stubStructureAllowances(1, 1);
            const paths = [
                [{x: 0, y: 0}, {x: 1, y: 1}],
                [{x: 2, y: 2}],
                [{x: 3, y: 3}],
                [{x: 4, y: 4}]
            ];
            const roadsBuilder = new RoadsBuilder({
                structureAllowances,
                logger
            });
            roadsBuilder.build(room, paths);
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



