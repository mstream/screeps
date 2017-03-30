const expect = require("chai").expect;

const WallsCalculator = require("../src/class.WallsCalculator");
const lookTypes = require("../src/const.lookTypes");
const obstacleTypes = require("../src/const.obstacleTypes");


describe("WallsCalculator", () => {

    describe("#calculateTopWalls", () => {

        it("throws exception when room is null", () => {
            expect(
                () => new WallsCalculator().calculateTopWalls(null)
            ).to.throw("room can't be null");
        });

        it("throws exception when room is undefined", () => {
            expect(
                () => new WallsCalculator().calculateTopWalls(undefined)
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
            const walls = wallsCalculator.calculateTopWalls(room);
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
            const walls = wallsCalculator.calculateTopWalls(room);
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
            const walls = wallsCalculator.calculateTopWalls(room);
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
            const walls = wallsCalculator.calculateTopWalls(room);
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
            const walls = wallsCalculator.calculateTopWalls(room);
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

    describe("#calculateBottomWalls", () => {

        it("throws exception when room is null", () => {
            expect(
                () => new WallsCalculator().calculateBottomWalls(null)
            ).to.throw("room can't be null");
        });

        it("throws exception when room is undefined", () => {
            expect(
                () => new WallsCalculator().calculateBottomWalls(undefined)
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
            const walls = wallsCalculator.calculateBottomWalls(room);
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
            const walls = wallsCalculator.calculateBottomWalls(room);
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
            const walls = wallsCalculator.calculateBottomWalls(room);
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
            const walls = wallsCalculator.calculateBottomWalls(room);
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
            const walls = wallsCalculator.calculateBottomWalls(room);
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

    describe("#calculateLeftWalls", () => {

        it("throws exception when room is null", () => {
            expect(
                () => new WallsCalculator().calculateLeftWalls(null)
            ).to.throw("room can't be null");
        });

        it("throws exception when room is undefined", () => {
            expect(
                () => new WallsCalculator().calculateLeftWalls(undefined)
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
            const walls = wallsCalculator.calculateLeftWalls(room);
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
            const walls = wallsCalculator.calculateLeftWalls(room);
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
            const walls = wallsCalculator.calculateLeftWalls(room);
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
            const walls = wallsCalculator.calculateLeftWalls(room);
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
            const walls = wallsCalculator.calculateLeftWalls(room);
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

    describe("#calculateRightWalls", () => {

        it("throws exception when room is null", () => {
            expect(
                () => new WallsCalculator().calculateRightWalls(null)
            ).to.throw("room can't be null");
        });

        it("throws exception when room is undefined", () => {
            expect(
                () => new WallsCalculator().calculateRightWalls(undefined)
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
            const walls = wallsCalculator.calculateRightWalls(room);
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
            const walls = wallsCalculator.calculateRightWalls(room);
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
            const walls = wallsCalculator.calculateRightWalls(room);
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
            const walls = wallsCalculator.calculateRightWalls(room);
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
            const walls = wallsCalculator.calculateRightWalls(room);
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



