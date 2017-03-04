const Cord = require("class.Cord");


class Path {

    static fromJSON({from, to}) {
        return new Path(Cord.fromJSON(from), Cord.fromJSON(to));
    }

    constructor(from, to) {

        if (!from) {
            throw new Error("from can't be null");
        }

        if (!to) {
            throw new Error("to can't be null");
        }

        if (typeof from.hash != "string") {
            throw new Error("from has to have a hash");
        }

        if (typeof to.hash != "string") {
            throw new Error("to has to have a hash");
        }

        this.from = from;
        this.to = to;
    }

    toJSON() {
        return {from: this.from, to: this.to};
    }

    get hash() {
        return "FROM_" + this.from.hash + "_TO_" + this.to.hash ;
    }
}


module.exports = Path;
