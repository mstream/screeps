const expect = require("chai").expect;
const Path = require("../src/class.Path");


describe("Path", () => {

    describe("#fromJSON()", () => {

        it("creates path from JSON", () => {
            const path = Path.fromJSON({
                from: {
                    x: 0,
                    y: 1
                },
                to: {
                    x: 2,
                    y: 3
                }
            });
            expect(path.from.x).to.equal(0);
            expect(path.from.y).to.equal(1);
            expect(path.to.x).to.equal(2);
            expect(path.to.y).to.equal(3);
        });
    });

    describe("#toJSON()", () => {

        it("serializes to JSON", () => {
            const serializedPath = new Path(
                {
                    x: 0,
                    y: 1,
                    hash: "fromHash"
                },
                {
                    x: 2,
                    y: 3,
                    hash: "toHash"
                }
            ).toJSON();
            expect(serializedPath.from.x).to.equal(0);
            expect(serializedPath.from.y).to.equal(1);
            expect(serializedPath.to.x).to.equal(2);
            expect(serializedPath.to.y).to.equal(3);
        });
    });

    describe("#hash", () => {

        it("creates human readable hash", () => {
            const hash = new Path(
                {
                    x: 0,
                    y: 1,
                    hash: "fromHash"
                },
                {
                    x: 2,
                    y: 3,
                    hash: "toHash"
                }
            ).hash;
            expect(hash).to.equal("FROM_fromHash_TO_toHash");
        });
    });

    describe("constructor", () => {

        it("creates path", () => {
            const path = new Path(
                {
                    x: 0,
                    y: 1,
                    hash: "fromHash"
                },
                {
                    x: 2,
                    y: 3,
                    hash: "toHash"
                }
            );
            expect(path.from.x).to.equal(0);
            expect(path.from.y).to.equal(1);
            expect(path.to.x).to.equal(2);
            expect(path.to.y).to.equal(3);
        });

        it("throws exception during path creation when from is null", () => {
            expect(() => new Path(
                null,
                {
                    x: 2,
                    y: 3,
                    hash: "toHash"
                }
            )).to.throw("from can't be null");
        });

        it("throws exception during path creation when from is undefined", () => {
            expect(() => new Path(
                undefined,
                {
                    x: 1,
                    y: 2,
                    hash: "toHash"
                }
            )).to.throw("from can't be null");
        });

        it("throws exception during path creation when to is null", () => {
            expect(() => new Path(
                {
                    x: 1,
                    y: 2,
                    hash: "fromHash"
                },
                undefined
            )).to.throw("to can't be null");
        });

        it("throws exception during path creation when to is undefined", () => {
            expect(() => new Path(
                {
                    x: 2,
                    y: 3,
                    hash: "fromHash"
                },
                undefined
            )).to.throw("to can't be null");
        });

        it("throws exception during path creation when from's hash is null", () => {
            expect(() => new Path(
                {
                    x: 0,
                    y: 1,
                    hash: null
                },
                {
                    x: 2,
                    y: 3,
                    hash: "toHash"
                }
            )).to.throw("from has to have a hash");
        });

        it("throws exception during path creation when from's hash is undefined", () => {
            expect(() => new Path(
                {
                    x: 0,
                    y: 1,
                    hash: undefined
                },
                {
                    x: 2,
                    y: 3,
                    hash: "toHash"
                }
            )).to.throw("from has to have a hash");
        });

        it("throws exception during path creation when from's hash is not a string", () => {
            expect(() => new Path(
                {
                    x: 0,
                    y: 1,
                    hash: {}
                },
                {
                    x: 2,
                    y: 3,
                    hash: "toHash"
                }
            )).to.throw("from has to have a hash");
        });

        it("throws exception during path creation when to's hash is null", () => {
            expect(() => new Path(
                {
                    x: 0,
                    y: 1,
                    hash: "fromHash"
                },
                {
                    x: 2,
                    y: 3,
                    hash: null
                }
            )).to.throw("to has to have a hash");
        });

        it("throws exception during path creation when to's hash is undefined", () => {
            expect(() => new Path(
                {
                    x: 0,
                    y: 1,
                    hash: "fromHash"
                },
                {
                    x: 2,
                    y: 3,
                    hash: undefined
                }
            )).to.throw("to has to have a hash");
        });

        it("throws exception during path creation when to's hash is not a string", () => {
            expect(() => new Path(
                {
                    x: 0,
                    y: 1,
                    hash: "fromHash"
                },
                {
                    x: 2,
                    y: 3,
                    hash: {}
                }
            )).to.throw("to has to have a hash");
        });
    });
});



