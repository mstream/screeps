const taskTypes = require("./const.taskTypes");


module.exports = {
    [taskTypes.EXITS_COMPUTING]: 10,
    [taskTypes.EXTENSIONS_BUILDING]: 5,
    [taskTypes.EXTENSIONS_COMPUTING]: 20,
    [taskTypes.ROAD_COMPUTING]: 20,
    [taskTypes.ROADS_BUILDING]: 5,
    [taskTypes.WALLS_BUILDING]: 5,
    [taskTypes.WALLS_COMPUTING]: 10
};