const expect = require("chai").expect;

const ExtensionsCalculator = require("../src/class.ExtensionsCalculator");
const obstacleTypes = require("../src/const.obstacleTypes");


describe("ExtensionsCalculator", () => {

    describe("constructor", () => {

        it("throws exception during extensionsCalculator creation when room is null", () => {
            expect(() => new ExtensionsCalculator(null)).to.throw("room can't be null");
        });

        it("throws exception during extensionsCalculator creation when room is undefined", () => {
            expect(() => new ExtensionsCalculator(undefined)).to.throw("room can't be null");
        });
    });

    describe("#calculate", () => {

        it("returns empty array when quantity is zero", () => {
            const objects = {};
            const room = {
                size: 20,
                sources: [
                    {pos: {x: 10, y: 10}}
                ],
                findObjectsAt: (x, y) => {
                    const object = objects[y][x];
                    expect(object).to.be.ok;
                    return object;
                }
            };
            const extensionsCalculator = new ExtensionsCalculator(room);
            const extensions = extensionsCalculator.calculate(0);
            expect(extensions.length).to.equal(0);
        });

        it("returns extension positions for a single source", () => {
            const objects = {
                6: {
                    6: [],
                    8: [obstacleTypes.WALL],
                    10: [obstacleTypes.WALL],
                    12: [obstacleTypes.WALL],
                    14: [obstacleTypes.WALL]
                },
                8: {
                    6: [obstacleTypes.WALL],
                    8: [obstacleTypes.WALL],
                    10: [obstacleTypes.WALL],
                    12: [obstacleTypes.WALL],
                    14: [obstacleTypes.WALL]
                },
                10: {
                    6: [obstacleTypes.WALL],
                    8: [],
                    12: [],
                    14: [obstacleTypes.WALL]
                },
                12: {
                    6: [obstacleTypes.WALL],
                    8: [obstacleTypes.WALL],
                    10: [obstacleTypes.WALL],
                    12: [obstacleTypes.WALL],
                    14: [obstacleTypes.WALL]
                },
                14: {
                    6: [obstacleTypes.WALL],
                    8: [obstacleTypes.WALL],
                    10: [obstacleTypes.WALL],
                    12: [obstacleTypes.WALL],
                    14: []
                }
            };
            const room = {
                size: 10,
                sources: [
                    {pos: {x: 10, y: 10}}
                ],
                findObjectsAt: (x, y) => {
                    const object = objects[y][x];
                    expect(object, `findObjectsAt(${x}, ${y})`).to.be.ok;
                    return object;
                }
            };
            const extensionsCalculator = new ExtensionsCalculator(room);
            const extensions = extensionsCalculator.calculate(3);
            expect(extensions.length).to.equal(3);
            expect(extensions[0].x).to.equal(12);
            expect(extensions[0].y).to.equal(10);
            expect(extensions[1].x).to.equal(8);
            expect(extensions[1].y).to.equal(10);
            expect(extensions[2].x).to.equal(6);
            expect(extensions[2].y).to.equal(6);
        });

        it("returns extension positions for a multiple sources", () => {
            const objects = {
                6: {
                    6: [],
                    8: [obstacleTypes.WALL],
                    10: [obstacleTypes.WALL],
                    12: [obstacleTypes.WALL],
                    14: [obstacleTypes.WALL]
                },
                8: {
                    6: [obstacleTypes.WALL],
                    8: [obstacleTypes.WALL],
                    10: [obstacleTypes.WALL],
                    12: [obstacleTypes.WALL],
                    14: [obstacleTypes.WALL]
                },
                10: {
                    6: [obstacleTypes.WALL],
                    8: [],
                    12: [],
                    14: [obstacleTypes.WALL]
                },
                12: {
                    6: [obstacleTypes.WALL],
                    8: [obstacleTypes.WALL],
                    10: [obstacleTypes.WALL],
                    12: [obstacleTypes.WALL],
                    14: [obstacleTypes.WALL]
                },
                14: {
                    6: [obstacleTypes.WALL],
                    8: [obstacleTypes.WALL],
                    10: [obstacleTypes.WALL],
                    12: [obstacleTypes.WALL],
                    14: []
                },
                16: {
                    16: [],
                    18: [obstacleTypes.WALL],
                    20: [obstacleTypes.WALL],
                    22: [obstacleTypes.WALL],
                    24: [obstacleTypes.WALL]
                },
                18: {
                    16: [obstacleTypes.WALL],
                    18: [obstacleTypes.WALL],
                    20: [obstacleTypes.WALL],
                    22: [obstacleTypes.WALL],
                    24: [obstacleTypes.WALL]
                },
                20: {
                    16: [obstacleTypes.WALL],
                    18: [],
                    22: [],
                    24: [obstacleTypes.WALL]
                },
                22: {
                    16: [obstacleTypes.WALL],
                    18: [obstacleTypes.WALL],
                    20: [obstacleTypes.WALL],
                    22: [obstacleTypes.WALL],
                    24: [obstacleTypes.WALL]
                },
                24: {
                    16: [obstacleTypes.WALL],
                    18: [obstacleTypes.WALL],
                    20: [obstacleTypes.WALL],
                    22: [obstacleTypes.WALL],
                    24: []
                }
            };
            const room = {
                size: 30,
                sources: [
                    {pos: {x: 10, y: 10}},
                    {pos: {x: 20, y: 20}}
                ],
                findObjectsAt: (x, y) => {
                    const object = objects[y][x];
                    expect(object, `findObjectsAt(${x}, ${y})`).to.be.ok;
                    return object;
                }
            };
            const extensionsCalculator = new ExtensionsCalculator(room);
            const extensions = extensionsCalculator.calculate(6);
            expect(extensions.length).to.equal(6);
            expect(extensions[0].x).to.equal(12);
            expect(extensions[0].y).to.equal(10);
            expect(extensions[1].x).to.equal(22);
            expect(extensions[1].y).to.equal(20);
            expect(extensions[2].x).to.equal(8);
            expect(extensions[2].y).to.equal(10);
            expect(extensions[3].x).to.equal(18);
            expect(extensions[3].y).to.equal(20);
            expect(extensions[4].x).to.equal(6);
            expect(extensions[4].y).to.equal(6);
            expect(extensions[5].x).to.equal(16);
            expect(extensions[5].y).to.equal(16);
        });
    });
});



