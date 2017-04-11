module.exports = (() => {


    const _ = require("lodash");


    const cleanObjectMemory = (ctx, objectType) => {

        const {game, memory} = ctx;

        const objects = memory[objectType];

        _.keys(objects).forEach((objectName) => {

            const memoryShouldBeKept = game[objectType][objectName];

            if (!memoryShouldBeKept) {

                delete memory[objectType][objectName];

            }

        });

    };

    const cleanCreepsMemory = (ctx) => cleanObjectMemory(ctx, "creeps");

    const cleanRoomsMemory = (ctx) => cleanObjectMemory(ctx, "rooms");


    return (ctx) => {

        cleanCreepsMemory(ctx);
        cleanRoomsMemory(ctx);

    };

})();

