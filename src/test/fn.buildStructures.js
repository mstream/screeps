const {expect} = require("chai");
const sinon = require("sinon");

const buildStructures = require("../main/fn.buildStructures");

const structureTypes = require("../main/const.structureTypes");


describe("buildStructures", () => {

    it("throws exception when role structures not calculated", () => {

        const game = {time: 123};

        const room = {name: "room1"};

        const memory = {rooms: {room1: {}}};

        const ctx = {
            game,
            memory
        };

        expect(
            () => buildStructures(ctx, room)
        ).to.throw("no calculated structures");

    });

    it("throws exception when roads not calculated", () => {

        const game = {time: 123};

        const room = {name: "room1"};

        const roomMemory = {structures: {extension: {calculated: []}}};

        const memory = {rooms: {room1: roomMemory}};

        const ctx = {
            game,
            memory
        };

        expect(
            () => buildStructures(ctx, room)
        ).to.throw("no calculated roads");

    });

    it("throws exception when extensions not calculated", () => {

        const game = {time: 123};

        const room = {name: "room1"};

        const roomMemory = {structures: {road: {calculated: []}}};

        const memory = {rooms: {room1: roomMemory}};

        const ctx = {
            game,
            memory
        };

        expect(
            () => buildStructures(ctx, room)
        ).to.throw("no calculated extensions");

    });

    it("should create structure sites", () => {

        const game = {time: 123};

        const room = {
            createConstructionSite: sinon.spy(),
            name: "room1"
        };

        const memory = {
            rooms: {
                room1: {
                    structures: {
                        extension: {
                            calculated: [
                                {
                                    x: 0,
                                    y: 5
                                },
                                {
                                    x: 10,
                                    y: 15
                                },
                                {
                                    x: 20,
                                    y: 25
                                }]
                        },
                        road: {
                            calculated: [
                                {
                                    x: 30,
                                    y: 35
                                },
                                {
                                    x: 40,
                                    y: 45
                                },
                                {
                                    x: 50,
                                    y: 55
                                }]
                        }
                    }
                }
            }
        };

        const ctx = {
            game,
            memory
        };

        buildStructures(ctx, room);

        expect(room.createConstructionSite.callCount).to.equal(6);

        expect(room.createConstructionSite.calledWith(
            0, 5, structureTypes.EXTENSION
        )).to.be.true;

        expect(room.createConstructionSite.calledWith(
            10, 15, structureTypes.EXTENSION
        )).to.be.true;

        expect(room.createConstructionSite.calledWith(
            20, 25, structureTypes.EXTENSION
        )).to.be.true;

        expect(room.createConstructionSite.calledWith(
            30, 35, structureTypes.ROAD
        )).to.be.true;

        expect(room.createConstructionSite.calledWith(
            40, 45, structureTypes.ROAD
        )).to.be.true;

        expect(room.createConstructionSite.calledWith(
            50, 55, structureTypes.ROAD
        )).to.be.true;

    });

});
