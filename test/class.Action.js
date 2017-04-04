const expect = require("chai").expect;
const Action = require("../src/class.Action");


describe("Action", () => {

    describe("#toJSON()", () => {

        it("serializes to JSON", () => {
            const serializedAction = new Action({
                type: Action.types.BUILDING,
                targetId: "targetId"
            }).toJSON();
            expect(serializedAction.type).to.equal(Action.types.BUILDING);
            expect(serializedAction.targetId).to.equal("targetId");
        });
    });

    describe("#idle()", () => {

        it("creates idle action", () => {
            const action = Action.idle();
            expect(action.type).to.equal(Action.types.IDLE);
            expect(action.targetId).to.be.null;
        });
    });

    describe("constructor", () => {

        it("creates building action", () => {
            const action = new Action(Action.types.BUILDING, "targetId");
            expect(action.type).to.equal(Action.types.BUILDING);
            expect(action.targetId).to.equal("targetId");
        });

        it("creates transferring action", () => {
            const action = new Action(Action.types.TRANSFERRING, "targetId");
            expect(action.type).to.equal(Action.types.TRANSFERRING);
            expect(action.targetId).to.equal("targetId");
        });

        it("creates harvesting action", () => {
            const action = new Action(Action.types.HARVESTING, "targetId");
            expect(action.type).to.equal(Action.types.HARVESTING);
            expect(action.targetId).to.equal("targetId");
        });

        it("creates idle action", () => {
            const action = new Action(Action.types.IDLE, null);
            expect(action.type).to.equal(Action.types.IDLE);
        });

        it("creates upgrading action", () => {
            const action = new Action(Action.types.UPGRADING, "targetId");
            expect(action.type).to.equal(Action.types.UPGRADING);
            expect(action.targetId).to.equal("targetId");
        });

        it("throws exception during action creation when action type is null", () => {
            expect(
                () => new Action(null, "targetId")
            ).to.throw("type can't be null");
        });

        it("throws exception during action creation when action type is undefined", () => {
            expect(() => new Action(undefined, "targetId")).to.throw("type can't be null");
        });

        it("throws exception during action creation when action type is unknown", () => {
            expect(
                () => new Action("unknown", "targetId")
            ).to.throw("unknown action type: unknown");
        });

        it("throws exception during action creation when target ID is null", () => {
            expect(
                () => new Action(Action.types.BUILDING, null)
            ).to.throw("targetId can't be null");
        });

        it("throws exception during action creation when target ID is undefined", () => {
            expect(
                () => new Action(Action.types.BUILDING, undefined)
            ).to.throw("targetId can't be null");
        });

        it("throws exception during action creation when target ID is not a string", () => {
            expect(
                () => new Action(Action.types.BUILDING, {})
            ).to.throw("targetId should be a string");
        });
    });
});



