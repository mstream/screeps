const {expect} = require("chai");

const chooseCreepBody = require("../main/fn.chooseCreepBody");

const partTypes = require("../main/const.partTypes");
const roleTypes = require("../main/const.roleTypes");


describe("chooseCreepBody", () => {

    it("throws exception when role is unknown", () => {

        expect(
            () => chooseCreepBody("unknownRole")
        ).to.throw("unknown role: unknownRole");


    });

    it("chooses creep body properly", () => {

        const result = chooseCreepBody(roleTypes.WORKER);

        expect(result).to.be.ok;
        expect(result.length).to.equal(3);
        expect(result[0]).to.equal(partTypes.CARRY);
        expect(result[1]).to.equal(partTypes.MOVE);
        expect(result[2]).to.equal(partTypes.WORK);

    });

});
