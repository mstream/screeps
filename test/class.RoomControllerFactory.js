const expect = require("chai").expect;

const RoomControllerFactory = require("../src/class.RoomControllerFactory");


const stubRoom = () => ({});
const stubGame = () => ({});
const stubMemory = () => ({});
const stubTaskScheduler = () => ({});
const stubTaskExecutor = () => ({});
const stubWorkerTaskScheduler = () => ({});
const stubSpawnControllerFactory = () => ({});
const stubExtensionsBuilder = () => ({});
const stubRoadsBuilder = () => ({});
const stubWallsBuilder = () => ({});


describe("RoomControllerFactory", () => {

    describe("constructor", () => {

        it("throws an exception when gameProvider is null", () => {
            expect(() => new RoomControllerFactory({
                gameProvider: null,
                memory: stubMemory(),
                taskScheduler: stubTaskScheduler(),
                taskExecutor: stubTaskExecutor(),
                workerTaskScheduler: stubWorkerTaskScheduler(),
                spawnControllerFactory: stubSpawnControllerFactory(),
                extensionsBuilder: stubExtensionsBuilder(),
                roadsBuilder: stubRoadsBuilder(),
                wallsBuilder: stubWallsBuilder()
            })).to.throw("gameProvider can't be null");
        });

        it("throws an exception when memory is null", () => {
            expect(() => new RoomControllerFactory({
                gameProvider: stubGame(),
                memory: null,
                taskScheduler: stubTaskScheduler(),
                taskExecutor: stubTaskExecutor(),
                workerTaskScheduler: stubWorkerTaskScheduler(),
                spawnControllerFactory: stubSpawnControllerFactory(),
                extensionsBuilder: stubExtensionsBuilder(),
                roadsBuilder: stubRoadsBuilder(),
                wallsBuilder: stubWallsBuilder()
            })).to.throw("memory can't be null");
        });

        it("throws an exception when taskScheduler is null", () => {
            expect(() => new RoomControllerFactory({
                gameProvider: stubGame(),
                memory: stubMemory(),
                taskScheduler: null,
                taskExecutor: stubTaskExecutor(),
                workerTaskScheduler: stubWorkerTaskScheduler(),
                spawnControllerFactory: stubSpawnControllerFactory(),
                extensionsBuilder: stubExtensionsBuilder(),
                roadsBuilder: stubRoadsBuilder(),
                wallsBuilder: stubWallsBuilder()
            })).to.throw("taskScheduler can't be null");
        });

        it("throws an exception when taskExecutor is null", () => {
            expect(() => new RoomControllerFactory({
                gameProvider: stubGame(),
                memory: stubMemory(),
                taskScheduler: stubTaskScheduler(),
                taskExecutor: null,
                workerTaskScheduler: stubWorkerTaskScheduler(),
                spawnControllerFactory: stubSpawnControllerFactory(),
                extensionsBuilder: stubExtensionsBuilder(),
                roadsBuilder: stubRoadsBuilder(),
                wallsBuilder: stubWallsBuilder()
            })).to.throw("taskExecutor can't be null");
        });

        it("throws an exception when spawnControllerFactory is null", () => {
            expect(() => new RoomControllerFactory({
                gameProvider: stubGame(),
                memory: stubMemory(),
                taskScheduler: stubTaskScheduler(),
                taskExecutor: stubTaskExecutor(),
                workerTaskScheduler: stubWorkerTaskScheduler(),
                spawnControllerFactory: null,
                extensionsBuilder: stubExtensionsBuilder(),
                roadsBuilder: stubRoadsBuilder(),
                wallsBuilder: stubWallsBuilder()
            })).to.throw("spawnControllerFactory can't be null");
        });

        it("throws an exception when extensionsBuilder is null", () => {
            expect(() => new RoomControllerFactory({
                gameProvider: stubGame(),
                memory: stubMemory(),
                taskScheduler: stubTaskScheduler(),
                taskExecutor: stubTaskExecutor(),
                workerTaskScheduler: stubWorkerTaskScheduler(),
                spawnControllerFactory: stubSpawnControllerFactory(),
                extensionsBuilder: null,
                roadsBuilder: stubRoadsBuilder(),
                wallsBuilder: stubWallsBuilder()
            })).to.throw("extensionsBuilder can't be null");
        });

        it("throws an exception when roadsBuilder is null", () => {
            expect(() => new RoomControllerFactory({
                gameProvider: stubGame(),
                memory: stubMemory(),
                taskScheduler: stubTaskScheduler(),
                taskExecutor: stubTaskExecutor(),
                workerTaskScheduler: stubWorkerTaskScheduler(),
                spawnControllerFactory: stubSpawnControllerFactory(),
                extensionsBuilder: stubExtensionsBuilder(),
                roadsBuilder: null,
                wallsBuilder: stubWallsBuilder()
            })).to.throw("roadsBuilder can't be null");
        });

        it("throws an exception when wallsBuilder is null", () => {
            expect(() => new RoomControllerFactory({
                gameProvider: stubGame(),
                memory: stubMemory(),
                taskScheduler: stubTaskScheduler(),
                taskExecutor: stubTaskExecutor(),
                workerTaskScheduler: stubWorkerTaskScheduler(),
                spawnControllerFactory: stubSpawnControllerFactory(),
                extensionsBuilder: stubExtensionsBuilder(),
                roadsBuilder: stubRoadsBuilder(),
                wallsBuilder: null
            })).to.throw("wallsBuilder can't be null");
        });
    });

    describe("#createFor", () => {

        it("throws an exception when room is null", () => {
            const roomControllerFactory = new RoomControllerFactory({
                gameProvider: stubGame(),
                memory: stubMemory(),
                taskScheduler: stubTaskScheduler(),
                taskExecutor: stubTaskExecutor(),
                workerTaskScheduler: stubWorkerTaskScheduler(),
                spawnControllerFactory: stubSpawnControllerFactory(),
                extensionsBuilder: stubExtensionsBuilder(),
                roadsBuilder: stubRoadsBuilder(),
                wallsBuilder: stubWallsBuilder()
            });
            expect(
                () => roomControllerFactory.createFor(null)
            ).to.throw("room can't be null");
        });

        it("returns an executable controller", () => {
            const room = stubRoom();
            const gameProvider = stubGame();
            const memory = stubMemory();

            const taskScheduler = stubTaskScheduler();
            const taskExecutor = stubTaskExecutor();
            const workerTaskScheduler = stubWorkerTaskScheduler();
            const spawnControllerFactory = stubSpawnControllerFactory();
            const extensionsBuilder = stubExtensionsBuilder();
            const roadsBuilder = stubRoadsBuilder();
            const wallsBuilder = stubWallsBuilder();
            const roomControllerFactory = new RoomControllerFactory({
                gameProvider,
                memory,
                taskScheduler,
                taskExecutor,
                workerTaskScheduler,
                spawnControllerFactory,
                extensionsBuilder,
                roadsBuilder,
                wallsBuilder
            });
            const roomController = roomControllerFactory.createFor(room);
            expect(typeof roomController.execute).to.equal("function");
        });
    });
});



