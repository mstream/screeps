const {expect} = require("chai");

const cleanMemory = require("../main/fn.cleanMemory");


describe("cleanMemory", () => {

    it("cleans memory properly", () => {

        const game = {
            creeps: {"creep1": {}},
            rooms: {"room1": {}}
        };

        const memory = {
            creeps: {
                "creep1": {},
                "creep2": {}
            },
            rooms: {
                "room1": {},
                "room2": {}
            }
        };

        const ctx = {
            game,
            memory
        };

        cleanMemory(ctx);

        expect(memory.creeps.creep1).to.be.ok;
        expect(memory.creeps.creep2).to.not.be.ok;
        expect(memory.rooms.room1).to.be.ok;
        expect(memory.rooms.room2).to.not.be.ok;

    });

});
