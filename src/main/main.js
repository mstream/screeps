const ctx = {
    assignTaskToCreep: require("./fn.assignTaskToCreep"),
    buildStructures: require("./fn.buildStructures"),
    calculateExits: require("./fn.calculateExits"),
    calculateExtensions: require("./fn.calculateExtensions"),
    calculateRoads: require("./fn.calculateRoads"),
    calculateStructures: require("./fn.calculateStructures"),
    calculateTasks: require("./fn.calculateTasks"),
    calculateTerrain: require("./fn.calculateTerrain"),
    chooseCreepBody: require("./fn.chooseCreepBody"),
    cleanMemory: require("./fn.cleanMemory"),
    controlCreep: require("./fn.controlCreep"),
    controlGame: require("./fn.controlGame"),
    controlRoom: require("./fn.controlRoom"),
    controlSpawn: require("./fn.controlSpawn"),
    drawCreepStatus: require("./fn.drawCreepStatus"),
    executeControllerUpgrading: require("./fn.executeControllerUpgrading"),
    executeEnergyCollecting: require("./fn.executeEnergyCollecting"),
    executeStructuresBuilding: require("./fn.executeStructuresBuilding"),
    generateCreepName: require("./fn.generateCreepName"),
    generateTaskIndex: require("./fn.generateTaskIndex"),
    isRoomTileReserved: require("./fn.isRoomTileReserved"),
    reserveRoomTile: require("./fn.reserveRoomTile"),
    withdrawTaskFromCreep: require("./fn.assignTaskToCreep")
};


module.exports.loop = () => {

    ctx.game = Game;
    ctx.memory = Memory;
    ctx.pathFinder = PathFinder;

    ctx.cleanMemory(ctx);
    ctx.controlGame(ctx);

};
