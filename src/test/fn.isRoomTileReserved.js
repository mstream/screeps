const {expect} = require("chai");

const isRoomTileReserved = require("../main/fn.isRoomTileReserved");


describe("isRoomTileReserved", () => {

    it("throws exception when cords are out of range", () => {

        const room = {name: "room1"};
        const memory = {rooms: {room1: {}}};
        const ctx = {memory};

        expect(
            () => isRoomTileReserved(ctx, room, -1, 0)
        ).to.throw("x has to be in range of [0,49]");

        expect(
            () => isRoomTileReserved(ctx, room, 0, -1)
        ).to.throw("y has to be in range of [0,49]");

    });


    it("reserves room tiles properly", () => {

        const room = {name: "room1"};
        const memory = {rooms: {room1: {}}};
        const ctx = {memory};

        const reservedTiles1 = [];

        for (let y = 0; y < 50; y += 1) {

            for (let x = 0; x < 50; x += 1) {

                if (isRoomTileReserved(ctx, room, x, y)) {

                    reservedTiles1.push({
                        x,
                        y
                    });

                }

            }

        }

        expect(reservedTiles1.length).to.equal(0);


        for (let y = 0; y < 50; y += 1) {

            for (let x = 0; x < 50; x += 1) {

                memory.rooms.room1.reservedTiles[y][x] =
                    x % 10 === 0 && y % 10 === 0 && x === y;

            }

        }


        const reservedTiles2 = [];

        for (let y = 0; y < 50; y += 1) {

            for (let x = 0; x < 50; x += 1) {

                if (isRoomTileReserved(ctx, room, x, y)) {

                    reservedTiles2.push({
                        x,
                        y
                    });

                }

            }

        }

        expect(reservedTiles2.length).to.equal(5);
        expect(reservedTiles2[0].x).to.equal(0);
        expect(reservedTiles2[0].y).to.equal(0);
        expect(reservedTiles2[1].x).to.equal(10);
        expect(reservedTiles2[1].y).to.equal(10);
        expect(reservedTiles2[2].x).to.equal(20);
        expect(reservedTiles2[2].y).to.equal(20);
        expect(reservedTiles2[3].x).to.equal(30);
        expect(reservedTiles2[3].y).to.equal(30);
        expect(reservedTiles2[4].x).to.equal(40);
        expect(reservedTiles2[4].y).to.equal(40);

    });

});
