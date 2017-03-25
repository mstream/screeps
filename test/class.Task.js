const expect = require("chai").expect;
const Task = require("../src/class.Task");
const taskTypes = require("../src/const.taskTypes");


describe("Task", () => {

    describe("#fromJSON()", () => {

        it("creates task from JSON", () => {
            const task = Task.fromJSON({
                type: taskTypes.EXITS_COMPUTING,
                options: {
                    foo: "bar"
                }
            });
            expect(task.type).to.equal(taskTypes.EXITS_COMPUTING);
            expect(task.options.foo).to.equal("bar");
        });
    });

    describe("#toJSON()", () => {

        it("serializes to JSON", () => {
            const serializedTask = new Task(
                taskTypes.EXITS_COMPUTING,
                {
                    foo: "bar"
                }
            ).toJSON();
            expect(serializedTask.type).to.equal(taskTypes.EXITS_COMPUTING);
            expect(serializedTask.options.foo).to.equal("bar");
        });
    });

    describe("#cost", () => {

        it("exits computing task cost is proper", () => {
            const taskCost = new Task(
                taskTypes.EXITS_COMPUTING
            ).cost;
            expect(taskCost).to.equal(10);

        });
    });

    describe("constructor", () => {

        it("creates exits computing task", () => {
            const task = new Task(taskTypes.EXITS_COMPUTING, {foo: "bar"});
            expect(task.type).to.equal(taskTypes.EXITS_COMPUTING);
            expect(task.options.foo).to.equal("bar");
        });

        it("creates roads building task", () => {
            const task = new Task(taskTypes.ROADS_BUILDING, {foo: "bar"});
            expect(task.type).to.equal(taskTypes.ROADS_BUILDING);
            expect(task.options.foo).to.equal("bar");
        });

        it("creates paths computing task", () => {
            const task = new Task(taskTypes.ROAD_COMPUTING, {foo: "bar"});
            expect(task.type).to.equal(taskTypes.ROAD_COMPUTING);
            expect(task.options.foo).to.equal("bar");
        });

        it("creates walls building task", () => {
            const task = new Task(taskTypes.WALLS_BUILDING, {foo: "bar"});
            expect(task.type).to.equal(taskTypes.WALLS_BUILDING);
            expect(task.options.foo).to.equal("bar");
        });

        it("creates walls computing task", () => {
            const task = new Task(taskTypes.WALLS_COMPUTING, {foo: "bar"});
            expect(task.type).to.equal(taskTypes.WALLS_COMPUTING);
            expect(task.options.foo).to.equal("bar");
        });

        it("throws exception during task creation when task type is null", () => {
            expect(() => new Task(null, {foo: "bar"})).to.throw("type can't be null");
        });

        it("throws exception during task creation when task type is undefined", () => {
            expect(() => new Task(undefined, {foo: "bar"})).to.throw("type can't be null");
        });

        it("throws exception during task creation when task type is unknown", () => {
            expect(() => new Task("unknown", {foo: "bar"})).to.throw("unknown task type: unknown");
        });
    });
});



