module.exports = (() => {


    const _ = require("lodash");

    const searchTypes = require("./const.searchTypes");


    const getExits = (ctx, room) => ctx.memory.rooms[room.name].exits;

    const initMemory = (ctx, room) => {

        if (!ctx.memory.rooms[room.name].exits) {

            ctx.memory.rooms[room.name].exits = {};

        }

    };

    const calculateRanges = (axis, exits) => {

        if (!exits.length) {

            return [];

        }

        const cords = _.map(exits, (exit) => exit[axis]);

        const exitRanges = [];

        let startIdx = 0;
        let endIdx = 0;

        while (endIdx < cords.length) {

            const cord = cords[endIdx];

            if (endIdx === cords.length - 1 || cord + 1 !== cords[endIdx + 1]) {

                exitRanges.push({
                    from: cords[startIdx],
                    to: cord
                });
                startIdx = endIdx + 1;

            }

            endIdx += 1;

        }

        return exitRanges;

    };

    const calculateHorizontalRanges = _.curry(calculateRanges)("x", _);
    const calculateVerticalRanges = _.curry(calculateRanges)("y", _);


    return (ctx, room) => {

        initMemory(ctx, room);

        const exits = getExits(ctx, room);

        if (!exits.top) {

            const topExits = room.find(searchTypes.EXIT_TOP);

            exits.top = calculateHorizontalRanges(topExits);

            return false;

        }

        if (!exits.bottom) {

            const bottomExits = room.find(searchTypes.EXIT_BOTTOM);

            exits.bottom = calculateHorizontalRanges(bottomExits);

            return false;

        }

        if (!exits.left) {

            const leftExits = room.find(searchTypes.EXIT_LEFT);

            exits.left = calculateVerticalRanges(leftExits);

            return false;

        }

        if (!exits.right) {

            const rightExits = room.find(searchTypes.EXIT_RIGHT);

            exits.right = calculateVerticalRanges(rightExits);

            return false;

        }

        return true;

    };

})();

