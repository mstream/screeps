const expect = require("chai").expect;
const sinon = require("sinon");

const RoadCalculator = require("../src/class.RoadCalculator");

const stubPathFinder = () => ({
    search: () => undefined
});


describe("RoadPathGenerator", () => {

    describe("constructor", () => {

        it("throws exception during roadPathGenerator creation when pathFinder is null", () => {
            expect(() => new RoadCalculator(null)).to.throw("pathFinder can't be null");
        });

        it("throws exception during roadPathGenerator creation when pathFinder is undefined", () => {
            expect(() => new RoadCalculator(undefined)).to.throw("pathFinder can't be null");
        });

    });

    describe("#calculate", () => {

        it("throws exception during roadPathGenerator creation when from is null", () => {
            expect(() => new RoadCalculator(stubPathFinder()).calculate(
                null, {x: 1, y: 1}
            )).to.throw("from can't be null");
        });

        it("throws exception during roadPathGenerator creation when from is undefined", () => {
            expect(() => new RoadCalculator(stubPathFinder()).calculate(
                undefined, {x: 1, y: 1}
            )).to.throw("from can't be null");
        });

        it("throws exception during roadPathGenerator creation when to is null", () => {
            expect(() => new RoadCalculator(stubPathFinder()).calculate(
                {x: 0, y: 0}, null
            )).to.throw("to can't be null");
        });

        it("throws exception during roadPathGenerator creation when to is undefined", () => {
            expect(() => new RoadCalculator(stubPathFinder()).calculate(
                {x: 0, y: 0}, undefined
            )).to.throw("to can't be null");
        });

        it("calculates a path between two given cords", () => {
            const pathFinder = stubPathFinder();
            const searchSpy = sinon.spy(pathFinder, "search");
            const roadCalculator = new RoadCalculator(pathFinder);
            roadCalculator.calculate({x: 0, y: 0}, {x: 1, y: 1});
            expect(searchSpy.callCount).to.equal(1);
            expect(searchSpy.calledWith(
                sinon.match({x: 0, y: 0}),
                sinon.match([{pos: {x: 1, y: 1}, range: 1}]),
                sinon.match({maxRooms: 1, plainCost: 1, swampCost: 2})
            )).to.be.true;
        });
    });
});



