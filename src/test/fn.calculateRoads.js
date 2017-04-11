const {expect} = require("chai");
const sinon = require("sinon");
const _ = require("lodash");


const calculateRoads = require("../main/fn.calculateRoads");

const searchTypes = require("../main/const.searchTypes");
const structureTypes = require("../main/const.structureTypes");


describe("calculateRoads", () => {

    it("calculates roads properly", () => {

        const room = {
            controller: {
                pos: {
                    roomName: "room1",
                    x: 10,
                    y: 10
                }
            },

            find: (searchType) => {

                if (searchType === searchTypes.SOURCES) {

                    return [
                        {
                            id: "source1",
                            pos: {
                                roomName: "room1",
                                x: 10,
                                y: 7
                            }
                        },
                        {
                            id: "source2",
                            pos: {
                                roomName: "room1",
                                x: 10,
                                y: 13
                            }
                        }
                    ];

                }

                return [];

            },
            name: "room1"
        };

        const memory = {rooms: {"room1": {}}};

        const pathFinder = {
            search: sinon.spy((from, targets, options) => {

                if (!options ||
                    options.maxRooms !== 1 ||
                    options.plainCost !== 1 ||
                    options.swampCost !== 2 || !targets ||
                    targets.length !== 1 ||
                    targets[0].range !== 1 ||
                    targets[0].pos.roomName !== "room1" ||
                    from.roomName !== "room1" ||
                    from.x !== 10 ||
                    from.y !== 10
                ) {

                    return {
                        result: {
                            incomplete: true,
                            path: []
                        }
                    };

                }

                if (targets[0].pos.x === 10 && targets[0].pos.y === 7) {

                    return {
                        incomplete: false,
                        path: [
                            {
                                roomName: "room1",
                                x: 11,
                                y: 9
                            },
                            {
                                roomName: "room1",
                                x: 12,
                                y: 8
                            }
                        ]
                    };

                }
                if (targets[0].pos.x === 10 && targets[0].pos.y === 13) {

                    return {
                        incomplete: false,
                        path: [
                            {
                                roomName: "room1",
                                x: 11,
                                y: 11
                            },
                            {
                                roomName: "room1",
                                x: 12,
                                y: 12
                            }
                        ]
                    };

                }

                return {
                    result: {
                        incomplete: true,
                        path: []
                    }
                };

            })
        };

        const reserveRoomTile = sinon.spy();

        const ctx = {
            memory,
            pathFinder,
            reserveRoomTile
        };

        const result1 = calculateRoads(ctx, room);

        expect(result1).to.be.false;
        expect(pathFinder.search.callCount).to.equal(0);


        const result2 = calculateRoads(ctx, room);

        expect(result2).to.be.false;
        expect(pathFinder.search.callCount).to.equal(1);

        const result3 = calculateRoads(ctx, room);

        expect(result3).to.be.true;
        expect(pathFinder.search.callCount).to.equal(2);
        const roomStructures = memory.rooms.room1.structures;

        expect(roomStructures).to.be.ok;
        expect(roomStructures[structureTypes.ROAD]).to.be.ok;
        expect(roomStructures[structureTypes.ROAD].calculated).to.be.ok;
        expect(
            roomStructures[structureTypes.ROAD].calculated.length
        ).to.equal(4);

        const cords = _.indexBy(
            roomStructures[structureTypes.ROAD].calculated,
            (road) => `(${road.x},${road.y})`
        );

        expect(_.has(cords, "(11,9)")).to.be.true;
        expect(_.has(cords, "(11,11)")).to.be.true;
        expect(_.has(cords, "(12,8)")).to.be.true;
        expect(_.has(cords, "(12,12)")).to.be.true;

        expect(reserveRoomTile.callCount).to.equal(4);
        expect(
            reserveRoomTile.calledWith(sinon.match.any, sinon.match.any, 11, 9)
        ).to.be.true;
        expect(
            reserveRoomTile.calledWith(sinon.match.any, sinon.match.any, 11, 11)
        ).to.be.true;
        expect(
            reserveRoomTile.calledWith(sinon.match.any, sinon.match.any, 12, 8)
        ).to.be.true;
        expect(
            reserveRoomTile.calledWith(sinon.match.any, sinon.match.any, 12, 12)
        ).to.be.true;

    });

});
