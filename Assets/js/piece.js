import tetraminosList from "./data/tetraminos.json" assert { type: "json" };

class Piece {
    constructor(code, board) {
        this.color = tetraminosList[code].color;
        this.rotations = tetraminosList[code].rotations;
        this.rotationIndex = 0;
        this.rotation = this.rotations[this.rotationIndex];
        this.code = code;
        this.y = -3;
        this.x = 3;
        this.board = board;
    }

    showPiece(show = true) {
        this.rotation.forEach((row, y) =>
            row.forEach((value, x) => {
                if (value) {
                    const positionX = this.x + x;
                    const positionY = this.y + y;

                    if (positionY < 0) return;

                    this.board[positionY][positionX] = show ? this.code : 0;
                }
            })
        );
    }

    move(x, y) {
        this.showPiece(false);
        this.x = x;
        this.y = y;
        this.showPiece();
    }

    rotate(rotationIndex, kick) {
        this.showPiece(false);

        this.x += kick;

        this.rotationIndex = rotationIndex;

        this.rotation = this.rotations[this.rotationIndex];

        this.showPiece();
    }
}

export { Piece };
