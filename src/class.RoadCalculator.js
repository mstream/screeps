module.exports = class {

    constructor(pathFinder) {

        if (!pathFinder) {
            throw new Error("pathFinder can't be null");
        }

        this._pathFinder = pathFinder;
    }

    calculate(from, to) {

        if (!from) {
            throw new Error("from can't be null");
        }

        if (!to) {
            throw new Error("to can't be null");
        }

        return this._pathFinder.search(
            from,
            [{pos: to, range: 1}],
            {
                maxRooms: 1,
                plainCost: 1,
                swampCost: 2,
            }
        );
    }
};