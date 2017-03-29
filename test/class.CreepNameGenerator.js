const expect = require("chai").expect;

const CreepNameGenerator = require("../src/class.CreepNameGenerator");

const bodyPartTypes = require("../src/const.bodyPartTypes");
const roles = require("../src/const.roles");


describe("CreepNameGenerator", () => {

    describe("constructor", () => {

        it("throws exception during creepNameGenerator creation when time is null", () => {
            expect(() => new CreepNameGenerator(null)).to.throw("time can't be null");
        });

        it("throws exception during creepNameGenerator creation when time is undefined", () => {
            expect(() => new CreepNameGenerator(undefined)).to.throw("time can't be null");
        });
    });

    describe("#generate", () => {

        const body = [
            bodyPartTypes.MOVE,
            bodyPartTypes.MOVE,
            bodyPartTypes.MOVE,
            bodyPartTypes.RANGED_ATTACK,
            bodyPartTypes.TOUGH,
            bodyPartTypes.WORK,
            bodyPartTypes.WORK,
            bodyPartTypes.ATTACK,
            bodyPartTypes.ATTACK,
            bodyPartTypes.CARRY,
            bodyPartTypes.CLAIM,
            bodyPartTypes.HEAL,
            bodyPartTypes.HEAL,
            bodyPartTypes.HEAL
        ];

        it("throws exception when role is null", () => {
            expect(
                () => new CreepNameGenerator(123).generate(null, body)
            ).to.throw("role can't be null");
        });

        it("throws exception when role is undefined", () => {
            expect(
                () => new CreepNameGenerator(123).generate(undefined, body)
            ).to.throw("role can't be null");
        });

        it("throws exception when role is unknown", () => {
            expect(
                () => new CreepNameGenerator(123).generate("unknown", body)
            ).to.throw("unknown role: unknown");
        });

        it("throws exception when body is null", () => {
            expect(
                () => new CreepNameGenerator(123).generate(roles.BUILDER, null)
            ).to.throw("body can't be null");
        });

        it("throws exception when body is undefined", () => {
            expect(
                () => new CreepNameGenerator(123).generate(roles.BUILDER, undefined)
            ).to.throw("body can't be null");
        });

        it("throws exception when one of the body parts unknown", () => {
            expect(
                () => new CreepNameGenerator(123).generate(roles.BUILDER, ["unknown"])
            ).to.throw("unknown bodyPart: unknown");
        });


        it("generates properly formatted name", () => {
            const creepNameGenerator = new CreepNameGenerator(123);
            const creepName = creepNameGenerator.generate(roles.BUILDER, body);
            expect(creepName).to.equal("builder_3he3mo2at2wo1ca1cl1ra1to_123");
        });
    });
});



