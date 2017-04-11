const {expect} = require("chai");

const generateTaskIndex = require("../main/fn.generateTaskIndex");

const taskTypes = require("../main/const.taskTypes");


describe("generateTaskIndex", () => {

    it("throws exception when task type is unknown", () => {

        const task = {
            sourceId: "source1",
            type: "unknownTaskType"
        };

        expect(
            () => generateTaskIndex(task)
        ).to.throw("unknown task type: unknownTaskType");


    });

    it("generates proper index for building task", () => {

        const task = {
            priority: 123,
            sourceId: "source1",
            type: taskTypes.BUILDING
        };

        const result = generateTaskIndex(task);

        expect(result).to.equal(
            "building_structures_using_source_source1_with_priority_123"
        );

    });

    it("generates proper index for building task", () => {

        const task = {
            priority: 123,
            sourceId: "source1",
            type: taskTypes.COLLECTING
        };

        const result = generateTaskIndex(task);

        expect(result).to.equal(
            "collecting_energy_using_source_source1_with_priority_123"
        );

    });

    it("generates proper index for building task", () => {

        const task = {
            priority: 123,
            sourceId: "source1",
            type: taskTypes.UPGRADING
        };

        const result = generateTaskIndex(task);

        expect(result).to.equal(
            "upgrading_controller_using_source_source1_with_priority_123"
        );

    });

});
