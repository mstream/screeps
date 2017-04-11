module.exports = (() => (ctx, room) => {

    const {
        buildStructures,
        calculateStructures,
        calculateExits,
        calculateExtensions,
        calculateTasks,
        game
    } = ctx;

    if (!calculateExits(ctx, room)) {

        return;

    }

    if (!calculateExtensions(ctx, room)) {

        return;

    }

    if (game.time % 10 === 0) {

        calculateTasks(ctx, room);

    }

    const structuresCalculated = calculateStructures(ctx, room);

    if (structuresCalculated && game.time % 20 === 0) {

        buildStructures(ctx, room);

    }

})();
