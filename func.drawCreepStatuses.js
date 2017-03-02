module.exports = () => {

    Object.keys(Game.spawns).forEach((spawnName) => {
        const room = Game.spawns[spawnName].room;
        const creeps = room.find(FIND_CREEPS);

        if (!creeps) {
            return;
        }

        const visual = room.visual;

        creeps.forEach((creep) => {
           visual.text(creep.memory.role, creep.pos.x, creep.pos.y);
        });
    });
};