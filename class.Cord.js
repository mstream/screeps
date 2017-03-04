class Cord {

    static fromJSON({x, y}) {
        return new Cord(x, y);
    }

    static fromPos(pos) {
        return new Cord(pos.x, pos.y);
    }

    constructor(x, y) {

        if (!x) {
            throw new Error("x can't be null");
        }

        if (!y) {
            throw new Error("y can't be null");
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

