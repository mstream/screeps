const {expect} = require("chai");

const reserveRoomTile = require("../main/fn.reserveRoomTile");


describe("reserveRoomTile", () => {

    it("throws exception when cords are out of range", () => {

        const room = {name: "room1"};
        const memory = {rooms: {room1: {}}};
        const ctx = {memory};

        expect(
            () => reserveRoomTile(ctx, room, -1, 0)
        ).to.throw("x has to be in range of [0,49]");

        expect(
            () => reserveRoomTile(ctx, room, 0, -1)
        ).to.throw("y has to be in range of [0,49]");

    });

    it("reserves room tiles properly", () => {

        const room = {name: "room1"};
        const memory = {rooms: {room1: {}}};
        const ctx = {memory};

        reserveRoomTile(ctx, room, 0, 0);
        reserveRoomTile(ctx, room, 10, 10);
        reserveRoomTile(ctx, room, 20, 20);

        expect(memory.rooms.room1.reservedTiles).to.be.ok;

        const reservedTiles = [];

        for (let y = 0; y < 50; y += 1) {

            for (let x = 0; x < 50; x += 1) {

                if (memory.rooms.room1.reservedTiles[y][x]) {

                    reservedTiles.push({
                        x,
                        y
                    });

                }

            }

        }

        expect(reservedTiles.length).to.equal(3);
        expect(reservedTiles[0].x).to.equal(0);
        expect(reservedTiles[0].y).to.equal(0);
        expect(reservedTiles[1].x).to.equal(10);
        expect(reservedTiles[1].y).to.equal(10);
        expect(reservedTiles[2].x).to.equal(20);
        expect(reservedTiles[2].y).to.equal(20);

    });

});
