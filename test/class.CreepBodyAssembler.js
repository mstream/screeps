const expect = require("chai").expect;

const CreepBodyAssembler = require("../src/class.CreepBodyAssembler");

const bodyPartTypes = require("../src/const.bodyPartTypes");
const roles = require("../src/const.roles");


describe("CreepBodyAssembler", () => {

    describe("#createBody", () => {

        it("throws an exception when the role is unknown", () => {
            expect(() => new CreepBodyAssembler().createBody("unknown")).to.throw("unknown role: unknown");
        });

        it("creates proper body for the builder role", () => {
            const body = new CreepBodyAssembler().createBody(roles.BUILDER);
            expect(body[0]).to.equal(bodyPartTypes.CARRY);
            expect(body[1]).to.equal(bodyPartTypes.MOVE);
            expect(body[2]).to.equal(bodyPartTypes.WORK);
        });

        it("creates proper body for the harvester role", () => {
            const body = new CreepBodyAssembler().createBody(roles.HARVESTER);
            expect(body[0]).to.equal(bodyPartTypes.CARRY);
            expect(body[1]).to.equal(bodyPartTypes.MOVE);
            expect(body[2]).to.equal(bodyPartTypes.WORK);
        });

        it("creates proper body for the worker role", () => {
            const body = new CreepBodyAssembler().createBody(roles.UPGRADER);
            expect(body[0]).to.equal(bodyPartTypes.CARRY);
            expect(body[1]).to.equal(bodyPartTypes.MOVE);
            expect(body[2]).to.equal(bodyPartTypes.WORK);
        });
    });
});


