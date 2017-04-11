module.exports = (() => {

    const roomSize = 50;

    const initMemory = (ctx, room) => {

        const {memory} = ctx;

        if (!memory.rooms[room.name].reservedTiles) {

            const reservedTiles = new Array(roomSize);

            for (let y = 0; y < roomSize; y += 1) {

                reservedTiles[y] = new Array(roomSize).fill(false);

            }

            memory.rooms[room.name].reservedTiles = reservedTiles;

        }

    };

    return (ctx, room, x, y) => {

        if (x < 0 || x > roomSize - 1) {

            throw new Error(`x has to be in range of [0,${roomSize - 1}]`);

        }

        if (y < 0 || y > roomSize - 1) {

            throw new Error(`y has to be in range of [0,${roomSize - 1}]`);

        }

        const {memory} = ctx;

        initMemory(ctx, room);

        return memory.rooms[room.name].reservedTiles[y][x];

    };

})();
