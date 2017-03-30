const expect = require("chai").expect;
const sinon = require("sinon");

const ExtensionsBuilder = require("../src/class.ExtensionsBuilder");
const structureTypes = require("../src/const.structureTypes");


const stubRoom = (level) => ({
    level,
    buildExtension: () => undefined
});

const stubLogger = () => ({
    debug: () => undefined,
    info: () => undefined,
    warn: () => undefined,
    alert: () => undefined
});

const stubStructureAllowances = (level, structureAllowances) => ({
    [structureTypes.EXTENSION]: {[level]: structureAllowances}
});

describe("ExtensionsBuilder", () => {

    describe("constructor", () => {

        it("throws exception structureAllowance is null", () => {
            expect(
                () => new ExtensionsBuilder({
                    structureAllowances: null,
                    logger: stubLogger()
                })
            ).to.throw("structureAllowances can't be null");
        });

        it("throws exception logger is null", () => {
            expect(
                () => new ExtensionsBuilder({
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
            const extensionsBuilder = new ExtensionsBuilder({
                structureAllowances, logger
            });
            expect(
                () => extensionsBuilder.build(
                    null, [{x: 0, y: 0}]
                )
            ).to.throw("room can't be null");
        });

        it("throws exception when room is undefined", () => {
            const structureAllowances = stubStructureAllowances(1, 0);
            const logger = stubLogger();
            const extensionsBuilder = new ExtensionsBuilder({
                structureAllowances, logger
            });
            expect(
                () => extensionsBuilder.build(
                    undefined, [{x: 0, y: 0}]
                )
            ).to.throw("room can't be null");
        });

        it("throws exception when extensions is null", () => {
            const logger = stubLogger();
            const structureAllowances = stubStructureAllowances(1, 0);
            const extensionsBuilder = new ExtensionsBuilder({
                structureAllowances, logger
            });
            expect(
                () => extensionsBuilder.build(stubRoom(1), null)
            ).to.throw("extensions can't be null");
        });

        it("throws exception when extensions is undefined", () => {
            const logger = stubLogger();
            const structureAllowances = stubStructureAllowances(1, 0);
            const extensionsBuilder = new ExtensionsBuilder({
                structureAllowances, logger
            });
            expect(
                () => extensionsBuilder.build(stubRoom(1), undefined)
            ).to.throw("extensions can't be null");
        });

        it("does not do anything when cords is not empty but structureAllowances is zero", () => {
            const room = stubRoom(1);
            const buildExtensionSpy = sinon.spy(room, "buildExtension");
            const logger = stubLogger();
            const structureAllowances = stubStructureAllowances(1, 0);
            const extensions = [{x: 0, y: 0}];
            const extensionsBuilder = new ExtensionsBuilder({
                structureAllowances, logger
            });
            extensionsBuilder.build(room, extensions);
            expect(buildExtensionSpy.callCount).to.equal(0);
        });

        it("throws exception when one of extensions is null", () => {
            const structureAllowances = stubStructureAllowances(1, 1);
            const logger = stubLogger();
            const extensionsBuilder = new ExtensionsBuilder({
                structureAllowances, logger
            });
            expect(
                () => extensionsBuilder.build(stubRoom(1), [null])
            ).to.throw("extension can't be null");
        });

        it("throws exception when one of extensions is undefined", () => {
            const structureAllowances = stubStructureAllowances(1, 1);
            const logger = stubLogger();
            const extensionsBuilder = new ExtensionsBuilder({
                structureAllowances, logger
            });
            expect(
                () => extensionsBuilder.build(stubRoom(1), [undefined])
            ).to.throw("extension can't be null");
        });

        it("throws exception when one of extensions is in a wrong format", () => {
            const room = stubRoom(1);
            const buildExtensionSpy = sinon.spy(room, "buildExtension");
            const logger = stubLogger();
            const structureAllowances = stubStructureAllowances(1, 1);
            const extensions = [{a: 0, b: 0}];
            const extensionsBuilder = new ExtensionsBuilder({
                structureAllowances, logger
            });
            expect(
                () => extensionsBuilder.build(room, extensions)
            ).to.throw(Error);

            expect(buildExtensionSpy.callCount).to.equal(0);
        });

        it("calls room's 'build' method for every cord when structureAllowances is more than zero", () => {
            const room = stubRoom(1);
            const buildExtensionSpy = sinon.spy(room, "buildExtension");
            const logger = stubLogger();
            const structureAllowances = stubStructureAllowances(1, 1);
            const extensions = [
                {x: 0, y: 0},
                {x: 1, y: 1},
                {x: 2, y: 2},
                {x: 3, y: 3},
                {x: 4, y: 4}
            ];
            const extensionsBuilder = new ExtensionsBuilder({
                structureAllowances, logger
            });
            extensionsBuilder.build(room, extensions);
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



