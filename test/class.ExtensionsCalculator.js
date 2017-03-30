const expect = require("chai").expect;

const lookTypes = require("../src/const.lookTypes");

const ExtensionsCalculator = require("../src/class.ExtensionsCalculator");


describe("ExtensionsCalculator", () => {

    describe("#calculate", () => {

        it("throws exception when room is null", () => {
            expect(
                () => new ExtensionsCalculator().calculate(null, 1)
            ).to.throw("room can't be null");
        });

        it("throws exception when room is undefined", () => {
            expect(
                () => new ExtensionsCalculator().calculate(undefined, 1)
            ).to.throw("room can't be null");
        });

        it("returns empty array when quantity is zero", () => {
            const objects = {};
            const room = {
                size: 20,
                sources: [{type: lookTypes.TERRAIN, terrain: "plain"},
                    {pos: {x: 10, y: 10}}
                ],
                findObjectsAt: (x, y) => {
                    const object = objects[y][x];
                    expect(object).to.be.ok;
                    return object;
                }
            };
            const extensionsCalculator = new ExtensionsCalculator();
            const extensions = extensionsCalculator.calculate(room, 0);
            expect(extensions.length).to.equal(0);
        });

        it("returns extension positions for a single source where the obstacles are walls", () => {
            const objects = {
                6: {
                    6: [{type: lookTypes.TERRAIN, terrain: "plain"}],
                    8: [{
                        type: lookTypes.TERRAIN,
                        terrain: "plain"
                    }, {type: lookTypes.STRUCTURE}],
                    10: [{
                        type: lookTypes.TERRAIN,
                        terrain: "plain"
                    }, {type: lookTypes.STRUCTURE}],
                    12: [{
                        type: lookTypes.TERRAIN,
                        terrain: "plain"
                    }, {type: lookTypes.STRUCTURE}],
                    14: [{
                        type: lookTypes.TERRAIN,
                        terrain: "plain"
                    }, {type: lookTypes.STRUCTURE}]
                },
                8: {
                    6: [{
                        type: lookTypes.TERRAIN,
                        terrain: "plain"
                    }, {type: lookTypes.STRUCTURE}],
                    8: [{
                        type: lookTypes.TERRAIN,
                        terrain: "plain"
                    }, {type: lookTypes.STRUCTURE}],
                    10: [{
                        type: lookTypes.TERRAIN,
                        terrain: "plain"
                    }, {type: lookTypes.STRUCTURE}],
                    12: [{
                        type: lookTypes.TERRAIN,
                        terrain: "plain"
                    }, {type: lookTypes.STRUCTURE}],
                    14: [{
                        type: lookTypes.TERRAIN,
                        terrain: "plain"
                    }, {type: lookTypes.STRUCTURE}]
                },
                10: {
                    6: [{
                        type: lookTypes.TERRAIN,
                        terrain: "plain"
                    }, {type: lookTypes.STRUCTURE}],
                    8: [{type: lookTypes.TERRAIN, terrain: "plain"}],
                    12: [{type: lookTypes.TERRAIN, terrain: "plain"}],
                    14: [{
                        type: lookTypes.TERRAIN,
                        terrain: "plain"
                    }, {type: lookTypes.STRUCTURE}]
                },
                12: {
                    6: [{
                        type: lookTypes.TERRAIN,
                        terrain: "plain"
                    }, {type: lookTypes.STRUCTURE}],
                    8: [{
                        type: lookTypes.TERRAIN,
                        terrain: "plain"
                    }, {type: lookTypes.STRUCTURE}],
                    10: [{
                        type: lookTypes.TERRAIN,
                        terrain: "plain"
                    }, {type: lookTypes.STRUCTURE}],
                    12: [{
                        type: lookTypes.TERRAIN,
                        terrain: "plain"
                    }, {type: lookTypes.STRUCTURE}],
                    14: [{
                        type: lookTypes.TERRAIN,
                        terrain: "plain"
                    }, {type: lookTypes.STRUCTURE}]
                },
                14: {
                    6: [{
                        type: lookTypes.TERRAIN,
                        terrain: "plain"
                    }, {type: lookTypes.STRUCTURE}],
                    8: [{
                        type: lookTypes.TERRAIN,
                        terrain: "plain"
                    }, {type: lookTypes.STRUCTURE}],
                    10: [{
                        type: lookTypes.TERRAIN,
                        terrain: "plain"
                    }, {type: lookTypes.STRUCTURE}],
                    12: [{
                        type: lookTypes.TERRAIN,
                        terrain: "plain"
                    }, {type: lookTypes.STRUCTURE}],
                    14: [{type: lookTypes.TERRAIN, terrain: "plain"}]
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
            const extensionsCalculator = new ExtensionsCalculator();
            const extensions = extensionsCalculator.calculate(room, 3);
            expect(extensions.length).to.equal(3);
            expect(extensions[0].x).to.equal(12);
            expect(extensions[0].y).to.equal(10);
            expect(extensions[1].x).to.equal(8);
            expect(extensions[1].y).to.equal(10);
            expect(extensions[2].x).to.equal(6);
            expect(extensions[2].y).to.equal(6);
        });

        it("returns extension positions for a single source where the obstacles are structures", () => {
            const objects = {
                6: {
                    6: [
                        {type: lookTypes.TERRAIN, terrain: "plain"}
                    ],
                    8: [
                        {type: lookTypes.TERRAIN, terrain: "plain"},
                        {type: lookTypes.STRUCTURE}
                    ],
                    10: [
                        {type: lookTypes.TERRAIN, terrain: "plain"},
                        {type: lookTypes.STRUCTURE}
                    ],
                    12: [
                        {type: lookTypes.TERRAIN, terrain: "plain"},
                        {type: lookTypes.STRUCTURE}
                    ],
                    14: [
                        {type: lookTypes.TERRAIN, terrain: "plain"},
                        {type: lookTypes.STRUCTURE}
                    ]
                },
                8: {
                    6: [
                        {type: lookTypes.TERRAIN, terrain: "plain"},
                        {type: lookTypes.STRUCTURE}
                    ],
                    8: [
                        {type: lookTypes.TERRAIN, terrain: "plain"},
                        {type: lookTypes.STRUCTURE}
                    ],
                    10: [
                        {type: lookTypes.TERRAIN, terrain: "plain"},
                        {type: lookTypes.STRUCTURE}
                    ],
                    12: [
                        {type: lookTypes.TERRAIN, terrain: "plain"},
                        {type: lookTypes.STRUCTURE}
                    ],
                    14: [
                        {type: lookTypes.TERRAIN, terrain: "plain"},
                        {type: lookTypes.STRUCTURE}
                    ]
                },
                10: {
                    6: [
                        {type: lookTypes.TERRAIN, terrain: "plain"},
                        {type: lookTypes.STRUCTURE}
                    ],
                    8: [
                        {type: lookTypes.TERRAIN, terrain: "plain"}
                    ],
                    12: [
                        {type: lookTypes.TERRAIN, terrain: "plain"}
                    ],
                    14: [
                        {type: lookTypes.TERRAIN, terrain: "plain"},
                        {type: lookTypes.STRUCTURE}
                    ]
                },
                12: {
                    6: [
                        {type: lookTypes.TERRAIN, terrain: "plain"},
                        {type: lookTypes.STRUCTURE}
                    ],
                    8: [
                        {type: lookTypes.TERRAIN, terrain: "plain"},
                        {type: lookTypes.STRUCTURE}
                    ],
                    10: [
                        {type: lookTypes.TERRAIN, terrain: "plain"},
                        {type: lookTypes.STRUCTURE}
                    ],
                    12: [
                        {type: lookTypes.TERRAIN, terrain: "plain"},
                        {type: lookTypes.STRUCTURE}
                    ],
                    14: [
                        {type: lookTypes.TERRAIN, terrain: "plain"},
                        {type: lookTypes.STRUCTURE}
                    ]
                },
                14: {
                    6: [
                        {type: lookTypes.TERRAIN, terrain: "plain"},
                        {type: lookTypes.STRUCTURE}
                    ],
                    8: [
                        {type: lookTypes.TERRAIN, terrain: "plain"},
                        {type: lookTypes.STRUCTURE}
                    ],
                    10: [
                        {type: lookTypes.TERRAIN, terrain: "plain"},
                        {type: lookTypes.STRUCTURE}
                    ],
                    12: [
                        {type: lookTypes.TERRAIN, terrain: "plain"},
                        {type: lookTypes.STRUCTURE}
                    ],
                    14: [
                        {type: lookTypes.TERRAIN, terrain: "plain"}
                    ]
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
            const extensionsCalculator = new ExtensionsCalculator();
            const extensions = extensionsCalculator.calculate(room, 3);
            expect(extensions.length).to.equal(3);
            expect(extensions[0].x).to.equal(12);
            expect(extensions[0].y).to.equal(10);
            expect(extensions[1].x).to.equal(8);
            expect(extensions[1].y).to.equal(10);
            expect(extensions[2].x).to.equal(6);
            expect(extensions[2].y).to.equal(6);
        });

        it("returns extension positions for a single source where the obstacles are construction sites", () => {
            const objects = {
                6: {
                    6: [
                        {type: lookTypes.TERRAIN, terrain: "plain"}
                    ],
                    8: [
                        {type: lookTypes.TERRAIN, terrain: "plain"},
                        {type: lookTypes.CONSTRUCTION_SITE}
                    ],
                    10: [
                        {type: lookTypes.TERRAIN, terrain: "plain"},
                        {type: lookTypes.CONSTRUCTION_SITE}
                    ],
                    12: [
                        {type: lookTypes.TERRAIN, terrain: "plain"},
                        {type: lookTypes.CONSTRUCTION_SITE}
                    ],
                    14: [
                        {type: lookTypes.TERRAIN, terrain: "plain"},
                        {type: lookTypes.CONSTRUCTION_SITE}
                    ]
                },
                8: {
                    6: [
                        {type: lookTypes.TERRAIN, terrain: "plain"},
                        {type: lookTypes.CONSTRUCTION_SITE}
                    ],
                    8: [
                        {type: lookTypes.TERRAIN, terrain: "plain"},
                        {type: lookTypes.CONSTRUCTION_SITE}
                    ],
                    10: [
                        {type: lookTypes.TERRAIN, terrain: "plain"},
                        {type: lookTypes.CONSTRUCTION_SITE}
                    ],
                    12: [
                        {type: lookTypes.TERRAIN, terrain: "plain"},
                        {type: lookTypes.CONSTRUCTION_SITE}
                    ],
                    14: [
                        {type: lookTypes.TERRAIN, terrain: "plain"},
                        {type: lookTypes.CONSTRUCTION_SITE}
                    ]
                },
                10: {
                    6: [
                        {type: lookTypes.TERRAIN, terrain: "plain"},
                        {type: lookTypes.CONSTRUCTION_SITE}
                    ],
                    8: [
                        {type: lookTypes.TERRAIN, terrain: "plain"}
                    ],
                    12: [
                        {type: lookTypes.TERRAIN, terrain: "plain"}
                    ],
                    14: [
                        {type: lookTypes.TERRAIN, terrain: "plain"},
                        {type: lookTypes.CONSTRUCTION_SITE}
                    ]
                },
                12: {
                    6: [
                        {type: lookTypes.TERRAIN, terrain: "plain"},
                        {type: lookTypes.CONSTRUCTION_SITE}
                    ],
                    8: [
                        {type: lookTypes.TERRAIN, terrain: "plain"},
                        {type: lookTypes.CONSTRUCTION_SITE}
                    ],
                    10: [
                        {type: lookTypes.TERRAIN, terrain: "plain"},
                        {type: lookTypes.CONSTRUCTION_SITE}
                    ],
                    12: [
                        {type: lookTypes.TERRAIN, terrain: "plain"},
                        {type: lookTypes.CONSTRUCTION_SITE}
                    ],
                    14: [
                        {type: lookTypes.TERRAIN, terrain: "plain"},
                        {type: lookTypes.CONSTRUCTION_SITE}
                    ]
                },
                14: {
                    6: [
                        {type: lookTypes.TERRAIN, terrain: "plain"},
                        {type: lookTypes.CONSTRUCTION_SITE}
                    ],
                    8: [
                        {type: lookTypes.TERRAIN, terrain: "plain"},
                        {type: lookTypes.CONSTRUCTION_SITE}
                    ],
                    10: [
                        {type: lookTypes.TERRAIN, terrain: "plain"},
                        {type: lookTypes.CONSTRUCTION_SITE}
                    ],
                    12: [
                        {type: lookTypes.TERRAIN, terrain: "plain"},
                        {type: lookTypes.CONSTRUCTION_SITE}
                    ],
                    14: [
                        {type: lookTypes.TERRAIN, terrain: "plain"}
                    ]
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
            const extensionsCalculator = new ExtensionsCalculator();
            const extensions = extensionsCalculator.calculate(room, 3);
            expect(extensions.length).to.equal(3);
            expect(extensions[0].x).to.equal(12);
            expect(extensions[0].y).to.equal(10);
            expect(extensions[1].x).to.equal(8);
            expect(extensions[1].y).to.equal(10);
            expect(extensions[2].x).to.equal(6);
            expect(extensions[2].y).to.equal(6);
        });

        it("returns extension positions for a single source where the obstacles are sourcess", () => {
            const objects = {
                6: {
                    6: [
                        {type: lookTypes.TERRAIN, terrain: "plain"}
                    ],
                    8: [
                        {type: lookTypes.TERRAIN, terrain: "plain"},
                        {type: lookTypes.SOURCE}
                    ],
                    10: [
                        {type: lookTypes.TERRAIN, terrain: "plain"},
                        {type: lookTypes.SOURCE}
                    ],
                    12: [
                        {type: lookTypes.TERRAIN, terrain: "plain"},
                        {type: lookTypes.SOURCE}
                    ],
                    14: [
                        {type: lookTypes.TERRAIN, terrain: "plain"},
                        {type: lookTypes.SOURCE}
                    ]
                },
                8: {
                    6: [
                        {type: lookTypes.TERRAIN, terrain: "plain"},
                        {type: lookTypes.SOURCE}
                    ],
                    8: [
                        {type: lookTypes.TERRAIN, terrain: "plain"},
                        {type: lookTypes.SOURCE}
                    ],
                    10: [
                        {type: lookTypes.TERRAIN, terrain: "plain"},
                        {type: lookTypes.SOURCE}
                    ],
                    12: [
                        {type: lookTypes.TERRAIN, terrain: "plain"},
                        {type: lookTypes.SOURCE}
                    ],
                    14: [
                        {type: lookTypes.TERRAIN, terrain: "plain"},
                        {type: lookTypes.SOURCE}
                    ]
                },
                10: {
                    6: [
                        {type: lookTypes.TERRAIN, terrain: "plain"},
                        {type: lookTypes.SOURCE}
                    ],
                    8: [
                        {type: lookTypes.TERRAIN, terrain: "plain"}
                    ],
                    12: [
                        {type: lookTypes.TERRAIN, terrain: "plain"}
                    ],
                    14: [
                        {type: lookTypes.TERRAIN, terrain: "plain"},
                        {type: lookTypes.SOURCE}
                    ]
                },
                12: {
                    6: [
                        {type: lookTypes.TERRAIN, terrain: "plain"},
                        {type: lookTypes.SOURCE}
                    ],
                    8: [
                        {type: lookTypes.TERRAIN, terrain: "plain"},
                        {type: lookTypes.SOURCE}
                    ],
                    10: [
                        {type: lookTypes.TERRAIN, terrain: "plain"},
                        {type: lookTypes.SOURCE}
                    ],
                    12: [
                        {type: lookTypes.TERRAIN, terrain: "plain"},
                        {type: lookTypes.SOURCE}
                    ],
                    14: [
                        {type: lookTypes.TERRAIN, terrain: "plain"},
                        {type: lookTypes.SOURCE}
                    ]
                },
                14: {
                    6: [
                        {type: lookTypes.TERRAIN, terrain: "plain"},
                        {type: lookTypes.SOURCE}
                    ],
                    8: [
                        {type: lookTypes.TERRAIN, terrain: "plain"},
                        {type: lookTypes.SOURCE}
                    ],
                    10: [
                        {type: lookTypes.TERRAIN, terrain: "plain"},
                        {type: lookTypes.SOURCE}
                    ],
                    12: [
                        {type: lookTypes.TERRAIN, terrain: "plain"},
                        {type: lookTypes.SOURCE}
                    ],
                    14: [
                        {type: lookTypes.TERRAIN, terrain: "plain"}
                    ]
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
            const extensionsCalculator = new ExtensionsCalculator();
            const extensions = extensionsCalculator.calculate(room, 3);
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
                    6: [{type: lookTypes.TERRAIN, terrain: "plain"}],
                    8: [{
                        type: lookTypes.TERRAIN,
                        terrain: "plain"
                    }, {type: lookTypes.STRUCTURE}],
                    10: [{
                        type: lookTypes.TERRAIN,
                        terrain: "plain"
                    }, {type: lookTypes.STRUCTURE}],
                    12: [{
                        type: lookTypes.TERRAIN,
                        terrain: "plain"
                    }, {type: lookTypes.STRUCTURE}],
                    14: [{
                        type: lookTypes.TERRAIN,
                        terrain: "plain"
                    }, {type: lookTypes.STRUCTURE}]
                },
                8: {
                    6: [{
                        type: lookTypes.TERRAIN,
                        terrain: "plain"
                    }, {type: lookTypes.STRUCTURE}],
                    8: [{
                        type: lookTypes.TERRAIN,
                        terrain: "plain"
                    }, {type: lookTypes.STRUCTURE}],
                    10: [{
                        type: lookTypes.TERRAIN,
                        terrain: "plain"
                    }, {type: lookTypes.STRUCTURE}],
                    12: [{
                        type: lookTypes.TERRAIN,
                        terrain: "plain"
                    }, {type: lookTypes.STRUCTURE}],
                    14: [{
                        type: lookTypes.TERRAIN,
                        terrain: "plain"
                    }, {type: lookTypes.STRUCTURE}]
                },
                10: {
                    6: [{
                        type: lookTypes.TERRAIN,
                        terrain: "plain"
                    }, {type: lookTypes.STRUCTURE}],
                    8: [{type: lookTypes.TERRAIN, terrain: "plain"}],
                    12: [{type: lookTypes.TERRAIN, terrain: "plain"}],
                    14: [{
                        type: lookTypes.TERRAIN,
                        terrain: "plain"
                    }, {type: lookTypes.STRUCTURE}]
                },
                12: {
                    6: [{
                        type: lookTypes.TERRAIN,
                        terrain: "plain"
                    }, {type: lookTypes.STRUCTURE}],
                    8: [{
                        type: lookTypes.TERRAIN,
                        terrain: "plain"
                    }, {type: lookTypes.STRUCTURE}],
                    10: [{
                        type: lookTypes.TERRAIN,
                        terrain: "plain"
                    }, {type: lookTypes.STRUCTURE}],
                    12: [{
                        type: lookTypes.TERRAIN,
                        terrain: "plain"
                    }, {type: lookTypes.STRUCTURE}],
                    14: [{
                        type: lookTypes.TERRAIN,
                        terrain: "plain"
                    }, {type: lookTypes.STRUCTURE}]
                },
                14: {
                    6: [{
                        type: lookTypes.TERRAIN,
                        terrain: "plain"
                    }, {type: lookTypes.STRUCTURE}],
                    8: [{
                        type: lookTypes.TERRAIN,
                        terrain: "plain"
                    }, {type: lookTypes.STRUCTURE}],
                    10: [{
                        type: lookTypes.TERRAIN,
                        terrain: "plain"
                    }, {type: lookTypes.STRUCTURE}],
                    12: [{
                        type: lookTypes.TERRAIN,
                        terrain: "plain"
                    }, {type: lookTypes.STRUCTURE}],
                    14: [{type: lookTypes.TERRAIN, terrain: "plain"},]
                },
                16: {
                    16: [{type: lookTypes.TERRAIN, terrain: "plain"}],
                    18: [{
                        type: lookTypes.TERRAIN,
                        terrain: "plain"
                    }, {type: lookTypes.STRUCTURE}],
                    20: [{
                        type: lookTypes.TERRAIN,
                        terrain: "plain"
                    }, {type: lookTypes.STRUCTURE}],
                    22: [{
                        type: lookTypes.TERRAIN,
                        terrain: "plain"
                    }, {type: lookTypes.STRUCTURE}],
                    24: [{
                        type: lookTypes.TERRAIN,
                        terrain: "plain"
                    }, {type: lookTypes.STRUCTURE}]
                },
                18: {
                    16: [{
                        type: lookTypes.TERRAIN,
                        terrain: "plain"
                    }, {type: lookTypes.STRUCTURE}],
                    18: [{
                        type: lookTypes.TERRAIN,
                        terrain: "plain"
                    }, {type: lookTypes.STRUCTURE}],
                    20: [{
                        type: lookTypes.TERRAIN,
                        terrain: "plain"
                    }, {type: lookTypes.STRUCTURE}],
                    22: [{
                        type: lookTypes.TERRAIN,
                        terrain: "plain"
                    }, {type: lookTypes.STRUCTURE}],
                    24: [{
                        type: lookTypes.TERRAIN,
                        terrain: "plain"
                    }, {type: lookTypes.STRUCTURE}]
                },
                20: {
                    16: [{
                        type: lookTypes.TERRAIN,
                        terrain: "plain"
                    }, {type: lookTypes.STRUCTURE}],
                    18: [{type: lookTypes.TERRAIN, terrain: "plain"}],
                    22: [{type: lookTypes.TERRAIN, terrain: "plain"}],
                    24: [{
                        type: lookTypes.TERRAIN,
                        terrain: "plain"
                    }, {type: lookTypes.STRUCTURE}]
                },
                22: {
                    16: [{
                        type: lookTypes.TERRAIN,
                        terrain: "plain"
                    }, {type: lookTypes.STRUCTURE}],
                    18: [{
                        type: lookTypes.TERRAIN,
                        terrain: "plain"
                    }, {type: lookTypes.STRUCTURE}],
                    20: [{
                        type: lookTypes.TERRAIN,
                        terrain: "plain"
                    }, {type: lookTypes.STRUCTURE}],
                    22: [{
                        type: lookTypes.TERRAIN,
                        terrain: "plain"
                    }, {type: lookTypes.STRUCTURE}],
                    24: [{
                        type: lookTypes.TERRAIN,
                        terrain: "plain"
                    }, {type: lookTypes.STRUCTURE}]
                },
                24: {
                    16: [{
                        type: lookTypes.TERRAIN,
                        terrain: "plain"
                    }, {type: lookTypes.STRUCTURE}],
                    18: [{
                        type: lookTypes.TERRAIN,
                        terrain: "plain"
                    }, {type: lookTypes.STRUCTURE}],
                    20: [{
                        type: lookTypes.TERRAIN,
                        terrain: "plain"
                    }, {type: lookTypes.STRUCTURE}],
                    22: [{
                        type: lookTypes.TERRAIN,
                        terrain: "plain"
                    }, {type: lookTypes.STRUCTURE}],
                    24: [{type: lookTypes.TERRAIN, terrain: "plain"}]
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
            const extensionsCalculator = new ExtensionsCalculator();
            const extensions = extensionsCalculator.calculate(room, 6);
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



