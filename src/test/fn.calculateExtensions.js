const {expect} = require("chai");
const sinon = require("sinon");
const _ = require("lodash");


const calculateExtensions = require("../main/fn.calculateExtensions");

const searchTypes = require("../main/const.searchTypes");
const structureTypes = require("../main/const.structureTypes");


describe("calculateExtensions", () => {

    it("calculates extensions properly", () => {


        const memory = {rooms: {"room1": {}}};

        const isRoomTileReserved = (ctx, room, x, y) => {

            if (x < 0 || y < 0 || x > 49 || y > 49) {

                throw new Error("cords out of bound");

            }
            if (!ctx || !room || room.name !== "room1") {

                throw new Error("wrong args");

            }

            return y < 2;

        };

        const reserveRoomTile = sinon.spy();

        const room = {

            find: (searchType) => {

                if (searchType === searchTypes.MY_SPAWNS) {

                    return [
                        {
                            id: "spawn1",
                            pos: {
                                roomName: "room1",
                                x: 2,
                                y: 2
                            }
                        }
                    ];

                }

                return [];

            },
            name: "room1"
        };

        const ctx = {
            isRoomTileReserved,
            memory,
            reserveRoomTile
        };

        const result1 = calculateExtensions(ctx, room);

        expect(result1).to.be.false;

        const result2 = calculateExtensions(ctx, room);

        expect(result2).to.be.true;
        const roomStructures = memory.rooms.room1.structures;

        expect(roomStructures).to.be.ok;
        expect(roomStructures[structureTypes.EXTENSION]).to.be.ok;
        expect(roomStructures[structureTypes.EXTENSION].calculated).to.be.ok;

        expect(
            roomStructures[structureTypes.EXTENSION].calculated.length
        ).to.equal(15);

        const cords = _.indexBy(
            roomStructures[structureTypes.EXTENSION].calculated,
            (extension) => `(${extension.x},${extension.y})`
        );

        expect(_.has(cords, "(3,3)")).to.be.true;
        expect(_.has(cords, "(1,3)")).to.be.true;

        expect(_.has(cords, "(4,2)")).to.be.true;
        expect(_.has(cords, "(4,4)")).to.be.true;
        expect(_.has(cords, "(2,4)")).to.be.true;
        expect(_.has(cords, "(0,4)")).to.be.true;
        expect(_.has(cords, "(0,2)")).to.be.true;

        expect(_.has(cords, "(5,3)")).to.be.true;
        expect(_.has(cords, "(5,5)")).to.be.true;
        expect(_.has(cords, "(3,5)")).to.be.true;
        expect(_.has(cords, "(1,5)")).to.be.true;

        expect(_.has(cords, "(6,2)")).to.be.true;
        expect(_.has(cords, "(6,4)")).to.be.true;
        expect(_.has(cords, "(6,6)")).to.be.true;
        expect(_.has(cords, "(4,6)")).to.be.true;

        expect(reserveRoomTile.callCount).to.equal(15);
        expect(
            reserveRoomTile.calledWith(sinon.match.any, sinon.match.any, 3, 3)
        ).to.be.true;
        expect(
            reserveRoomTile.calledWith(sinon.match.any, sinon.match.any, 1, 3)
        ).to.be.true;
        expect(
            reserveRoomTile.calledWith(sinon.match.any, sinon.match.any, 4, 2)
        ).to.be.true;
        expect(
            reserveRoomTile.calledWith(sinon.match.any, sinon.match.any, 4, 4)
        ).to.be.true;

        expect(
            reserveRoomTile.calledWith(sinon.match.any, sinon.match.any, 0, 4)
        ).to.be.true;
        expect(
            reserveRoomTile.calledWith(sinon.match.any, sinon.match.any, 0, 2)
        ).to.be.true;
        expect(
            reserveRoomTile.calledWith(sinon.match.any, sinon.match.any, 5, 3)
        ).to.be.true;
        expect(
            reserveRoomTile.calledWith(sinon.match.any, sinon.match.any, 5, 5)
        ).to.be.true;
        expect(
            reserveRoomTile.calledWith(sinon.match.any, sinon.match.any, 3, 5)
        ).to.be.true;
        expect(
            reserveRoomTile.calledWith(sinon.match.any, sinon.match.any, 1, 5)
        ).to.be.true;
        expect(
            reserveRoomTile.calledWith(sinon.match.any, sinon.match.any, 6, 2)
        ).to.be.true;
        expect(
            reserveRoomTile.calledWith(sinon.match.any, sinon.match.any, 6, 4)
        ).to.be.true;
        expect(
            reserveRoomTile.calledWith(sinon.match.any, sinon.match.any, 6, 6)
        ).to.be.true;
        expect(
            reserveRoomTile.calledWith(sinon.match.any, sinon.match.any, 4, 6)
        ).to.be.true;

    });

});
