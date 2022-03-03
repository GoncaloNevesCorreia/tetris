import { Square } from "./square.js";
import { Piece } from "./Piece.js";

class Tetris {
    constructor(rows, columns, ctx, scoreBoard) {
        this.rows = rows;
        this.columns = columns;
        this.emptyCode = 0;
        this.board = [];
        this.ctx = ctx;
        this.currentPiece = null;
        this.pieceCollided = false;
        this.gameOver = false;
        this.constrols = {
            ArrowDown: "moveDown",
            ArrowLeft: "moveLeft",
            ArrowRight: "moveRight",
            ArrowUp: "rotatePiece",
            Space: "hardDrop",
        };
        this.score = 0;
        this.scoreBoard = scoreBoard;
        this.level = 1;
        this.lines = 0;
    }

    newGame() {
        this.pieceCollided = false;
        this.gameOver = false;
        this.score = 0;
        this.level = 0;
        this.lines = 0;

        this.board = [];
        for (let i = 0; i < this.rows; i++) {
            this.board.push(new Array(this.columns).fill(this.emptyCode));
        }

        this.randomPiece();
    }

    render() {
        const square = new Square(this.ctx);
        this.board.forEach((row, y) =>
            row.forEach((value, x) => square.draw(x, y, value))
        );

        this.scoreBoard.textContent = this.score;
    }

    randomPiece() {
        const pieces = ["i", "o", "t", "j", "l", "s", "z"];
        const pieceIndex = Math.floor(Math.random() * 7);
        console.log(pieceIndex);
        console.log(pieces[pieceIndex]);
        this.currentPiece = new Piece(pieces[pieceIndex], this.board);
        this.pieceCollided = false;
        this.currentPiece.showPiece();
        this.render();
    }

    isValidKeyPress(key) {
        return this.constrols.hasOwnProperty(key);
    }

    collision(futureX, futureY, piece) {
        const currentPositions = this.getTetraminoPositions();

        for (let y = 0; y < piece.length; y++) {
            for (let x = 0; x < piece[y].length; x++) {
                if (!piece[y][x]) continue;
                const newX = futureX + x;
                const newY = futureY + y;

                if (newX < 0 || newX >= this.columns) return true;
                if (newY >= this.rows) return true;

                if (newY < 0) continue;
                if (currentPositions.includes(`${newX}${newY}`)) continue;
                if (this.board[newY][newX] != this.emptyCode) return true;
            }
        }

        return false;
    }

    getTetraminoPositions() {
        let positions = [];

        this.currentPiece.rotation.forEach((row, y) =>
            row.forEach((value, x) => {
                if (value) {
                    positions.push(
                        `${this.currentPiece.x + x}${this.currentPiece.y + y}`
                    );
                }
            })
        );

        return positions;
    }

    movePiece(code) {
        const functionName = this.constrols[code];
        this[functionName]();
        this.render();
    }

    moveDown() {
        const piece = this.currentPiece;

        if (this.collision(piece.x, piece.y + 1, piece.rotation)) {
            this.pieceCollided = true;
            return;
        }

        piece.move(piece.x, piece.y + 1);
        this.score++;
    }
    moveLeft() {
        const piece = this.currentPiece;

        if (this.collision(piece.x - 1, piece.y, piece.rotation)) return;

        piece.move(piece.x - 1, piece.y);
    }
    moveRight() {
        const piece = this.currentPiece;

        if (this.collision(piece.x + 1, piece.y, piece.rotation)) return;

        piece.move(piece.x + 1, piece.y);
    }

    rotatePiece() {
        const piece = this.currentPiece;

        const nextRotationIndex =
            piece.rotationIndex + 1 >= piece.rotations.length
                ? 0
                : piece.rotationIndex + 1;

        const nextRotation = piece.rotations[nextRotationIndex];

        let kick = 0;
        if (this.collision(piece.x, piece.y, nextRotation)) {
            kick = piece.x > this.columns / 2 ? -1 : 1;
        }

        if (this.collision(piece.x + kick, piece.y, nextRotation)) {
            if (piece.code !== "i") return;
            kick += piece.x > this.columns / 2 ? -1 : 1;
            if (this.collision(piece.x + kick, piece.y, nextRotation)) return;
        }

        piece.rotate(nextRotationIndex, kick);
    }

    hardDrop() {
        const piece = this.currentPiece;

        const cantMove = this.collision(piece.x, piece.y + 1, piece.rotation);

        if (cantMove) {
            this.pieceCollided = true;
            return;
        }

        piece.move(piece.x, piece.y + 1);
        this.score += 2;
        this.hardDrop();
    }

    removeRows() {
        for (let i = this.board.length - 1; i >= 0; i--) {
            const row = this.board[i];

            const rowSimplified = this.simplifyRow(row);

            if (rowSimplified.includes(this.emptyCode)) continue;

            this.board.splice(i, 1);

            const newRow = new Array(this.columns).fill(this.emptyCode);
            this.board.unshift(newRow);
            i++;

            this.score += 100 * this.level;
        }
        this.render();
    }

    simplifyRow(row) {
        return row.reduce((acumulador, valorAtual) => {
            if (!acumulador.includes(valorAtual)) acumulador.push(valorAtual);
            return acumulador;
        }, []);
    }

    checkGameState() {
        if (this.currentPiece.y < 0) {
            this.gameOver = true;
            return;
        }
        this.removeRows();
    }
}

export { Tetris };
