const expect = require("chai").expect;
const Action = require("../src/class.Action");
const actionTypes = require("../src/const.actionTypes");

describe("Action", () => {

    describe("#fromJSON()", () => {

        it("creates action from JSON", () => {
            const action = Action.fromJSON({
                type: actionTypes.BUILDING,
                targetId: "targetId"
            });
            expect(action.type).to.equal(actionTypes.BUILDING);
            expect(action.targetId).to.equal("targetId");
        })
    });

    describe("#toJSON()", () => {

        it("serializes to JSON", () => {
            const serializedAction = new Action(actionTypes.BUILDING, "targetId").toJSON();
            expect(serializedAction.type).to.equal(actionTypes.BUILDING);
            expect(serializedAction.targetId).to.equal("targetId");
        })
    });

    describe("#idle()", () => {

        it("creates idle action", () => {
            const action = Action.idle();
            expect(action.type).to.equal(actionTypes.IDLE);
            expect(action.targetId).to.be.null;
        });
    });

    describe("constructor", () => {

        it("creates building action", () => {
            const action = new Action(actionTypes.BUILDING, "targetId");
            expect(action.type).to.equal(actionTypes.BUILDING);
            expect(action.targetId).to.equal("targetId");
        });

        it("creates transferring action", () => {
            const action = new Action(actionTypes.TRANSFERRING, "targetId");
            expect(action.type).to.equal(actionTypes.TRANSFERRING);
            expect(action.targetId).to.equal("targetId");
        });

        it("creates harvesting action", () => {
            const action = new Action(actionTypes.HARVESTING, "targetId");
            expect(action.type).to.equal(actionTypes.HARVESTING);
            expect(action.targetId).to.equal("targetId");
        });

        it("creates idle action", () => {
            const action = new Action(actionTypes.IDLE, null);
            expect(action.type).to.equal(actionTypes.IDLE);
        });

        it("creates upgrading action", () => {
            const action = new Action(actionTypes.UPGRADING, "targetId");
            expect(action.type).to.equal(actionTypes.UPGRADING);
            expect(action.targetId).to.equal("targetId");
        });

        it("throws exception during action creation when action type is null", () => {
            expect(() => new Action(null, "targetId")).to.throw("type can't be null");
        });

        it("throws exception during action creation when action type is undefined", () => {
            expect(() => new Action(undefined, "targetId")).to.throw("type can't be null");
        });

        it("throws exception during action creation when action type is unknown", () => {
            expect(() => new Action("unknown", "targetId")).to.throw("unknown action type: unknown");
        });

        it("throws exception during action creation when target ID is null", () => {
            expect(() => new Action(actionTypes.BUILDING, null)).to.throw("targetId can't be null");
        });

        it("throws exception during action creation when target ID is undefined", () => {
            expect(() => new Action(actionTypes.BUILDING, undefined)).to.throw("targetId can't be null");
        });

        it("throws exception during action creation when target ID is not a string", () => {
            expect(() => new Action(actionTypes.BUILDING, {})).to.throw("targetId should be a string");
        });
    });
});



