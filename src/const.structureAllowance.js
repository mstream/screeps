const structureTypes = require("./const.structureTypes");

module.exports = {
    [structureTypes.EXTENSION]: {
        1: 0,
        2: 5,
        3: 10,
        4: 20,
        5: 30,
        6: 40,
        7: 50,
        8: 60
    },
    [structureTypes.ROAD]: {
        1: 2500,
        2: 2500,
        3: 2500,
        4: 2500,
        5: 2500,
        6: 2500,
        7: 2500,
        8: 2500
    },
    [structureTypes.WALL]: {
        1: 0,
        2: 2500,
        3: 2500,
        4: 2500,
        5: 2500,
        6: 2500,
        7: 2500,
        8: 2500
    }
};