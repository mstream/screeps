const expect = require("chai").expect;

const CreepNameGenerator = require("../src/class.CreepNameGenerator");

const bodyPartTypes = require("../src/const.bodyPartTypes");
const roles = require("../src/const.roles");


const stubGame = (time) => ({time});


describe("CreepNameGenerator", () => {

    describe("constructor", () => {

        it("throws exception when gameProvider is null", () => {
            expect(
                () => new CreepNameGenerator({
                    gameProvider: null
                })
            ).to.throw("gameProvider can't be null");
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
            const gameProvider = stubGame(0);
            expect(
                () => new CreepNameGenerator({gameProvider}).generate(null, body)
            ).to.throw("role can't be null");
        });

        it("throws exception when role is unknown", () => {
            const gameProvider = stubGame(0);
            expect(
                () => new CreepNameGenerator({gameProvider}).generate("unknown", body)
            ).to.throw("unknown role: unknown");
        });

        it("throws exception when body is null", () => {
            const gameProvider = stubGame(0);
            expect(
                () => new CreepNameGenerator({gameProvider}).generate(roles.WORKER, null)
            ).to.throw("body can't be null");
        });

        it("throws exception when one of the body parts unknown", () => {
            const gameProvider = stubGame(0);
            expect(
                () => new CreepNameGenerator({gameProvider}).generate(roles.WORKER, ["unknown"])
            ).to.throw("unknown bodyPart: unknown");
        });

        it("generates properly formatted name", () => {
            const gameProvider = stubGame(123);
            const creepNameGenerator = new CreepNameGenerator({gameProvider});
            const creepName = creepNameGenerator.generate(roles.WORKER, body);
            expect(creepName).to.equal("worker_3he3mo2at2wo1ca1cl1ra1to_123");
        });
    });
});



