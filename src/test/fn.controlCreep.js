const {expect} = require("chai");
const sinon = require("sinon");

const controlCreep = require("../main/fn.controlCreep");

//const structureTypes = require("../main/const.structureTypes");


describe("controlCreep", () => {

    it("xxx", () => {

        const assignTaskToCreep = sinon.spy();
        const drawCreepStatus = () => null;
        const executeStructuresBuilding = () => null;
        const executeControllerUpgrading = () => null;
        const executeEnergyCollecting = () => null;
        const withdrawTaskFromCreep = () => null;

        const room = {name: "room1"};

        const memory = {
            creeps: {"creep1": {}},
            rooms: {room1: {}}
        };

        const creep = {
            name: "creep1",
            room
        };

        const ctx = {
            assignTaskToCreep,
            drawCreepStatus,
            executeControllerUpgrading,
            executeEnergyCollecting,
            executeStructuresBuilding,
            memory,
            withdrawTaskFromCreep
        };

        controlCreep(ctx, creep);

        expect(
            assignTaskToCreep.calledWith(
                sinon.match.any, sinon.match.any, sinon.match.any
            )
        ).to.be.true;

    });

});
