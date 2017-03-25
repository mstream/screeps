const expect = require("chai").expect;
const sinon = require("sinon");

const ExtensionsBuilder = require("../src/class.ExtensionsBuilder");
const structureTypes = require("../src/const.structureTypes");


const stubRoom = (level) => ({
    level,
    buildExtension: () => undefined
});

const stubRoomLogger = () => ({
    debug: () => undefined,
    info: () => undefined,
    warn: () => undefined,
    alert: () => undefined
});

const stubStructureAllowance = (level, allowance) => ({
    [structureTypes.EXTENSION]: {[level]: allowance}
});

describe("ExtensionsBuilder", () => {

    describe("constructor", () => {

        it("throws exception during extensionsBuilder creation when room is null", () => {
            expect(
                () => new ExtensionsBuilder(null, stubRoomLogger(), stubStructureAllowance(1, 0))
            ).to.throw("room can't be null");
        });

        it("throws exception during extensionsBuilder creation when room is undefined", () => {
            expect(
                () => new ExtensionsBuilder(undefined, stubRoomLogger(), stubStructureAllowance(1, 0))
            ).to.throw("room can't be null");
        });

        it("throws exception during extensionsBuilder creation when room is null", () => {
            expect(
                () => new ExtensionsBuilder(stubRoom(1), null, stubStructureAllowance(1, 0))
            ).to.throw("logger can't be null");
        });

        it("throws exception during extensionsBuilder creation when room is undefined", () => {
            expect(
                () => new ExtensionsBuilder(stubRoom(1), null, stubStructureAllowance(1, 0))
            ).to.throw("logger can't be null");
        });

        it("throws exception during extensionsBuilder creation when structureAllowance is null", () => {
            expect(
                () => new ExtensionsBuilder(stubRoom(1), stubRoomLogger(), null)
            ).to.throw("structureAllowance can't be null");
        });

        it("throws exception during extensionsBuilder creation when structureAllowance is undefined", () => {
            expect(
                () => new ExtensionsBuilder(stubRoom(1), stubRoomLogger(), null)
            ).to.throw("structureAllowance can't be null");
        });
    });

    describe("#build()", () => {

        it("throws exception when extensions is null", () => {
            expect(
                () => new ExtensionsBuilder(stubRoom(1), stubRoomLogger(), stubStructureAllowance(1, 0)).build(null)
            ).to.throw("extensions can't be null");
        });

        it("throws exception when extensions is undefined", () => {
            expect(
                () => new ExtensionsBuilder(stubRoom(1), stubRoomLogger(), stubStructureAllowance(1, 0)).build(undefined)
            ).to.throw("extensions can't be null");
        });

        it("does not do anything when cords is not empty but allowance is zero", () => {
            const room = stubRoom(1);
            const buildExtensionSpy = sinon.spy(room, "buildExtension");
            const logger = stubRoomLogger();
            const allowance = stubStructureAllowance(1, 0);
            const extensions = [{x: 0, y: 0}];
            new ExtensionsBuilder(room, logger, allowance).build(extensions);
            expect(buildExtensionSpy.callCount).to.equal(0);
        });

        it("throws exception when one of extensions is null", () => {
            expect(
                () => new ExtensionsBuilder(stubRoom(1), stubRoomLogger(), stubStructureAllowance(1, 1)).build([null])
            ).to.throw("extension can't be null");
        });

        it("throws exception when one of extensions is undefined", () => {
            expect(
                () => new ExtensionsBuilder(stubRoom(1), stubRoomLogger(), stubStructureAllowance(1, 1)).build([undefined])
            ).to.throw("extension can't be null");
        });

        it("throws exception when allowance is more than zero but one of extensions is in a wrong format", () => {
            const room = stubRoom(1);
            const buildExtensionSpy = sinon.spy(room, "buildExtension");
            const logger = stubRoomLogger();
            const allowance = stubStructureAllowance(1, 1);
            const extensions = [{a: 0, b: 0}];

            expect(
                () => new ExtensionsBuilder(room, logger, allowance).build(extensions)
            ).to.throw(Error);

            expect(buildExtensionSpy.callCount).to.equal(0);
        });

        it("calls room's 'build' method for every cord when allowance is more than zero", () => {
            const room = stubRoom(1);
            const buildExtensionSpy = sinon.spy(room, "buildExtension");
            const logger = stubRoomLogger();
            const allowance = stubStructureAllowance(1, 1);
            const extensions = [
                {x: 0, y: 0},
                {x: 1, y: 1},
                {x: 2, y: 2},
                {x: 3, y: 3},
                {x: 4, y: 4}
            ];

            new ExtensionsBuilder(room, logger, allowance).build(extensions);
            expect(buildExtensionSpy.callCount).to.equal(5);
            expect(buildExtensionSpy.calledWith(
                sinon.match({x: 0, y: 0})
            )).to.be.true;
            expect(buildExtensionSpy.calledWith(
                sinon.match({x: 1, y: 1})
            )).to.be.true;
            expect(buildExtensionSpy.calledWith(
                sinon.match({x: 2, y: 2})
            )).to.be.true;
            expect(buildExtensionSpy.calledWith(
                sinon.match({x: 3, y: 3})
            )).to.be.true;
            expect(buildExtensionSpy.calledWith(
                sinon.match({x: 4, y: 4})
            )).to.be.true;
        });
    });
});



