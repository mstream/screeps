const {expect} = require("chai");

const assignTaskToCreep = require("../main/fn.assignTaskToCreep");


describe("assignTaskToCreep", () => {

    it("should assign properly", () => {

        const creep = {name: "creep1"};

        const game = {
            creeps: {creep1: {}},
            time: 123
        };

        const room = {name: "room1"};

        const memory = {
            creeps: {creep1: {}},
            rooms: {
                room1: {
                    creepTasks: {
                        assignment: {"task2": "creep2"},
                        priority: {
                            4: ["task1"],
                            6: ["task2"]
                        },
                        required: {
                            "task1": {
                                priority: 4,
                                sourceId: "source1",
                                type: "type1"
                            },
                            "task2": {
                                priority: 6,
                                sourceId: "source2",
                                type: "type2"
                            }
                        }
                    }
                }
            }
        };

        const ctx = {
            game,
            memory
        };

        assignTaskToCreep(ctx, room, creep);

        expect(memory.creeps.creep1.task).to.be.ok;
        expect(memory.creeps.creep1.task.priority).to.equal(4);
        expect(memory.creeps.creep1.task.sourceId).to.equal("source1");
        expect(memory.creeps.creep1.task.type).to.equal("type1");

        expect(
            memory.rooms.room1.creepTasks.assignment.task1
        ).to.equal("creep1");

        expect(memory.rooms.room1.creepTasks.assignment.task2).to.not.be.ok;

    });

});
