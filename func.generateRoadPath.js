module.exports = (from, to) => {

    if (!from) {
        throw new Error("from can't be null");
    }

    if (!to) {
        throw new Error("to can't be null");
    }

    return PathFinder.search(
        from.pos,
        [{pos: to.pos, range: 1}],
        {
            maxRooms: 1,
            plainCost: 1,
            swampCost: 2,
        }
    );
};