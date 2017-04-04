const expect = require("chai").expect;

const CreepControllerFactory = require("../src/class.CreepControllerFactory");

const roles = require("../src/const.roles");


const stubCreep = (role) => ({memory: {role}});

const stubRoom = () => ({});

const stubStatusRenderer = () => ({});


describe("CreepControllerFactory", () => {

    describe("constructor", () => {

        it("throws an exception when statusRenderer is null", () => {
            expect(
                () => new CreepControllerFactory({statusRenderer: null})
            ).to.throw("statusRenderer can't be null");
        });
    });

    describe("#createFor", () => {

        it("throws an exception when creep is null", () => {
            const statusRenderer = stubStatusRenderer();
            const creepControllerFactory = new CreepControllerFactory({
                statusRenderer
            });
            expect(
                () => creepControllerFactory.createFor(
                    null,
                    stubRoom()
                )).to.throw("creep can't be null");
        });

        it("throws an exception when creep is undefined", () => {
            const statusRenderer = stubStatusRenderer();
            const creepControllerFactory = new CreepControllerFactory({
                statusRenderer
            });
            expect(
                () => creepControllerFactory.createFor(
                    undefined,
                    stubRoom()
                )).to.throw("creep can't be null");
        });

        it("throws an exception when room is null", () => {
            const statusRenderer = stubStatusRenderer();
            const creepControllerFactory = new CreepControllerFactory({
                statusRenderer
            });
            expect(
                () => creepControllerFactory.createFor(
                    stubCreep(roles.WORKER),
                    null
                )).to.throw("room can't be null");
        });

        it("throws an exception when room is undefined", () => {
            const statusRenderer = stubStatusRenderer();
            const creepControllerFactory = new CreepControllerFactory({
                statusRenderer
            });
            expect(
                () => creepControllerFactory.createFor(
                    stubCreep(roles.WORKER),
                    undefined
                )).to.throw("room can't be null");
        });

        it("throws an exception when creep role is null", () => {
            const statusRenderer = stubStatusRenderer();
            const creepControllerFactory = new CreepControllerFactory({
                statusRenderer
            });
            expect(
                () => creepControllerFactory.createFor(
                    stubCreep(null),
                    stubRoom()
                )).to.throw("role can't be null");
        });

        it("throws an exception when creep role is undefined", () => {
            const statusRenderer = stubStatusRenderer();
            const creepControllerFactory = new CreepControllerFactory({
                statusRenderer
            });
            expect(
                () => creepControllerFactory.createFor(
                    stubCreep(undefined),
                    stubRoom()
                )).to.throw("role can't be null");
        });

        it("throws an exception when there is no defined controller for the given role", () => {
            const statusRenderer = stubStatusRenderer();
            const creepControllerFactory = new CreepControllerFactory({
                statusRenderer
            });
            expect(
                () => creepControllerFactory.createFor(
                    stubCreep("unknown"),
                    stubRoom()
                )).to.throw("undefined controller for role: unknown");
        });

        it("returns an executable controller", () => {
            const creep = stubCreep(roles.WORKER);
            const room = stubRoom();
            const statusRenderer = stubStatusRenderer();
            const creepControllerFactory = new CreepControllerFactory({
                statusRenderer
            });
            const creepController = creepControllerFactory.createFor(
                creep, room
            );
            expect(typeof creepController.execute).to.equal("function");
        });
    });
});



