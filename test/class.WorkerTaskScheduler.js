const expect = require("chai").expect;
const WorkerTaskScheduler = require("../src/class.WorkerTaskScheduler");
const WorkerTask = require("../src/class.WorkerTask");


const stubGame = () => ({});
const stubMemory = () => ({});
const stubLogger = () => ({});
const stubRoom = (sources) => ({
    sources,
    controller: {id: "controllerId"}
});


describe("WorkerTaskScheduler", () => {

    describe("constructor", () => {

        it("throws an exception when gameProvider is null", () => {
            expect(() => new WorkerTaskScheduler({
                gameProvider: null,
                memory: stubMemory(),
                logger: stubLogger()
            })).to.throw("gameProvider can't be null");
        });

        it("throws an exception when memory is null", () => {
            expect(() => new WorkerTaskScheduler({
                gameProvider: stubGame(),
                memory: null,
                logger: stubLogger()
            })).to.throw("memory can't be null");
        });

        it("throws an exception when logger is null", () => {
            expect(() => new WorkerTaskScheduler({
                gameProvider: stubGame(),
                memory: stubMemory(),
                logger: null
            })).to.throw("logger can't be null");
        });
    });

    describe("#schedule", () => {

        it("throws an exception when room is null", () => {
            const gameProvider = stubGame();
            const memory = stubMemory();
            const logger = stubLogger();
            const workerTaskScheduler = new WorkerTaskScheduler({
                gameProvider, memory, logger
            });
            expect(
                () => workerTaskScheduler.schedule(null)
            ).to.throw("room can't be null");
        });

        it("creates task for controller upgrading", () => {
            const gameProvider = stubGame();
            const memory = stubMemory();
            const logger = stubLogger();
            const room = stubRoom([{id: "source1"}, {id: "source2"}]);
            const workerTaskScheduler = new WorkerTaskScheduler({
                gameProvider, memory, logger
            });
            workerTaskScheduler.schedule(room);
            const expectedTaskHash1 = new WorkerTask(
                WorkerTask.types.UPGRADING,
                room.sources[0].id,
                room.controller.id
            ).hash;
            const expectedTaskHash2 = new WorkerTask(
                WorkerTask.types.UPGRADING,
                room.sources[1].id,
                room.controller.id
            ).hash;

            expect(memory.creepTasks.worker[10]).to.be.ok;
            const serializedTasks = memory.creepTasks.worker[10];
            expect(serializedTasks[expectedTaskHash1]).to.be.ok;
            const actualTask1 = serializedTasks[expectedTaskHash1];
            expect(serializedTasks[expectedTaskHash2]).to.be.ok;
            const actualTask2 = serializedTasks[expectedTaskHash2];

            expect(actualTask1.type).to.equal(WorkerTask.types.UPGRADING);
            expect(actualTask1.sourceId).to.equal("source1");
            expect(actualTask1.targetId).to.equal("controllerId");
            expect(actualTask2.type).to.equal(WorkerTask.types.UPGRADING);
            expect(actualTask2.sourceId).to.equal("source2");
            expect(actualTask2.targetId).to.equal("controllerId");
        });
    });
});



