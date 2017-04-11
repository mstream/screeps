const {expect} = require("chai");

const calculateExits = require("../main/fn.calculateExits");

const searchTypes = require("../main/const.searchTypes");


describe("calculateExits", () => {

    it("calculates exits properly", () => {

        const room = {
            find: (searchType) => {

                if (searchType === searchTypes.EXIT_TOP) {

                    return [
                        {
                            roomName: "room1",
                            x: 0,
                            y: 0
                        },
                        {
                            roomName: "room1",
                            x: 10,
                            y: 0
                        },
                        {
                            roomName: "room1",
                            x: 11,
                            y: 0
                        },
                        {
                            roomName: "room1",
                            x: 20,
                            y: 0
                        },
                        {
                            roomName: "room1",
                            x: 21,
                            y: 0
                        },
                        {
                            roomName: "room1",
                            x: 22,
                            y: 0
                        },
                        {
                            roomName: "room1",
                            x: 30,
                            y: 0
                        },
                        {
                            roomName: "room1",
                            x: 31,
                            y: 0
                        },
                        {
                            roomName: "room1",
                            x: 40,
                            y: 0
                        }
                    ];

                }

                if (searchType === searchTypes.EXIT_LEFT) {

                    return [
                        {
                            roomName: "room1",
                            x: 0,
                            y: 0
                        },
                        {
                            roomName: "room1",
                            x: 0,
                            y: 1
                        }
                    ];

                }

                return [];

            },
            name: "room1"
        };

        const memory = {rooms: {"room1": {}}};

        const ctx = {memory};

        const result1 = calculateExits(ctx, room);

        expect(result1).to.be.false;
        expect(memory.rooms.room1.exits).to.be.ok;
        expect(memory.rooms.room1.exits.top).to.be.ok;
        expect(memory.rooms.room1.exits.bottom).to.be.undefined;
        expect(memory.rooms.room1.exits.left).to.be.undefined;
        expect(memory.rooms.room1.exits.right).to.be.undefined;
        expect(memory.rooms.room1.exits.top.length).to.equal(5);
        expect(memory.rooms.room1.exits.top[0].from).to.equal(0);
        expect(memory.rooms.room1.exits.top[0].to).to.equal(0);
        expect(memory.rooms.room1.exits.top[1].from).to.equal(10);
        expect(memory.rooms.room1.exits.top[1].to).to.equal(11);
        expect(memory.rooms.room1.exits.top[2].from).to.equal(20);
        expect(memory.rooms.room1.exits.top[2].to).to.equal(22);
        expect(memory.rooms.room1.exits.top[3].from).to.equal(30);
        expect(memory.rooms.room1.exits.top[3].to).to.equal(31);
        expect(memory.rooms.room1.exits.top[4].from).to.equal(40);
        expect(memory.rooms.room1.exits.top[4].to).to.equal(40);

        const result2 = calculateExits(ctx, room);

        expect(result2).to.be.false;
        expect(memory.rooms.room1.exits.top).to.be.ok;
        expect(memory.rooms.room1.exits.bottom).to.be.ok;
        expect(memory.rooms.room1.exits.left).to.be.undefined;
        expect(memory.rooms.room1.exits.right).to.be.undefined;

        const result3 = calculateExits(ctx, room);

        expect(result3).to.be.false;
        expect(memory.rooms.room1.exits.top).to.be.ok;
        expect(memory.rooms.room1.exits.bottom).to.be.ok;
        expect(memory.rooms.room1.exits.left).to.be.ok;
        expect(memory.rooms.room1.exits.right).to.be.undefined;
        expect(memory.rooms.room1.exits.left.length).to.equal(1);
        expect(memory.rooms.room1.exits.left[0].from).to.equal(0);
        expect(memory.rooms.room1.exits.left[0].to).to.equal(1);

        const result4 = calculateExits(ctx, room);

        expect(result4).to.be.false;
        expect(memory.rooms.room1.exits.top).to.be.ok;
        expect(memory.rooms.room1.exits.bottom).to.be.ok;
        expect(memory.rooms.room1.exits.left).to.be.ok;
        expect(memory.rooms.room1.exits.right).to.be.ok;

        const result5 = calculateExits(ctx, room);

        expect(result5).to.be.true;
        expect(memory.rooms.room1.exits.top).to.be.ok;
        expect(memory.rooms.room1.exits.bottom).to.be.ok;
        expect(memory.rooms.room1.exits.left).to.be.ok;
        expect(memory.rooms.room1.exits.right).to.be.ok;

    });

});
