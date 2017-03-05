module.exports = () => {

    if (!Memory.creeps) {
        return;
    }

    _.keys(Memory.creeps, (creepName) => {
        const creepDead = !Game.creeps[creepName];
        if (creepDead) {
            delete Memory.creeps[creepName];
        }
    });
};