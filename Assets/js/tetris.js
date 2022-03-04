import { Piece } from "./Piece.js";
import { Board } from "./board.js";

class Tetris {
    constructor(elements) {
        this.piece = null;
        this.gameOver = false;
        this.constrols = {
            ArrowDown: "moveDown",
            ArrowLeft: "moveLeft",
            ArrowRight: "moveRight",
            ArrowUp: "rotatePiece",
            Space: "hardDrop",
        };
        this.elements = elements;
        this.score = 0;
        this.level = 1;
        this.lines = 0;
    }

    createBoard(columns, rows, ctx) {
        this.board = new Board(columns, rows);
        this.board.ctx = ctx;
    }

    newGame() {
        this.gameOver = false;
        this.score = 0;
        this.level = 1;
        this.lines = 0;
        this.board.create();
        this.randomPiece();
    }

    updateScreen() {
        this.board.render();
        this.elements.scoreBoard.textContent = this.score;
    }

    randomPiece() {
        const pieces = ["i", "o", "t", "j", "l", "s", "z"];
        const pieceIndex = Math.floor(Math.random() * 7);
        this.piece = new Piece(pieces[pieceIndex], this.board);
        this.board.addPiece(this.piece);
        this.updateScreen();
    }

    isValidKeyPress(key) {
        return this.constrols.hasOwnProperty(key);
    }

    movePiece(code) {
        const functionName = this.constrols[code];
        this[functionName]();
        this.updateScreen();
    }

    pieceCollided() {
        return this.piece.collision;
    }

    moveDown() {
        const piece = this.piece;

        if (this.board.collision(piece.x, piece.y + 1, piece.rotation)) {
            piece.collision = true;
            return;
        }

        this.board.removePiece(piece);

        piece.move(piece.x, piece.y + 1);

        this.board.addPiece(piece);

        this.score++;
    }

    moveLeft() {
        const piece = this.piece;

        if (this.board.collision(piece.x - 1, piece.y, piece.rotation)) return;

        this.board.removePiece(piece);

        piece.move(piece.x - 1, piece.y);

        this.board.addPiece(piece);
    }

    moveRight() {
        const piece = this.piece;

        if (this.board.collision(piece.x + 1, piece.y, piece.rotation)) return;

        this.board.removePiece(piece);

        piece.move(piece.x + 1, piece.y);

        this.board.addPiece(piece);
    }

    rotatePiece() {
        const piece = this.piece;

        const nextRotationIndex =
            piece.rotationIndex + 1 >= piece.rotations.length
                ? 0
                : piece.rotationIndex + 1;

        const nextRotation = piece.rotations[nextRotationIndex];

        let kick = 0;
        if (this.board.collision(piece.x, piece.y, nextRotation)) {
            kick = piece.x > this.columns / 2 ? -1 : 1;
        }

        if (this.board.collision(piece.x + kick, piece.y, nextRotation)) {
            if (piece.code !== "i") return;
            kick += piece.x > this.columns / 2 ? -1 : 1;
            if (this.board.collision(piece.x + kick, piece.y, nextRotation))
                return;
        }

        this.board.removePiece(piece);

        piece.rotate(nextRotationIndex, kick);

        this.board.addPiece(piece);
    }

    hardDrop() {
        const piece = this.piece;

        if (this.board.collision(piece.x, piece.y + 1, piece.rotation)) {
            piece.collision = true;
            return;
        }

        this.board.removePiece(piece);

        piece.move(piece.x, piece.y + 1);

        this.board.addPiece(piece);

        this.score += 2;
        this.hardDrop();
    }

    checkGameState() {
        if (this.piece.y < 0) {
            this.gameOver = true;
            return;
        }
        const rowsRemoved = this.board.removeRows();
        this.score += rowsRemoved * 100 * this.level;
        this.updateScreen();
    }
}

export { Tetris };
