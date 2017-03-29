const expect = require("chai").expect;

const CreepControllerFactory = require("../src/class.CreepControllerFactory");

const roles = require("../src/const.roles");


const stubCreep = (role) => ({memory: {role}});

const stubRoom = () => ({});


describe("CreepControllerFactory", () => {

    describe("#createFor", () => {

        it("throws an exception when creep is null", () => {
            expect(() => new CreepControllerFactory().createFor(
                null,
                stubRoom()
            )).to.throw("creep can't be null");
        });

        it("throws an exception when creep is undefined", () => {
            expect(() => new CreepControllerFactory().createFor(
                undefined,
                stubRoom()
            )).to.throw("creep can't be null");
        });

        it("throws an exception when room is null", () => {
            expect(() => new CreepControllerFactory().createFor(
                stubCreep(roles.BUILDER),
                null
            )).to.throw("room can't be null");
        });

        it("throws an exception when room is undefined", () => {
            expect(() => new CreepControllerFactory().createFor(
                stubCreep(roles.BUILDER),
                undefined
            )).to.throw("room can't be null");
        });

        it("throws an exception when creep role is null", () => {
            expect(() => new CreepControllerFactory().createFor(
                stubCreep(null),
                stubRoom()
            )).to.throw("role can't be null");
        });

        it("throws an exception when creep role is undefined", () => {
            expect(() => new CreepControllerFactory().createFor(
                stubCreep(undefined),
                stubRoom()
            )).to.throw("role can't be null");
        });

        it("throws an exception when there is no defined controller for the given role", () => {
            expect(() => new CreepControllerFactory().createFor(
                stubCreep("unknown"),
                stubRoom()
            )).to.throw("undefined controller for role: unknown");
        });

        it("returns an executable controller", () => {
            const creep = stubCreep(roles.BUILDER);
            const room = stubRoom();
            const creepControllerFactory = new CreepControllerFactory();
            const creepController = creepControllerFactory.createFor(
                creep, room
            );
            expect(typeof creepController.execute).to.equal("function");
        });
    });
});



