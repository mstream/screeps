module.exports = () => {

    if (!Memory.creeps) {
        return;
    }

    _.keys(Memory.creeps).forEach((creepName) => {
        const creepDead = !Game.creeps[creepName];
        if (creepDead) {
            delete Memory.creeps[creepName];
        }
    });
};