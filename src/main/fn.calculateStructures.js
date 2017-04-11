module.exports = (() => (ctx, room) => {

    const {calculateRoads, calculateTerrain} = ctx;

    const terrainCalculated = calculateTerrain(ctx, room);

    if (!terrainCalculated) {

        return false;

    }

    const roadsCalculated = calculateRoads(ctx, room);

    if (!roadsCalculated) {

        return false;

    }

    return true;

})();
