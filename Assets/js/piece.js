import tetraminosList from "./data/tetraminos.json" assert { type: "json" };

class Piece {
    constructor(code) {
        this.color = tetraminosList[code].color;
        this.rotations = tetraminosList[code].rotations;
        this.rotationIndex = 0;
        this.rotation = this.rotations[this.rotationIndex];
        this.code = code;
        this.y = -3;
        this.x = 3;
        this.collision = false;
    }

    move(x, y) {
        this.x = x;
        this.y = y;
    }

    rotate(rotationIndex, kick) {
        this.x += kick;

        this.rotationIndex = rotationIndex;

        this.rotation = this.rotations[this.rotationIndex];
    }
}

export { Piece };
