const expect = require("chai").expect;

const ExitsCalculator = require("../src/class.ExitsCalculator");
const lookTypes = require("../src/const.lookTypes");
const obstacleTypes = require("../src/const.obstacleTypes");


describe("ExitsCalculator", () => {

    describe("constructor", () => {

        it("throws exception during exitsCalculator creation when room is null", () => {
            expect(() => new ExitsCalculator(null)).to.throw("room can't be null");
        });

        it("throws exception during exitsCalculator creation when room is undefined", () => {
            expect(() => new ExitsCalculator(undefined)).to.throw("room can't be null");
        });
    });

    describe("#calculateTopExits", () => {

        it("returns empty array when there are no exits", () => {
            const room = {
                size: 10,
                findObjectsInArea: (type, top, left, bottom, right) => {
                    expect(type).to.equal(lookTypes.TERRAIN);
                    expect(top).to.equal(0);
                    expect(left).to.equal(0);
                    expect(bottom).to.equal(0);
                    expect(right).to.equal(9);
                    return {
                        0: {
                            0: [obstacleTypes.WALL],
                            1: [obstacleTypes.WALL],
                            2: [obstacleTypes.WALL],
                            3: [obstacleTypes.WALL],
                            4: [obstacleTypes.WALL],
                            5: [obstacleTypes.WALL],
                            6: [obstacleTypes.WALL],
                            7: [obstacleTypes.WALL],
                            8: [obstacleTypes.WALL],
                            9: [obstacleTypes.WALL]
                        }
                    };
                }
            };
            const exitsCalculator = new ExitsCalculator(room);
            const exits = exitsCalculator.calculateTopExits();
            expect(exits.length).to.equal(0);
        });

        it("returns one exit when there is one exit", () => {
            const room = {
                size: 10,
                findObjectsInArea: (type, top, left, bottom, right) => {
                    expect(type).to.equal(lookTypes.TERRAIN);
                    expect(top).to.equal(0);
                    expect(left).to.equal(0);
                    expect(bottom).to.equal(0);
                    expect(right).to.equal(9);
                    return {
                        0: {
                            0: [obstacleTypes.WALL],
                            1: [obstacleTypes.WALL],
                            2: [obstacleTypes.WALL],
                            3: [obstacleTypes.WALL],
                            4: undefined,
                            5: undefined,
                            6: [obstacleTypes.WALL],
                            7: [obstacleTypes.WALL],
                            8: [obstacleTypes.WALL],
                            9: [obstacleTypes.WALL]
                        }
                    };
                }
            };
            const exitsCalculator = new ExitsCalculator(room);
            const exits = exitsCalculator.calculateTopExits();
            expect(exits.length).to.equal(1);
            expect(exits[0].from.x).to.equal(4);
            expect(exits[0].from.y).to.equal(0);
            expect(exits[0].to.x).to.equal(5);
            expect(exits[0].to.y).to.equal(0);
        });

        it("returns one exit when there is one exit from edge to edge", () => {
            const room = {
                size: 10,
                findObjectsInArea: (type, top, left, bottom, right) => {
                    expect(type).to.equal(lookTypes.TERRAIN);
                    expect(top).to.equal(0);
                    expect(left).to.equal(0);
                    expect(bottom).to.equal(0);
                    expect(right).to.equal(9);
                    return {
                        0: {
                            0: undefined,
                            1: undefined,
                            2: undefined,
                            3: undefined,
                            4: undefined,
                            5: undefined,
                            6: undefined,
                            7: undefined,
                            8: undefined,
                            9: undefined
                        }
                    };
                }
            };
            const exitsCalculator = new ExitsCalculator(room);
            const exits = exitsCalculator.calculateTopExits();
            expect(exits.length).to.equal(1);
            expect(exits[0].from.x).to.equal(0);
            expect(exits[0].from.y).to.equal(0);
            expect(exits[0].to.x).to.equal(9);
            expect(exits[0].to.y).to.equal(0);
        });

        it("returns two exits when there are two exits", () => {
            const room = {
                size: 10,
                findObjectsInArea: (type, top, left, bottom, right) => {
                    expect(type).to.equal(lookTypes.TERRAIN);
                    expect(top).to.equal(0);
                    expect(left).to.equal(0);
                    expect(bottom).to.equal(0);
                    expect(right).to.equal(9);
                    return {
                        0: {
                            0: [obstacleTypes.WALL],
                            1: [obstacleTypes.WALL],
                            2: undefined,
                            3: undefined,
                            4: [obstacleTypes.WALL],
                            5: [obstacleTypes.WALL],
                            6: undefined,
                            7: undefined,
                            8: [obstacleTypes.WALL],
                            9: [obstacleTypes.WALL]
                        }
                    };
                }
            };
            const exitsCalculator = new ExitsCalculator(room);
            const exits = exitsCalculator.calculateTopExits();
            expect(exits.length).to.equal(2);
            expect(exits[0].from.x).to.equal(2);
            expect(exits[0].from.y).to.equal(0);
            expect(exits[0].to.x).to.equal(3);
            expect(exits[0].to.y).to.equal(0);
            expect(exits[1].from.x).to.equal(6);
            expect(exits[1].from.y).to.equal(0);
            expect(exits[1].to.x).to.equal(7);
            expect(exits[1].to.y).to.equal(0);
        });

        it("returns two exits when there are two exits at each corner", () => {
            const room = {
                size: 10,
                findObjectsInArea: (type, top, left, bottom, right) => {
                    expect(type).to.equal(lookTypes.TERRAIN);
                    expect(top).to.equal(0);
                    expect(left).to.equal(0);
                    expect(bottom).to.equal(0);
                    expect(right).to.equal(9);
                    return {
                        0: {
                            0: undefined,
                            1: [obstacleTypes.WALL],
                            2: [obstacleTypes.WALL],
                            3: [obstacleTypes.WALL],
                            4: [obstacleTypes.WALL],
                            5: [obstacleTypes.WALL],
                            6: [obstacleTypes.WALL],
                            7: [obstacleTypes.WALL],
                            8: [obstacleTypes.WALL],
                            9: undefined
                        }
                    };
                }
            };
            const exitsCalculator = new ExitsCalculator(room);
            const exits = exitsCalculator.calculateTopExits();
            expect(exits.length).to.equal(2);
            expect(exits[0].from.x).to.equal(0);
            expect(exits[0].from.y).to.equal(0);
            expect(exits[0].to.x).to.equal(0);
            expect(exits[0].to.y).to.equal(0);
            expect(exits[1].from.x).to.equal(9);
            expect(exits[1].from.y).to.equal(0);
            expect(exits[1].to.x).to.equal(9);
            expect(exits[1].to.y).to.equal(0);
        });
    });

    describe("#calculateBottomExits", () => {

        it("returns empty array when there are no exits", () => {
            const room = {
                size: 10,
                findObjectsInArea: (type, top, left, bottom, right) => {
                    expect(type).to.equal(lookTypes.TERRAIN);
                    expect(top).to.equal(9);
                    expect(left).to.equal(0);
                    expect(bottom).to.equal(9);
                    expect(right).to.equal(9);
                    return {
                        9: {
                            0: [obstacleTypes.WALL],
                            1: [obstacleTypes.WALL],
                            2: [obstacleTypes.WALL],
                            3: [obstacleTypes.WALL],
                            4: [obstacleTypes.WALL],
                            5: [obstacleTypes.WALL],
                            6: [obstacleTypes.WALL],
                            7: [obstacleTypes.WALL],
                            8: [obstacleTypes.WALL],
                            9: [obstacleTypes.WALL]
                        }
                    };
                }
            };
            const exitsCalculator = new ExitsCalculator(room);
            const exits = exitsCalculator.calculateBottomExits();
            expect(exits.length).to.equal(0);
        });

        it("returns one exit when there is one exit", () => {
            const room = {
                size: 10,
                findObjectsInArea: (type, top, left, bottom, right) => {
                    expect(type).to.equal(lookTypes.TERRAIN);
                    expect(top).to.equal(9);
                    expect(left).to.equal(0);
                    expect(bottom).to.equal(9);
                    expect(right).to.equal(9);
                    return {
                        9: {
                            0: [obstacleTypes.WALL],
                            1: [obstacleTypes.WALL],
                            2: [obstacleTypes.WALL],
                            3: [obstacleTypes.WALL],
                            4: undefined,
                            5: undefined,
                            6: [obstacleTypes.WALL],
                            7: [obstacleTypes.WALL],
                            8: [obstacleTypes.WALL],
                            9: [obstacleTypes.WALL]
                        }
                    };
                }
            };
            const exitsCalculator = new ExitsCalculator(room);
            const exits = exitsCalculator.calculateBottomExits();
            expect(exits.length).to.equal(1);
            expect(exits[0].from.x).to.equal(4);
            expect(exits[0].from.y).to.equal(9);
            expect(exits[0].to.x).to.equal(5);
            expect(exits[0].to.y).to.equal(9);
        });

        it("returns one exit when there is one exit from edge to edge", () => {
            const room = {
                size: 10,
                findObjectsInArea: (type, top, left, bottom, right) => {
                    expect(type).to.equal(lookTypes.TERRAIN);
                    expect(top).to.equal(9);
                    expect(left).to.equal(0);
                    expect(bottom).to.equal(9);
                    expect(right).to.equal(9);
                    return {
                        9: {
                            0: undefined,
                            1: undefined,
                            2: undefined,
                            3: undefined,
                            4: undefined,
                            5: undefined,
                            6: undefined,
                            7: undefined,
                            8: undefined,
                            9: undefined
                        }
                    };
                }
            };
            const exitsCalculator = new ExitsCalculator(room);
            const exits = exitsCalculator.calculateBottomExits();
            expect(exits.length).to.equal(1);
            expect(exits[0].from.x).to.equal(0);
            expect(exits[0].from.y).to.equal(9);
            expect(exits[0].to.x).to.equal(9);
            expect(exits[0].to.y).to.equal(9);
        });

        it("returns two exits when there are two exits", () => {
            const room = {
                size: 10,
                findObjectsInArea: (type, top, left, bottom, right) => {
                    expect(type).to.equal(lookTypes.TERRAIN);
                    expect(top).to.equal(9);
                    expect(left).to.equal(0);
                    expect(bottom).to.equal(9);
                    expect(right).to.equal(9);
                    return {
                        9: {
                            0: [obstacleTypes.WALL],
                            1: [obstacleTypes.WALL],
                            2: undefined,
                            3: undefined,
                            4: [obstacleTypes.WALL],
                            5: [obstacleTypes.WALL],
                            6: undefined,
                            7: undefined,
                            8: [obstacleTypes.WALL],
                            9: [obstacleTypes.WALL]
                        }
                    };
                }
            };
            const exitsCalculator = new ExitsCalculator(room);
            const exits = exitsCalculator.calculateBottomExits();
            expect(exits.length).to.equal(2);
            expect(exits[0].from.x).to.equal(2);
            expect(exits[0].from.y).to.equal(9);
            expect(exits[0].to.x).to.equal(3);
            expect(exits[0].to.y).to.equal(9);
            expect(exits[1].from.x).to.equal(6);
            expect(exits[1].from.y).to.equal(9);
            expect(exits[1].to.x).to.equal(7);
            expect(exits[1].to.y).to.equal(9);
        });

        it("returns two exits when there are two exits at each corner", () => {
            const room = {
                size: 10,
                findObjectsInArea: (type, top, left, bottom, right) => {
                    expect(type).to.equal(lookTypes.TERRAIN);
                    expect(top).to.equal(9);
                    expect(left).to.equal(0);
                    expect(bottom).to.equal(9);
                    expect(right).to.equal(9);
                    return {
                        9: {
                            0: undefined,
                            1: [obstacleTypes.WALL],
                            2: [obstacleTypes.WALL],
                            3: [obstacleTypes.WALL],
                            4: [obstacleTypes.WALL],
                            5: [obstacleTypes.WALL],
                            6: [obstacleTypes.WALL],
                            7: [obstacleTypes.WALL],
                            8: [obstacleTypes.WALL],
                            9: undefined
                        }
                    };
                }
            };
            const exitsCalculator = new ExitsCalculator(room);
            const exits = exitsCalculator.calculateBottomExits();
            expect(exits.length).to.equal(2);
            expect(exits[0].from.x).to.equal(0);
            expect(exits[0].from.y).to.equal(9);
            expect(exits[0].to.x).to.equal(0);
            expect(exits[0].to.y).to.equal(9);
            expect(exits[1].from.x).to.equal(9);
            expect(exits[1].from.y).to.equal(9);
            expect(exits[1].to.x).to.equal(9);
            expect(exits[1].to.y).to.equal(9);
        });
    });

    describe("#calculateLeftExits", () => {

        it("returns empty array when there are no exits", () => {
            const room = {
                size: 10,
                findObjectsInArea: (type, top, left, bottom, right) => {
                    expect(type).to.equal(lookTypes.TERRAIN);
                    expect(top).to.equal(0);
                    expect(left).to.equal(0);
                    expect(bottom).to.equal(9);
                    expect(right).to.equal(0);
                    return {
                        0: {
                            0: [obstacleTypes.WALL]
                        },
                        1: {
                            0: [obstacleTypes.WALL]
                        },
                        2: {
                            0: [obstacleTypes.WALL]
                        },
                        3: {
                            0: [obstacleTypes.WALL]
                        },
                        4: {
                            0: [obstacleTypes.WALL]
                        },
                        5: {
                            0: [obstacleTypes.WALL]
                        },
                        6: {
                            0: [obstacleTypes.WALL]
                        },
                        7: {
                            0: [obstacleTypes.WALL]
                        },
                        8: {
                            0: [obstacleTypes.WALL]
                        },
                        9: {
                            0: [obstacleTypes.WALL]
                        }
                    };
                }
            };
            const exitsCalculator = new ExitsCalculator(room);
            const exits = exitsCalculator.calculateLeftExits();
            expect(exits.length).to.equal(0);
        });

        it("returns one exit when there is one exit", () => {
            const room = {
                size: 10,
                findObjectsInArea: (type, top, left, bottom, right) => {
                    expect(type).to.equal(lookTypes.TERRAIN);
                    expect(top).to.equal(0);
                    expect(left).to.equal(0);
                    expect(bottom).to.equal(9);
                    expect(right).to.equal(0);
                    return {
                        0: {
                            0: [obstacleTypes.WALL]
                        },
                        1: {
                            0: [obstacleTypes.WALL]
                        },
                        2: {
                            0: [obstacleTypes.WALL]
                        },
                        3: {
                            0: [obstacleTypes.WALL]
                        },
                        4: {
                            0: undefined
                        },
                        5: {
                            0: undefined
                        },
                        6: {
                            0: [obstacleTypes.WALL]
                        },
                        7: {
                            0: [obstacleTypes.WALL]
                        },
                        8: {
                            0: [obstacleTypes.WALL]
                        },
                        9: {
                            0: [obstacleTypes.WALL]
                        }
                    };
                }
            };
            const exitsCalculator = new ExitsCalculator(room);
            const exits = exitsCalculator.calculateLeftExits();
            expect(exits.length).to.equal(1);
            expect(exits[0].from.x).to.equal(0);
            expect(exits[0].from.y).to.equal(4);
            expect(exits[0].to.x).to.equal(0);
            expect(exits[0].to.y).to.equal(5);
        });

        it("returns one exit when there is one exit from edge to edge", () => {
            const room = {
                size: 10,
                findObjectsInArea: (type, top, left, bottom, right) => {
                    expect(type).to.equal(lookTypes.TERRAIN);
                    expect(top).to.equal(0);
                    expect(left).to.equal(0);
                    expect(bottom).to.equal(9);
                    expect(right).to.equal(0);
                    return {
                        0: {
                            0: undefined
                        },
                        1: {
                            0: undefined
                        },
                        2: {
                            0: undefined
                        },
                        3: {
                            0: undefined
                        },
                        4: {
                            0: undefined
                        },
                        5: {
                            0: undefined
                        },
                        6: {
                            0: undefined
                        },
                        7: {
                            0: undefined
                        },
                        8: {
                            0: undefined
                        },
                        9: {
                            0: undefined
                        }
                    };
                }
            };
            const exitsCalculator = new ExitsCalculator(room);
            const exits = exitsCalculator.calculateLeftExits();
            expect(exits.length).to.equal(1);
            expect(exits[0].from.x).to.equal(0);
            expect(exits[0].from.y).to.equal(0);
            expect(exits[0].to.x).to.equal(0);
            expect(exits[0].to.y).to.equal(9);
        });

        it("returns two exits when there are two exits", () => {
            const room = {
                size: 10,
                findObjectsInArea: (type, top, left, bottom, right) => {
                    expect(type).to.equal(lookTypes.TERRAIN);
                    expect(top).to.equal(0);
                    expect(left).to.equal(0);
                    expect(bottom).to.equal(9);
                    expect(right).to.equal(0);
                    return {
                        0: {
                            0: [obstacleTypes.WALL]
                        },
                        1: {
                            0: [obstacleTypes.WALL]
                        },
                        2: {
                            0: undefined
                        },
                        3: {
                            0: undefined
                        },
                        4: {
                            0: [obstacleTypes.WALL]
                        },
                        5: {
                            0: [obstacleTypes.WALL]
                        },
                        6: {
                            0: undefined
                        },
                        7: {
                            0: undefined
                        },
                        8: {
                            0: [obstacleTypes.WALL]
                        },
                        9: {
                            0: [obstacleTypes.WALL]
                        }
                    };
                }
            };
            const exitsCalculator = new ExitsCalculator(room);
            const exits = exitsCalculator.calculateLeftExits();
            expect(exits.length).to.equal(2);
            expect(exits[0].from.x).to.equal(0);
            expect(exits[0].from.y).to.equal(2);
            expect(exits[0].to.x).to.equal(0);
            expect(exits[0].to.y).to.equal(3);
            expect(exits[1].from.x).to.equal(0);
            expect(exits[1].from.y).to.equal(6);
            expect(exits[1].to.x).to.equal(0);
            expect(exits[1].to.y).to.equal(7);
        });

        it("returns two exits when there are two exits at each corner", () => {
            const room = {
                size: 10,
                findObjectsInArea: (type, top, left, bottom, right) => {
                    expect(type).to.equal(lookTypes.TERRAIN);
                    expect(top).to.equal(0);
                    expect(left).to.equal(0);
                    expect(bottom).to.equal(9);
                    expect(right).to.equal(0);
                    return {
                        0: {
                            0: undefined
                        },
                        1: {
                            0: [obstacleTypes.WALL]
                        },
                        2: {
                            0: [obstacleTypes.WALL]
                        },
                        3: {
                            0: [obstacleTypes.WALL]
                        },
                        4: {
                            0: [obstacleTypes.WALL]
                        },
                        5: {
                            0: [obstacleTypes.WALL]
                        },
                        6: {
                            0: [obstacleTypes.WALL]
                        },
                        7: {
                            0: [obstacleTypes.WALL]
                        },
                        8: {
                            0: [obstacleTypes.WALL]
                        },
                        9: {
                            0: undefined
                        }
                    };
                }
            };
            const exitsCalculator = new ExitsCalculator(room);
            const exits = exitsCalculator.calculateLeftExits();
            expect(exits.length).to.equal(2);
            expect(exits[0].from.x).to.equal(0);
            expect(exits[0].from.y).to.equal(0);
            expect(exits[0].to.x).to.equal(0);
            expect(exits[0].to.y).to.equal(0);
            expect(exits[1].from.x).to.equal(0);
            expect(exits[1].from.y).to.equal(9);
            expect(exits[1].to.x).to.equal(0);
            expect(exits[1].to.y).to.equal(9);
        });
    });

    describe("#calculateRightExits", () => {

        it("returns empty array when there are no exits", () => {
            const room = {
                size: 10,
                findObjectsInArea: (type, top, left, bottom, right) => {
                    expect(type).to.equal(lookTypes.TERRAIN);
                    expect(top).to.equal(0);
                    expect(left).to.equal(9);
                    expect(bottom).to.equal(9);
                    expect(right).to.equal(9);
                    return {
                        0: {
                            9: [obstacleTypes.WALL]
                        },
                        1: {
                            9: [obstacleTypes.WALL]
                        },
                        2: {
                            9: [obstacleTypes.WALL]
                        },
                        3: {
                            9: [obstacleTypes.WALL]
                        },
                        4: {
                            9: [obstacleTypes.WALL]
                        },
                        5: {
                            9: [obstacleTypes.WALL]
                        },
                        6: {
                            9: [obstacleTypes.WALL]
                        },
                        7: {
                            9: [obstacleTypes.WALL]
                        },
                        8: {
                            9: [obstacleTypes.WALL]
                        },
                        9: {
                            9: [obstacleTypes.WALL]
                        }
                    };
                }
            };
            const exitsCalculator = new ExitsCalculator(room);
            const exits = exitsCalculator.calculateRightExits();
            expect(exits.length).to.equal(0);
        });

        it("returns one exit when there is one exit", () => {
            const room = {
                size: 10,
                findObjectsInArea: (type, top, left, bottom, right) => {
                    expect(type).to.equal(lookTypes.TERRAIN);
                    expect(top).to.equal(0);
                    expect(left).to.equal(9);
                    expect(bottom).to.equal(9);
                    expect(right).to.equal(9);
                    return {
                        0: {
                            9: [obstacleTypes.WALL]
                        },
                        1: {
                            9: [obstacleTypes.WALL]
                        },
                        2: {
                            9: [obstacleTypes.WALL]
                        },
                        3: {
                            9: [obstacleTypes.WALL]
                        },
                        4: {
                            9: undefined
                        },
                        5: {
                            9: undefined
                        },
                        6: {
                            9: [obstacleTypes.WALL]
                        },
                        7: {
                            9: [obstacleTypes.WALL]
                        },
                        8: {
                            9: [obstacleTypes.WALL]
                        },
                        9: {
                            9: [obstacleTypes.WALL]
                        }
                    };
                }
            };
            const exitsCalculator = new ExitsCalculator(room);
            const exits = exitsCalculator.calculateRightExits();
            expect(exits.length).to.equal(1);
            expect(exits[0].from.x).to.equal(9);
            expect(exits[0].from.y).to.equal(4);
            expect(exits[0].to.x).to.equal(9);
            expect(exits[0].to.y).to.equal(5);
        });

        it("returns one exit when there is one exit from edge to edge", () => {
            const room = {
                size: 10,
                findObjectsInArea: (type, top, left, bottom, right) => {
                    expect(type).to.equal(lookTypes.TERRAIN);
                    expect(top).to.equal(0);
                    expect(left).to.equal(9);
                    expect(bottom).to.equal(9);
                    expect(right).to.equal(9);
                    return {
                        0: {
                            9: undefined
                        },
                        1: {
                            9: undefined
                        },
                        2: {
                            9: undefined
                        },
                        3: {
                            9: undefined
                        },
                        4: {
                            9: undefined
                        },
                        5: {
                            9: undefined
                        },
                        6: {
                            9: undefined
                        },
                        7: {
                            9: undefined
                        },
                        8: {
                            9: undefined
                        },
                        9: {
                            9: undefined
                        }
                    };
                }
            };
            const exitsCalculator = new ExitsCalculator(room);
            const exits = exitsCalculator.calculateRightExits();
            expect(exits.length).to.equal(1);
            expect(exits[0].from.x).to.equal(9);
            expect(exits[0].from.y).to.equal(0);
            expect(exits[0].to.x).to.equal(9);
            expect(exits[0].to.y).to.equal(9);
        });

        it("returns two exits when there are two exits", () => {
            const room = {
                size: 10,
                findObjectsInArea: (type, top, left, bottom, right) => {
                    expect(type).to.equal(lookTypes.TERRAIN);
                    expect(top).to.equal(0);
                    expect(left).to.equal(9);
                    expect(bottom).to.equal(9);
                    expect(right).to.equal(9);
                    return {
                        0: {
                            9: [obstacleTypes.WALL]
                        },
                        1: {
                            9: [obstacleTypes.WALL]
                        },
                        2: {
                            9: undefined
                        },
                        3: {
                            9: undefined
                        },
                        4: {
                            9: [obstacleTypes.WALL]
                        },
                        5: {
                            9: [obstacleTypes.WALL]
                        },
                        6: {
                            9: undefined
                        },
                        7: {
                            9: undefined
                        },
                        8: {
                            9: [obstacleTypes.WALL]
                        },
                        9: {
                            9: [obstacleTypes.WALL]
                        }
                    };
                }
            };
            const exitsCalculator = new ExitsCalculator(room);
            const exits = exitsCalculator.calculateRightExits();
            expect(exits.length).to.equal(2);
            expect(exits[0].from.x).to.equal(9);
            expect(exits[0].from.y).to.equal(2);
            expect(exits[0].to.x).to.equal(9);
            expect(exits[0].to.y).to.equal(3);
            expect(exits[1].from.x).to.equal(9);
            expect(exits[1].from.y).to.equal(6);
            expect(exits[1].to.x).to.equal(9);
            expect(exits[1].to.y).to.equal(7);
        });

        it("returns two exits when there are two exits at each corner", () => {
            const room = {
                size: 10,
                findObjectsInArea: (type, top, left, bottom, right) => {
                    expect(type).to.equal(lookTypes.TERRAIN);
                    expect(top).to.equal(0);
                    expect(left).to.equal(9);
                    expect(bottom).to.equal(9);
                    expect(right).to.equal(9);
                    return {
                        0: {
                            9: undefined
                        },
                        1: {
                            9: [obstacleTypes.WALL]
                        },
                        2: {
                            9: [obstacleTypes.WALL]
                        },
                        3: {
                            9: [obstacleTypes.WALL]
                        },
                        4: {
                            9: [obstacleTypes.WALL]
                        },
                        5: {
                            9: [obstacleTypes.WALL]
                        },
                        6: {
                            9: [obstacleTypes.WALL]
                        },
                        7: {
                            9: [obstacleTypes.WALL]
                        },
                        8: {
                            9: [obstacleTypes.WALL]
                        },
                        9: {
                            9: undefined
                        }
                    };
                }
            };
            const exitsCalculator = new ExitsCalculator(room);
            const exits = exitsCalculator.calculateRightExits();
            expect(exits.length).to.equal(2);
            expect(exits[0].from.x).to.equal(9);
            expect(exits[0].from.y).to.equal(0);
            expect(exits[0].to.x).to.equal(9);
            expect(exits[0].to.y).to.equal(0);
            expect(exits[1].from.x).to.equal(9);
            expect(exits[1].from.y).to.equal(9);
            expect(exits[1].to.x).to.equal(9);
            expect(exits[1].to.y).to.equal(9);
        });
    });
});



