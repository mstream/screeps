const expect = require("chai").expect;
const MemoryCleaner = require("../src/class.MemoryCleaner");


const stubMemory = (creeps = {}, rooms = {}) => ({creeps, rooms});
const stubGame = (creeps = {}, rooms = {}) => ({creeps, rooms});


describe("MemoryCleaner", () => {

    describe("constructor", () => {

        it("throws exception during memoryCleaner creation when memory is null", () => {
            expect(
                () => new MemoryCleaner({memory: null, gameProvider: stubGame()})
            ).to.throw("memory can't be null");
        });

        it("throws exception during memoryCleaner creation when gameProvider is null", () => {
            expect(
                () => new MemoryCleaner({memory: stubMemory(), gameProvider: null})
            ).to.throw("gameProvider can't be null");
        });

        it("cleans dead creeps memory", () => {
            const memory = stubMemory({creep1: {}, creep2: {}, creep3: {}}, {});
            const gameProvider = stubGame({creep1: {}, creep3: {}}, {});
            const memoryCleaner = new MemoryCleaner({memory, gameProvider});
            memoryCleaner.clearCreepsMemory();
            expect(memory.creeps.creep1).to.be.ok;
            expect(memory.creeps.creep2).to.be.undefined;
            expect(memory.creeps.creep3).to.be.ok;
        });

        it("cleans dead rooms memory", () => {
            const memory = stubMemory({}, {room1: {}, room2: {}, room3: {}});
            const gameProvider = stubGame({}, {room1: {}, room3: {}});
            const memoryCleaner = new MemoryCleaner({memory, gameProvider});
            memoryCleaner.clearRoomsMemory();
            expect(memory.rooms.room1).to.be.ok;
            expect(memory.rooms.room2).to.be.undefined;
            expect(memory.rooms.room3).to.be.ok;
        });
    });
});



