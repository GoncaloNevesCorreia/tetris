import { Square } from "../Interface/square.js";

class Board extends Square {
    constructor(rows, columns, ctx) {
        super(ctx);
        this.rows = rows;
        this.columns = columns;
        this.board = [];
        this.emptyCode = 0;
        this.piecePositions = [];
    }

    newBoard() {
        this.board = [];
        for (let i = 0; i < this.rows; i++) {
            this.board.push(new Array(this.columns).fill(this.emptyCode));
        }

        this.wallDraw();
    }

    render() {
        this.board.forEach((row, y) =>
            row.forEach(async (value, x) => await this.draw(x + 1, y, value))
        );
    }

    wallDraw() {
        const wallCode = "w";
        for (let row = 0; row < this.rows + 1; row++) {
            if (row !== this.rows) {
                this.draw(0, row, wallCode);
                this.draw(this.columns + 1, row, wallCode);
            } else {
                for (let col = 0; col < this.columns + 2; col++) {
                    this.draw(col, row, wallCode);
                }
            }
        }
    }

    collision(futureX, futureY, rotation) {
        for (let y = 0; y < rotation.length; y++) {
            for (let x = 0; x < rotation[y].length; x++) {
                if (!rotation[y][x]) continue;
                const newX = futureX + x;
                const newY = futureY + y;

                if (newX < 0 || newX >= this.columns) return true;
                if (newY >= this.rows) return true;

                if (newY < 0) continue;
                if (this.piecePositions.includes(`${newX}${newY}`)) continue;
                if (this.board[newY][newX] != this.emptyCode) return true;
            }
        }

        return false;
    }

    updateTetraminoPositions(piece) {
        this.piecePositions = [];

        piece.rotation.forEach((row, y) =>
            row.forEach((value, x) => {
                if (value)
                    this.piecePositions.push(`${piece.x + x}${piece.y + y}`);
            })
        );
    }

    removePiece(piece) {
        piece.rotation.forEach((row, y) =>
            row.forEach((value, x) => {
                if (value) {
                    const positionX = piece.x + x;
                    const positionY = piece.y + y;

                    if (positionY < 0) return;

                    this.board[positionY][positionX] = this.emptyCode;
                }
            })
        );

        this.updateTetraminoPositions(piece);
    }

    addPiece(piece) {
        piece.rotation.forEach((row, y) =>
            row.forEach((value, x) => {
                if (value) {
                    const positionX = piece.x + x;
                    const positionY = piece.y + y;

                    if (positionY < 0) return;

                    this.board[positionY][positionX] = piece.code;
                }
            })
        );

        this.updateTetraminoPositions(piece);
    }

    removeRows() {
        let rowsRemoved = 0;
        this.board.forEach((row, index) => {
            if (row.includes(this.emptyCode)) return;

            this.board.splice(index, 1);

            const newRow = new Array(this.columns).fill(this.emptyCode);
            this.board.unshift(newRow);
            rowsRemoved++;
        });

        return rowsRemoved;
    }
}

export { Board };
