const expect = require("chai").expect;
const MemoryCleaner = require("../src/class.MemoryCleaner");


const stubMemory = (creeps = {}, rooms = {}) => ({creeps, rooms});
const stubGame = (creeps = {}, rooms = {}) => ({creeps, rooms});


describe("MemoryCleaner", () => {

    describe("constructor", () => {

        it("throws exception during memoryCleaner creation when memory is null", () => {
            expect(() => new MemoryCleaner(null, stubGame())).to.throw("memory can't be null");
        });

        it("throws exception during memoryCleaner creation when memory is undefined", () => {
            expect(() => new MemoryCleaner(undefined, stubGame())).to.throw("memory can't be null");
        });

        it("throws exception during memoryCleaner creation when game is null", () => {
            expect(() => new MemoryCleaner(stubMemory(), null)).to.throw("game can't be null");
        });

        it("throws exception during memoryCleaner creation when game is undefined", () => {
            expect(() => new MemoryCleaner(stubMemory(), undefined)).to.throw("game can't be null");
        });

        it("cleans dead creeps memory", () => {
            const memory = stubMemory({creep1: {}, creep2: {}, creep3: {}}, {});
            const game = stubGame({creep1: {}, creep3: {}}, {});
            const memoryCleaner = new MemoryCleaner(memory, game);
            memoryCleaner.clearCreepsMemory();
            expect(memory.creeps.creep1).to.be.ok;
            expect(memory.creeps.creep2).to.be.undefined;
            expect(memory.creeps.creep3).to.be.ok;
        });

        it("cleans dead rooms memory", () => {
            const memory = stubMemory({}, {room1: {}, room2: {}, room3: {}});
            const game = stubGame({}, {room1: {}, room3: {}});
            const memoryCleaner = new MemoryCleaner(memory, game);
            memoryCleaner.clearRoomsMemory();
            expect(memory.rooms.room1).to.be.ok;
            expect(memory.rooms.room2).to.be.undefined;
            expect(memory.rooms.room3).to.be.ok;
        });
    });
});



