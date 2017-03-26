const expect = require("chai").expect;
const Cord = require("../src/class.Cord");


describe("Cord", () => {

    describe("#fromJSON()", () => {

        it("creates cord from JSON", () => {
            const cord = Cord.fromJSON({
                x: 0,
                y: 1
            });
            expect(cord.x).to.equal(0);
            expect(cord.y).to.equal(1);
        });
    });

    describe("#fromPos()", () => {

        it("creates cord from Pos", () => {
            const cord = Cord.fromPos({
                x: 0,
                y: 1
            });
            expect(cord.x).to.equal(0);
            expect(cord.y).to.equal(1);
        });
    });

    describe("#toJSON()", () => {

        it("serializes to JSON", () => {
            const serializedCord = new Cord(0, 1).toJSON();
            expect(serializedCord.x).to.equal(0);
            expect(serializedCord.y).to.equal(1);
        });
    });

    describe("#hash", () => {

        it("creates human readable hash", () => {
            const hash = new Cord(0, 1).hash;
            expect(hash).to.equal("(0,1)");
        });
    });

    describe("constructor", () => {

        it("creates cord", () => {
            const cord = new Cord(0, 1);
            expect(cord.x).to.equal(0);
            expect(cord.y).to.equal(1);
        });

        it("throws exception during cord creation when x is null", () => {
            expect(() => new Cord(null, 1)).to.throw("x can't be null");
        });

        it("throws exception during cord creation when x is undefined", () => {
            expect(() => new Cord(undefined, 1)).to.throw("x can't be null");
        });

        it("throws exception during cord creation when x is not a number", () => {
            expect(() => new Cord("0", 1)).to.throw("x has to be a number");
        });

        it("throws exception during cord creation when y is null", () => {
            expect(() => new Cord(0, null)).to.throw("y can't be null");
        });

        it("throws exception during cord creation when y is undefined", () => {
            expect(() => new Cord(0, undefined)).to.throw("y can't be null");
        });

        it("throws exception during cord creation when y is not a number", () => {
            expect(() => new Cord(0, "1")).to.throw("y has to be a number");
        });
    });
});



