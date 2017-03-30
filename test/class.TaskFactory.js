const expect = require("chai").expect;
const TaskFactory = require("../src/class.TaskFactory");
const taskTypes = require("../src/const.taskTypes");


describe("TaskFactory", () => {

    describe("constructor", () => {

        it("throws exception taskCosts is null", () => {
            expect(
                () => new TaskFactory({taskCosts: null})
            ).to.throw("taskCosts can't be null");
        });
    });

    describe("#fromJSON()", () => {

        it("throws exception during task creation when task type is null", () => {
            expect(
                () => new TaskFactory({taskCosts: {}}).fromJSON({
                    type: null,
                    options: {}
                })
            ).to.throw("type can't be null");
        });

        it("throws exception during task creation when task type is undefined", () => {
            expect(
                () => new TaskFactory({taskCosts: {}}).fromJSON({
                    type: undefined, options: {}
                })
            ).to.throw("type can't be null");
        });

        it("throws exception during task creation when task type is unknown", () => {
            expect(
                () => new TaskFactory({taskCosts: {"unknown": 1}}).fromJSON({
                    type: "unknown", options: {}
                })
            ).to.throw("unknown task type: unknown");
        });

        it("throws exception during task creation when cost of the task is undefined", () => {
            expect(
                () => new TaskFactory({taskCosts: {[taskTypes.ROADS_BUILDING]: 1}}).fromJSON({
                    type: taskTypes.WALLS_BUILDING,
                    options: {foo: "bar"}
                })
            ).to.throw(`undefined cost for task type: ${taskTypes.WALLS_BUILDING}`);
        });

        it("fromJSONs exits computing tasks", () => {
            const taskFactory = new TaskFactory({
                taskCosts: {[taskTypes.EXITS_COMPUTING]: 1}
            });
            const task = taskFactory.fromJSON({
                type: taskTypes.EXITS_COMPUTING,
                options: {foo: "bar"}
            });
            expect(task.type).to.equal(taskTypes.EXITS_COMPUTING);
            expect(task.cost).to.equal(1);
            expect(task.options.foo).to.equal("bar");
        });

        it("fromJSONs extensions building tasks", () => {
            const taskFactory = new TaskFactory({
                taskCosts: {[taskTypes.EXTENSIONS_BUILDING]: 1}
            });
            const task = taskFactory.fromJSON({
                type: taskTypes.EXTENSIONS_BUILDING,
                options: {foo: "bar"}
            });
            expect(task.type).to.equal(taskTypes.EXTENSIONS_BUILDING);
            expect(task.cost).to.equal(1);
            expect(task.options.foo).to.equal("bar");
        });

        it("fromJSONs extensions computing tasks", () => {
            const taskFactory = new TaskFactory({
                taskCosts: {[taskTypes.EXTENSIONS_COMPUTING]: 1}
            });
            const task = taskFactory.fromJSON({
                type: taskTypes.EXTENSIONS_COMPUTING,
                options: {foo: "bar"}
            });
            expect(task.type).to.equal(taskTypes.EXTENSIONS_COMPUTING);
            expect(task.cost).to.equal(1);
            expect(task.options.foo).to.equal("bar");
        });

        it("fromJSONs extensions computing tasks", () => {
            const taskFactory = new TaskFactory({
                taskCosts: {[taskTypes.EXTENSIONS_COMPUTING]: 1}
            });
            const task = taskFactory.fromJSON({
                type: taskTypes.EXTENSIONS_COMPUTING,
                options: {foo: "bar"}
            });
            expect(task.type).to.equal(taskTypes.EXTENSIONS_COMPUTING);
            expect(task.cost).to.equal(1);
            expect(task.options.foo).to.equal("bar");
        });

        it("fromJSONs road computing tasks", () => {
            const taskFactory = new TaskFactory({
                taskCosts: {[taskTypes.ROAD_COMPUTING]: 1}
            });
            const task = taskFactory.fromJSON({
                type: taskTypes.ROAD_COMPUTING,
                options: {foo: "bar"}
            });
            expect(task.type).to.equal(taskTypes.ROAD_COMPUTING);
            expect(task.cost).to.equal(1);
            expect(task.options.foo).to.equal("bar");
        });

        it("fromJSONs roads building tasks", () => {
            const taskFactory = new TaskFactory({
                taskCosts: {[taskTypes.ROADS_BUILDING]: 1}
            });
            const task = taskFactory.fromJSON({
                type: taskTypes.ROADS_BUILDING,
                options: {foo: "bar"}
            });
            expect(task.type).to.equal(taskTypes.ROADS_BUILDING);
            expect(task.cost).to.equal(1);
            expect(task.options.foo).to.equal("bar");
        });

        it("fromJSONs walls computing tasks", () => {
            const taskFactory = new TaskFactory({
                taskCosts: {[taskTypes.WALLS_COMPUTING]: 1}
            });
            const task = taskFactory.fromJSON({
                type: taskTypes.WALLS_COMPUTING,
                options: {foo: "bar"}
            });
            expect(task.type).to.equal(taskTypes.WALLS_COMPUTING);
            expect(task.cost).to.equal(1);
            expect(task.options.foo).to.equal("bar");
        });

        it("fromJSONs walls building tasks", () => {
            const taskFactory = new TaskFactory({
                taskCosts: {[taskTypes.WALLS_BUILDING]: 1}
            });
            const task = taskFactory.fromJSON({
                type: taskTypes.WALLS_BUILDING,
                options: {foo: "bar"}
            });
            expect(task.type).to.equal(taskTypes.WALLS_BUILDING);
            expect(task.cost).to.equal(1);
            expect(task.options.foo).to.equal("bar");
        });
    });

    describe("#create", () => {

        it("throws exception during task creation when task type is null", () => {
            expect(
                () => new TaskFactory({taskCosts: {}}).create(null, {})
            ).to.throw("type can't be null");
        });

        it("throws exception during task creation when task type is undefined", () => {
            expect(
                () => new TaskFactory({taskCosts: {}}).create(undefined, {})
            ).to.throw("type can't be null");
        });

        it("throws exception during task creation when task type is unknown", () => {
            expect(
                () => new TaskFactory({taskCosts: {"unknown": 1}}).create("unknown", {})
            ).to.throw("unknown task type: unknown");
        });

        it("throws exception during task creation when task type is unknown", () => {
            expect(
                () => new TaskFactory({taskCosts: {[taskTypes.ROADS_BUILDING]: 1}}).create(taskTypes.WALLS_BUILDING, {})
            ).to.throw(`undefined cost for task type: ${taskTypes.WALLS_BUILDING}`);
        });

        it("creates exits computing tasks", () => {
            const taskFactory = new TaskFactory({taskCosts: {[taskTypes.EXITS_COMPUTING]: 1}});
            const task = taskFactory.create(taskTypes.EXITS_COMPUTING, {foo: "bar"});
            expect(task.type).to.equal(taskTypes.EXITS_COMPUTING);
            expect(task.cost).to.equal(1);
            expect(task.options.foo).to.equal("bar");
        });

        it("creates extensions building tasks", () => {
            const taskFactory = new TaskFactory({taskCosts: {[taskTypes.EXTENSIONS_BUILDING]: 1}});
            const task = taskFactory.create(taskTypes.EXTENSIONS_BUILDING, {foo: "bar"});
            expect(task.type).to.equal(taskTypes.EXTENSIONS_BUILDING);
            expect(task.cost).to.equal(1);
            expect(task.options.foo).to.equal("bar");
        });

        it("creates extensions computing tasks", () => {
            const taskFactory = new TaskFactory({taskCosts: {[taskTypes.EXTENSIONS_COMPUTING]: 1}});
            const task = taskFactory.create(taskTypes.EXTENSIONS_COMPUTING, {foo: "bar"});
            expect(task.type).to.equal(taskTypes.EXTENSIONS_COMPUTING);
            expect(task.cost).to.equal(1);
            expect(task.options.foo).to.equal("bar");
        });

        it("creates extensions computing tasks", () => {
            const taskFactory = new TaskFactory({taskCosts: {[taskTypes.EXTENSIONS_COMPUTING]: 1}});
            const task = taskFactory.create(taskTypes.EXTENSIONS_COMPUTING, {foo: "bar"});
            expect(task.type).to.equal(taskTypes.EXTENSIONS_COMPUTING);
            expect(task.cost).to.equal(1);
            expect(task.options.foo).to.equal("bar");
        });

        it("creates road computing tasks", () => {
            const taskFactory = new TaskFactory({taskCosts: {[taskTypes.ROAD_COMPUTING]: 1}});
            const task = taskFactory.create(taskTypes.ROAD_COMPUTING, {foo: "bar"});
            expect(task.type).to.equal(taskTypes.ROAD_COMPUTING);
            expect(task.cost).to.equal(1);
            expect(task.options.foo).to.equal("bar");
        });

        it("creates roads building tasks", () => {
            const taskFactory = new TaskFactory({taskCosts: {[taskTypes.ROADS_BUILDING]: 1}});
            const task = taskFactory.create(taskTypes.ROADS_BUILDING, {foo: "bar"});
            expect(task.type).to.equal(taskTypes.ROADS_BUILDING);
            expect(task.cost).to.equal(1);
            expect(task.options.foo).to.equal("bar");
        });

        it("creates walls computing tasks", () => {
            const taskFactory = new TaskFactory({taskCosts: {[taskTypes.WALLS_COMPUTING]: 1}});
            const task = taskFactory.create(taskTypes.WALLS_COMPUTING, {foo: "bar"});
            expect(task.type).to.equal(taskTypes.WALLS_COMPUTING);
            expect(task.cost).to.equal(1);
            expect(task.options.foo).to.equal("bar");
        });

        it("creates walls building tasks", () => {
            const taskFactory = new TaskFactory({taskCosts: {[taskTypes.WALLS_BUILDING]: 1}});
            const task = taskFactory.create(taskTypes.WALLS_BUILDING, {foo: "bar"});
            expect(task.type).to.equal(taskTypes.WALLS_BUILDING);
            expect(task.cost).to.equal(1);
            expect(task.options.foo).to.equal("bar");
        });
    });
});



