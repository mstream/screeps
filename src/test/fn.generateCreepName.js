const {expect} = require("chai");

const generateCreepName = require("../main/fn.generateCreepName");

const roleTypes = require("../main/const.roleTypes");


describe("generateCreepName", () => {

    it("throws exception when role is unknown", () => {

        const game = {time: 123};

        expect(
            () => generateCreepName(game, "unknownRole")
        ).to.throw("unknown role: unknownRole");


    });

    it("generates creep name properly", () => {

        const game = {time: 123};

        const result = generateCreepName(game, roleTypes.WORKER);

        expect(result).to.equal(`${roleTypes.WORKER}_123`);

    });

});
