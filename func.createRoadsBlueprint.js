module.exports = () => {

    Object.keys(Game.spawns).forEach((spawnName) => {
        const spawn = Game.spawns[spawnName];
        const room = spawn.room;

        room.find(FIND_SOURCES).forEach((source) => {
            const result = PathFinder.search(
                spawn.pos,
                [{pos: source.pos, range: 1}],
                {
                    maxRooms: 1,
                    plainCost: 1,
                    swampCost: 2,
                }
            );

            const path = result.path;

            path.forEach((pos) => {
                room.createConstructionSite(pos, STRUCTURE_ROAD);
            });
        });
    });
};