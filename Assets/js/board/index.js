import { Square } from "../Interface/square.js";

class Board {
    constructor(rows, columns, ctx) {
        this.rows = rows;
        this.columns = columns;
        this.board = [];
        this.piecePositions = [];
        this.ctx = ctx;
        this.emptyCode = 0;
    }

    newBoard() {
        this.board = [];
        for (let i = 0; i < this.rows; i++) {
            this.board.push(this.createRow());
        }
    }

    render() {
        this.board.forEach((row, y) =>
            row.forEach((square, x) => square.draw(x, y))
        );
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
                if (this.board[newY][newX].code != this.emptyCode) return true;
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

                    this.board[positionY][positionX].code = this.emptyCode;
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

                    this.board[positionY][positionX].code = piece.code;
                }
            })
        );

        this.updateTetraminoPositions(piece);
    }

    removeRows() {
        let rowsRemoved = 0;
        this.board.forEach((row, index) => {
            if (row.find((square) => square.code === this.emptyCode)) return;

            this.board.splice(index, 1);

            const newRow = this.createRow();
            this.board.unshift(newRow);

            rowsRemoved++;
        });

        return rowsRemoved;
    }

    createRow() {
        let row = [];
        for (let i = 0; i < this.columns; i++) {
            row.push(new Square(this.ctx, this.emptyCode));
        }
        return row;
    }
}

export { Board };
