module.exports = () => {

    Object.keys(Memory.creeps)
            .forEach((creepName) => {
                if (!Game.creeps[creepName]) {
                    delete Memory.creeps[creepName];
                }
            });
};