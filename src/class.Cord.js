class Cord {

    static fromJSON({x, y}) {
        return new Cord(x, y);
    }

    static fromPos(pos) {
        return new Cord(pos.x, pos.y);
    }

    constructor(x, y) {

        if (x == null) {
            throw new Error("x can't be null");
        }

        if (typeof x != "number") {
            throw new Error("x has to be a number");
        }

        if (y == null) {
            throw new Error("y can't be null");
        }

        if (typeof y != "number") {
            throw new Error("y has to be a number");
        }

        this.x = x;
        this.y = y;
    }

    toJSON() {
        return {x: this.x, y: this.y};
    }

    get hash() {
        return "(" + this.x + "," + this.y + ")";
    }
}


module.exports = Cord;

