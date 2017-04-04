const expect = require("chai").expect;
//const sinon = require("sinon");

const WorkerController = require("../src/class.WorkerController");


const stubCreep = (carriedEnergy) => ({
    carry: {
        energy: carriedEnergy
    },
    memory: {},
    pos: {
        x: 0,
        y: 0
    },
    upgradeController: () => undefined
});

const stubRoom = (sources) => ({
    sources,
    controller: {id: "controllerId"}
});


describe("WorkerController", () => {

    describe("constructor", () => {

        it("throws exception when creep is null", () => {
            expect(() => new WorkerController({
                creep: null,
                room: stubRoom()
            })).to.throw("creep can't be null");
        });

        it("throws exception when room is null", () => {
            expect(() => new WorkerController({
                creep: stubCreep(),
                room: null
            })).to.throw("room can't be null");
        });
    });

    // describe("#execute", () => {
    //
    //     it("no energy carried", () => {
    //         const creep = stubCreep(0);
    //         const room = stubRoom([
    //             {id: "source1"},
    //             {id: "source2"},
    //         ]);
    //         const upgradeController = new WorkerController({creep, room});
    //         upgradeController.execute();
    //     });
    // });
});



