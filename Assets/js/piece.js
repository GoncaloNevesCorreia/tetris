import tetraminosList from "./data/tetraminos.json" assert { type: "json" };

class Piece {
    constructor(code, board) {
        this.tetramino = tetraminosList[code];
        this.currentRotation = 0;
        this.currentTetramino = this.tetramino.rotations[this.currentRotation];
        this.code = code;
        this.y = 0;
        this.x = 3;
        this.board = board;
    }

    showPiece(show = true) {
        this.currentTetramino.forEach((row, y) =>
            row.forEach((value, x) => {
                if (value) {
                    const positionX = this.x + x;
                    const positionY = this.y + y;
                    this.board[positionY][positionX] = show ? this.code : 0;
                }
            })
        );
    }

    moveDown() {
        this.showPiece(false);
        this.y++;
        this.showPiece();
    }
    moveLeft() {
        this.showPiece(false);
        this.x--;
        this.showPiece();
    }
    moveRight() {
        this.showPiece(false);
        this.x++;
        this.showPiece();
    }
    rotate() {
        this.showPiece(false);

        this.currentRotation++;

        if (this.currentRotation > 3) this.currentRotation = 0;

        this.currentTetramino = this.tetramino.rotations[this.currentRotation];

        this.showPiece();
    }
}

export { Piece };
