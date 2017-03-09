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

    isHorizontal() {
        return this.from.y == this.to.y;
    }

    isVertical() {
        return this.from.x == this.to.x;
    }

    isPerpendicular() {
        return this.isHorizontal() || this.isVertical();
    }

    toSegments() {
        if (!this.isPerpendicular()) {
            throw new Error(
                "path must be perpendicular to transform into segments"
            );
        }

        const axis = this.isHorizontal() ? "x" : "y";
        const constant = axis == "x" ? "y" : "x";

        const start = Math.min(this.from[axis], this.to[axis]);
        const end = Math.max(this.from[axis], this.to[axis]);

        const segments = [];

        for (let i = start; i <= end; i++) {
            segments.push(Cord.fromJSON({
                [axis]: i,
                [constant]: this.from[constant]
            }));
        }

        return segments;
    }

    toJSON() {
        return {from: this.from, to: this.to};
    }

    get hash() {
        return "FROM_" + this.from.hash + "_TO_" + this.to.hash;
    }
}


module.exports = Path;
