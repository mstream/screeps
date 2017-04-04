const expect = require("chai").expect;

const WallsCalculator = require("../src/class.WallsCalculator");
const lookTypes = require("../src/const.lookTypes");
const obstacleTypes = require("../src/const.obstacleTypes");


describe("WallsCalculator", () => {

    describe("#calculateTop", () => {

        it("throws exception when room is null", () => {
            expect(
                () => new WallsCalculator().calculateTop(null)
            ).to.throw("room can't be null");
        });

        it("throws exception when room is undefined", () => {
            expect(
                () => new WallsCalculator().calculateTop(undefined)
            ).to.throw("room can't be null");
        });

        it("returns empty array when there are no gaps", () => {
            const room = {
                size: 10,
                findObjectsInArea: (type, top, left, bottom, right) => {
                    expect(type).to.equal(lookTypes.TERRAIN);
                    expect(top).to.equal(2);
                    expect(left).to.equal(2);
                    expect(bottom).to.equal(2);
                    expect(right).to.equal(7);
                    return {
                        2: {
                            2: [obstacleTypes.WALL],
                            3: [obstacleTypes.WALL],
                            4: [obstacleTypes.WALL],
                            5: [obstacleTypes.WALL],
                            6: [obstacleTypes.WALL],
                            7: [obstacleTypes.WALL]
                        }
                    };
                }
            };
            const wallsCalculator = new WallsCalculator();
            const walls = wallsCalculator.calculateTop(room);
            expect(walls.length).to.equal(0);
        });

        it("returns one wall when there is one gap", () => {
            const room = {
                size: 10,
                findObjectsInArea: (type, top, left, bottom, right) => {
                    expect(type).to.equal(lookTypes.TERRAIN);
                    expect(top).to.equal(2);
                    expect(left).to.equal(2);
                    expect(bottom).to.equal(2);
                    expect(right).to.equal(7);
                    return {
                        2: {
                            2: [obstacleTypes.WALL],
                            3: [obstacleTypes.WALL],
                            4: undefined,
                            5: undefined,
                            6: [obstacleTypes.WALL],
                            7: [obstacleTypes.WALL]
                        }
                    };
                }
            };
            const wallsCalculator = new WallsCalculator();
            const walls = wallsCalculator.calculateTop(room);
            expect(walls.length).to.equal(1);
            expect(walls[0].from.x).to.equal(4);
            expect(walls[0].from.y).to.equal(2);
            expect(walls[0].to.x).to.equal(5);
            expect(walls[0].to.y).to.equal(2);
        });

        it("returns one wall when there is one gap from edge to edge", () => {
            const room = {
                size: 10,
                findObjectsInArea: (type, top, left, bottom, right) => {
                    expect(type).to.equal(lookTypes.TERRAIN);
                    expect(top).to.equal(2);
                    expect(left).to.equal(2);
                    expect(bottom).to.equal(2);
                    expect(right).to.equal(7);
                    return {
                        2: {
                            2: undefined,
                            3: undefined,
                            4: undefined,
                            5: undefined,
                            6: undefined,
                            7: undefined
                        }
                    };
                }
            };
            const wallsCalculator = new WallsCalculator();
            const walls = wallsCalculator.calculateTop(room);
            expect(walls.length).to.equal(1);
            expect(walls[0].from.x).to.equal(2);
            expect(walls[0].from.y).to.equal(2);
            expect(walls[0].to.x).to.equal(7);
            expect(walls[0].to.y).to.equal(2);
        });

        it("returns two walls when there are two gaps", () => {
            const room = {
                size: 10,
                findObjectsInArea: (type, top, left, bottom, right) => {
                    expect(type).to.equal(lookTypes.TERRAIN);
                    expect(top).to.equal(2);
                    expect(left).to.equal(2);
                    expect(bottom).to.equal(2);
                    expect(right).to.equal(7);
                    return {
                        2: {
                            2: [obstacleTypes.WALL],
                            3: undefined,
                            4: [obstacleTypes.WALL],
                            5: [obstacleTypes.WALL],
                            6: undefined,
                            7: [obstacleTypes.WALL]
                        }
                    };
                }
            };
            const wallsCalculator = new WallsCalculator();
            const walls = wallsCalculator.calculateTop(room);
            expect(walls.length).to.equal(2);
            expect(walls[0].from.x).to.equal(3);
            expect(walls[0].from.y).to.equal(2);
            expect(walls[0].to.x).to.equal(3);
            expect(walls[0].to.y).to.equal(2);
            expect(walls[1].from.x).to.equal(6);
            expect(walls[1].from.y).to.equal(2);
            expect(walls[1].to.x).to.equal(6);
            expect(walls[1].to.y).to.equal(2);
        });

        it("returns two walls when there are two gaps at each corner", () => {
            const room = {
                size: 10,
                findObjectsInArea: (type, top, left, bottom, right) => {
                    expect(type).to.equal(lookTypes.TERRAIN);
                    expect(top).to.equal(2);
                    expect(left).to.equal(2);
                    expect(bottom).to.equal(2);
                    expect(right).to.equal(7);
                    return {
                        2: {
                            2: undefined,
                            3: [obstacleTypes.WALL],
                            4: [obstacleTypes.WALL],
                            5: [obstacleTypes.WALL],
                            6: [obstacleTypes.WALL],
                            7: undefined
                        }
                    };
                }
            };
            const wallsCalculator = new WallsCalculator();
            const walls = wallsCalculator.calculateTop(room);
            expect(walls.length).to.equal(2);
            expect(walls[0].from.x).to.equal(2);
            expect(walls[0].from.y).to.equal(2);
            expect(walls[0].to.x).to.equal(2);
            expect(walls[0].to.y).to.equal(2);
            expect(walls[1].from.x).to.equal(7);
            expect(walls[1].from.y).to.equal(2);
            expect(walls[1].to.x).to.equal(7);
            expect(walls[1].to.y).to.equal(2);
        });
    });

    describe("#calculateBottom", () => {

        it("throws exception when room is null", () => {
            expect(
                () => new WallsCalculator().calculateBottom(null)
            ).to.throw("room can't be null");
        });

        it("throws exception when room is undefined", () => {
            expect(
                () => new WallsCalculator().calculateBottom(undefined)
            ).to.throw("room can't be null");
        });

        it("returns empty array when there are no gaps", () => {
            const room = {
                size: 10,
                findObjectsInArea: (type, top, left, bottom, right) => {
                    expect(type).to.equal(lookTypes.TERRAIN);
                    expect(top).to.equal(7);
                    expect(left).to.equal(2);
                    expect(bottom).to.equal(7);
                    expect(right).to.equal(7);
                    return {
                        7: {
                            2: [obstacleTypes.WALL],
                            3: [obstacleTypes.WALL],
                            4: [obstacleTypes.WALL],
                            5: [obstacleTypes.WALL],
                            6: [obstacleTypes.WALL],
                            7: [obstacleTypes.WALL]
                        }
                    };
                }
            };
            const wallsCalculator = new WallsCalculator();
            const walls = wallsCalculator.calculateBottom(room);
            expect(walls.length).to.equal(0);
        });

        it("returns one wall when there is one gap", () => {
            const room = {
                size: 10,
                findObjectsInArea: (type, top, left, bottom, right) => {
                    expect(type).to.equal(lookTypes.TERRAIN);
                    expect(top).to.equal(7);
                    expect(left).to.equal(2);
                    expect(bottom).to.equal(7);
                    expect(right).to.equal(7);
                    return {
                        7: {
                            2: [obstacleTypes.WALL],
                            3: [obstacleTypes.WALL],
                            4: undefined,
                            5: undefined,
                            6: [obstacleTypes.WALL],
                            7: [obstacleTypes.WALL]
                        }
                    };
                }
            };
            const wallsCalculator = new WallsCalculator();
            const walls = wallsCalculator.calculateBottom(room);
            expect(walls.length).to.equal(1);
            expect(walls[0].from.x).to.equal(4);
            expect(walls[0].from.y).to.equal(7);
            expect(walls[0].to.x).to.equal(5);
            expect(walls[0].to.y).to.equal(7);
        });

        it("returns one wall when there is one gap from edge to edge", () => {
            const room = {
                size: 10,
                findObjectsInArea: (type, top, left, bottom, right) => {
                    expect(type).to.equal(lookTypes.TERRAIN);
                    expect(top).to.equal(7);
                    expect(left).to.equal(2);
                    expect(bottom).to.equal(7);
                    expect(right).to.equal(7);
                    return {
                        7: {
                            2: undefined,
                            3: undefined,
                            4: undefined,
                            5: undefined,
                            6: undefined,
                            7: undefined
                        }
                    };
                }
            };
            const wallsCalculator = new WallsCalculator();
            const walls = wallsCalculator.calculateBottom(room);
            expect(walls.length).to.equal(1);
            expect(walls[0].from.x).to.equal(2);
            expect(walls[0].from.y).to.equal(7);
            expect(walls[0].to.x).to.equal(7);
            expect(walls[0].to.y).to.equal(7);
        });

        it("returns two walls when there are two gaps", () => {
            const room = {
                size: 10,
                findObjectsInArea: (type, top, left, bottom, right) => {
                    expect(type).to.equal(lookTypes.TERRAIN);
                    expect(top).to.equal(7);
                    expect(left).to.equal(2);
                    expect(bottom).to.equal(7);
                    expect(right).to.equal(7);
                    return {
                        7: {
                            2: [obstacleTypes.WALL],
                            3: undefined,
                            4: [obstacleTypes.WALL],
                            5: [obstacleTypes.WALL],
                            6: undefined,
                            7: [obstacleTypes.WALL]
                        }
                    };
                }
            };
            const wallsCalculator = new WallsCalculator();
            const walls = wallsCalculator.calculateBottom(room);
            expect(walls.length).to.equal(2);
            expect(walls[0].from.x).to.equal(3);
            expect(walls[0].from.y).to.equal(7);
            expect(walls[0].to.x).to.equal(3);
            expect(walls[0].to.y).to.equal(7);
            expect(walls[1].from.x).to.equal(6);
            expect(walls[1].from.y).to.equal(7);
            expect(walls[1].to.x).to.equal(6);
            expect(walls[1].to.y).to.equal(7);
        });

        it("returns two walls when there are two gaps at each corner", () => {
            const room = {
                size: 10,
                findObjectsInArea: (type, top, left, bottom, right) => {
                    expect(type).to.equal(lookTypes.TERRAIN);
                    expect(top).to.equal(7);
                    expect(left).to.equal(2);
                    expect(bottom).to.equal(7);
                    expect(right).to.equal(7);
                    return {
                        7: {
                            2: undefined,
                            3: [obstacleTypes.WALL],
                            4: [obstacleTypes.WALL],
                            5: [obstacleTypes.WALL],
                            6: [obstacleTypes.WALL],
                            7: undefined
                        }
                    };
                }
            };
            const wallsCalculator = new WallsCalculator();
            const walls = wallsCalculator.calculateBottom(room);
            expect(walls.length).to.equal(2);
            expect(walls[0].from.x).to.equal(2);
            expect(walls[0].from.y).to.equal(7);
            expect(walls[0].to.x).to.equal(2);
            expect(walls[0].to.y).to.equal(7);
            expect(walls[1].from.x).to.equal(7);
            expect(walls[1].from.y).to.equal(7);
            expect(walls[1].to.x).to.equal(7);
            expect(walls[1].to.y).to.equal(7);
        });
    });

    describe("#calculateLeft", () => {

        it("throws exception when room is null", () => {
            expect(
                () => new WallsCalculator().calculateLeft(null)
            ).to.throw("room can't be null");
        });

        it("throws exception when room is undefined", () => {
            expect(
                () => new WallsCalculator().calculateLeft(undefined)
            ).to.throw("room can't be null");
        });

        it("returns empty array when there are no gaps", () => {
            const room = {
                size: 10,
                findObjectsInArea: (type, top, left, bottom, right) => {
                    expect(type).to.equal(lookTypes.TERRAIN);
                    expect(top).to.equal(2);
                    expect(left).to.equal(2);
                    expect(bottom).to.equal(7);
                    expect(right).to.equal(2);
                    return {
                        2: {
                            2: [obstacleTypes.WALL]
                        },
                        3: {
                            2: [obstacleTypes.WALL]
                        },
                        4: {
                            2: [obstacleTypes.WALL]
                        },
                        5: {
                            2: [obstacleTypes.WALL]
                        },
                        6: {
                            2: [obstacleTypes.WALL]
                        },
                        7: {
                            2: [obstacleTypes.WALL]
                        }
                    };
                }
            };
            const wallsCalculator = new WallsCalculator();
            const walls = wallsCalculator.calculateLeft(room);
            expect(walls.length).to.equal(0);
        });

        it("returns one wall when there is one gap", () => {
            const room = {
                size: 10,
                findObjectsInArea: (type, top, left, bottom, right) => {
                    expect(type).to.equal(lookTypes.TERRAIN);
                    expect(top).to.equal(2);
                    expect(left).to.equal(2);
                    expect(bottom).to.equal(7);
                    expect(right).to.equal(2);
                    return {
                        2: {
                            2: [obstacleTypes.WALL]
                        },
                        3: {
                            2: [obstacleTypes.WALL]
                        },
                        4: {
                            2: undefined
                        },
                        5: {
                            2: undefined
                        },
                        6: {
                            2: [obstacleTypes.WALL]
                        },
                        7: {
                            2: [obstacleTypes.WALL]
                        }
                    };
                }
            };
            const wallsCalculator = new WallsCalculator();
            const walls = wallsCalculator.calculateLeft(room);
            expect(walls.length).to.equal(1);
            expect(walls[0].from.x).to.equal(2);
            expect(walls[0].from.y).to.equal(4);
            expect(walls[0].to.x).to.equal(2);
            expect(walls[0].to.y).to.equal(5);
        });

        it("returns one wall when there is one gap from edge to edge", () => {
            const room = {
                size: 10,
                findObjectsInArea: (type, top, left, bottom, right) => {
                    expect(type).to.equal(lookTypes.TERRAIN);
                    expect(top).to.equal(2);
                    expect(left).to.equal(2);
                    expect(bottom).to.equal(7);
                    expect(right).to.equal(2);
                    return {
                        2: {
                            2: undefined
                        },
                        3: {
                            2: undefined
                        },
                        4: {
                            2: undefined
                        },
                        5: {
                            2: undefined
                        },
                        6: {
                            2: undefined
                        },
                        7: {
                            2: undefined
                        }
                    };
                }
            };
            const wallsCalculator = new WallsCalculator();
            const walls = wallsCalculator.calculateLeft(room);
            expect(walls.length).to.equal(1);
            expect(walls[0].from.x).to.equal(2);
            expect(walls[0].from.y).to.equal(2);
            expect(walls[0].to.x).to.equal(2);
            expect(walls[0].to.y).to.equal(7);
        });

        it("returns two walls when there are two gaps", () => {
            const room = {
                size: 10,
                findObjectsInArea: (type, top, left, bottom, right) => {
                    expect(type).to.equal(lookTypes.TERRAIN);
                    expect(top).to.equal(2);
                    expect(left).to.equal(2);
                    expect(bottom).to.equal(7);
                    expect(right).to.equal(2);
                    return {
                        2: {
                            2: [obstacleTypes.WALL]
                        },
                        3: {
                            2: undefined
                        },
                        4: {
                            2: [obstacleTypes.WALL]
                        },
                        5: {
                            2: [obstacleTypes.WALL]
                        },
                        6: {
                            2: undefined
                        },
                        7: {
                            2: [obstacleTypes.WALL]
                        }
                    };
                }
            };
            const wallsCalculator = new WallsCalculator();
            const walls = wallsCalculator.calculateLeft(room);
            expect(walls.length).to.equal(2);
            expect(walls[0].from.x).to.equal(2);
            expect(walls[0].from.y).to.equal(3);
            expect(walls[0].to.x).to.equal(2);
            expect(walls[0].to.y).to.equal(3);
            expect(walls[1].from.x).to.equal(2);
            expect(walls[1].from.y).to.equal(6);
            expect(walls[1].to.x).to.equal(2);
            expect(walls[1].to.y).to.equal(6);
        });

        it("returns two walls when there are two gaps at each corner", () => {
            const room = {
                size: 10,
                findObjectsInArea: (type, top, left, bottom, right) => {
                    expect(type).to.equal(lookTypes.TERRAIN);
                    expect(top).to.equal(2);
                    expect(left).to.equal(2);
                    expect(bottom).to.equal(7);
                    expect(right).to.equal(2);
                    return {
                        2: {
                            2: undefined
                        },
                        3: {
                            2: [obstacleTypes.WALL]
                        },
                        4: {
                            2: [obstacleTypes.WALL]
                        },
                        5: {
                            2: [obstacleTypes.WALL]
                        },
                        6: {
                            2: [obstacleTypes.WALL]
                        },
                        7: {
                            2: undefined
                        }
                    };
                }
            };
            const wallsCalculator = new WallsCalculator();
            const walls = wallsCalculator.calculateLeft(room);
            expect(walls.length).to.equal(2);
            expect(walls[0].from.x).to.equal(2);
            expect(walls[0].from.y).to.equal(2);
            expect(walls[0].to.x).to.equal(2);
            expect(walls[0].to.y).to.equal(2);
            expect(walls[1].from.x).to.equal(2);
            expect(walls[1].from.y).to.equal(7);
            expect(walls[1].to.x).to.equal(2);
            expect(walls[1].to.y).to.equal(7);
        });
    });

    describe("#calculateRight", () => {

        it("throws exception when room is null", () => {
            expect(
                () => new WallsCalculator().calculateRight(null)
            ).to.throw("room can't be null");
        });

        it("throws exception when room is undefined", () => {
            expect(
                () => new WallsCalculator().calculateRight(undefined)
            ).to.throw("room can't be null");
        });

        it("returns empty array when there are no gaps", () => {
            const room = {
                size: 10,
                findObjectsInArea: (type, top, left, bottom, right) => {
                    expect(type).to.equal(lookTypes.TERRAIN);
                    expect(top).to.equal(2);
                    expect(left).to.equal(7);
                    expect(bottom).to.equal(7);
                    expect(right).to.equal(7);
                    return {
                        2: {
                            7: [obstacleTypes.WALL]
                        },
                        3: {
                            7: [obstacleTypes.WALL]
                        },
                        4: {
                            7: [obstacleTypes.WALL]
                        },
                        5: {
                            7: [obstacleTypes.WALL]
                        },
                        6: {
                            7: [obstacleTypes.WALL]
                        },
                        7: {
                            7: [obstacleTypes.WALL]
                        }
                    };
                }
            };
            const wallsCalculator = new WallsCalculator();
            const walls = wallsCalculator.calculateRight(room);
            expect(walls.length).to.equal(0);
        });

        it("returns one wall when there is one gap", () => {
            const room = {
                size: 10,
                findObjectsInArea: (type, top, left, bottom, right) => {
                    expect(type).to.equal(lookTypes.TERRAIN);
                    expect(top).to.equal(2);
                    expect(left).to.equal(7);
                    expect(bottom).to.equal(7);
                    expect(right).to.equal(7);
                    return {
                        2: {
                            7: [obstacleTypes.WALL]
                        },
                        3: {
                            7: [obstacleTypes.WALL]
                        },
                        4: {
                            7: undefined
                        },
                        5: {
                            7: undefined
                        },
                        6: {
                            7: [obstacleTypes.WALL]
                        },
                        7: {
                            7: [obstacleTypes.WALL]
                        }
                    };
                }
            };
            const wallsCalculator = new WallsCalculator();
            const walls = wallsCalculator.calculateRight(room);
            expect(walls.length).to.equal(1);
            expect(walls[0].from.x).to.equal(7);
            expect(walls[0].from.y).to.equal(4);
            expect(walls[0].to.x).to.equal(7);
            expect(walls[0].to.y).to.equal(5);
        });

        it("returns one wall when there is one gap from edge to edge", () => {
            const room = {
                size: 10,
                findObjectsInArea: (type, top, left, bottom, right) => {
                    expect(type).to.equal(lookTypes.TERRAIN);
                    expect(top).to.equal(2);
                    expect(left).to.equal(7);
                    expect(bottom).to.equal(7);
                    expect(right).to.equal(7);
                    return {
                        2: {
                            7: undefined
                        },
                        3: {
                            7: undefined
                        },
                        4: {
                            7: undefined
                        },
                        5: {
                            7: undefined
                        },
                        6: {
                            7: undefined
                        },
                        7: {
                            7: undefined
                        }
                    };
                }
            };
            const wallsCalculator = new WallsCalculator();
            const walls = wallsCalculator.calculateRight(room);
            expect(walls.length).to.equal(1);
            expect(walls[0].from.x).to.equal(7);
            expect(walls[0].from.y).to.equal(2);
            expect(walls[0].to.x).to.equal(7);
            expect(walls[0].to.y).to.equal(7);
        });

        it("returns two walls when there are two gaps", () => {
            const room = {
                size: 10,
                findObjectsInArea: (type, top, left, bottom, right) => {
                    expect(type).to.equal(lookTypes.TERRAIN);
                    expect(top).to.equal(2);
                    expect(left).to.equal(7);
                    expect(bottom).to.equal(7);
                    expect(right).to.equal(7);
                    return {
                        2: {
                            7: [obstacleTypes.WALL]
                        },
                        3: {
                            7: undefined
                        },
                        4: {
                            7: [obstacleTypes.WALL]
                        },
                        5: {
                            7: [obstacleTypes.WALL]
                        },
                        6: {
                            7: undefined
                        },
                        7: {
                            7: [obstacleTypes.WALL]
                        }
                    };
                }
            };
            const wallsCalculator = new WallsCalculator();
            const walls = wallsCalculator.calculateRight(room);
            expect(walls.length).to.equal(2);
            expect(walls[0].from.x).to.equal(7);
            expect(walls[0].from.y).to.equal(3);
            expect(walls[0].to.x).to.equal(7);
            expect(walls[0].to.y).to.equal(3);
            expect(walls[1].from.x).to.equal(7);
            expect(walls[1].from.y).to.equal(6);
            expect(walls[1].to.x).to.equal(7);
            expect(walls[1].to.y).to.equal(6);
        });

        it("returns two walls when there are two gaps at each corner", () => {
            const room = {
                size: 10,
                findObjectsInArea: (type, top, left, bottom, right) => {
                    expect(type).to.equal(lookTypes.TERRAIN);
                    expect(top).to.equal(2);
                    expect(left).to.equal(7);
                    expect(bottom).to.equal(7);
                    expect(right).to.equal(7);
                    return {
                        2: {
                            7: undefined
                        },
                        3: {
                            7: [obstacleTypes.WALL]
                        },
                        4: {
                            7: [obstacleTypes.WALL]
                        },
                        5: {
                            7: [obstacleTypes.WALL]
                        },
                        6: {
                            7: [obstacleTypes.WALL]
                        },
                        7: {
                            7: undefined
                        }
                    };
                }
            };
            const wallsCalculator = new WallsCalculator();
            const walls = wallsCalculator.calculateRight(room);
            expect(walls.length).to.equal(2);
            expect(walls[0].from.x).to.equal(7);
            expect(walls[0].from.y).to.equal(2);
            expect(walls[0].to.x).to.equal(7);
            expect(walls[0].to.y).to.equal(2);
            expect(walls[1].from.x).to.equal(7);
            expect(walls[1].from.y).to.equal(7);
            expect(walls[1].to.x).to.equal(7);
            expect(walls[1].to.y).to.equal(7);
        });
    });
});



