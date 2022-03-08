import { Board } from "./board/index.js";
import { Pieces } from "./pieces/index.js";

class Tetris {
    constructor(elements, columns, rows, ctx) {
        this.piece = null;
        this.board = new Board(columns, rows, ctx);
        this.piecesQueue = new Pieces(elements.nextPieces);
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

    newGame() {
        this.gameOver = false;
        this.score = 0;
        this.level = 1;
        this.lines = 0;
        this.board.newBoard();
        this.piecesQueue.clear();
        this.piecesQueue.add();
        this.piecesQueue.add();
        this.piecesQueue.add();
        this.nextPiece();
        this.updateScreen();
    }

    updateScreen() {
        this.board.render();
        this.elements.scoreBoard.textContent = this.score;
        this.elements.lines.textContent = this.lines;
    }

    isValidKeyPress(key) {
        return this.constrols.hasOwnProperty(key);
    }

    pieceCollided() {
        return this.piece.collision;
    }

    nextPiece() {
        this.piece = this.piecesQueue.next();
        this.piecesQueue.showNextPieces();
    }

    movePiece(code) {
        const functionName = this.constrols[code];
        this[functionName]();
        this.checkGameState();
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
            (piece.rotationIndex + 1) % piece.rotations.length;

        const nextRotation = piece.rotations[nextRotationIndex];

        let kick = 0;
        if (this.board.collision(piece.x, piece.y, nextRotation)) {
            kick = piece.x > this.board.columns / 2 ? -1 : 1;
        }

        if (this.board.collision(piece.x + kick, piece.y, nextRotation)) {
            kick += piece.x > this.board.columns / 2 ? -1 : 1;
            if (this.board.collision(piece.x + kick, piece.y, nextRotation))
                return;
        }

        this.board.removePiece(piece);

        piece.rotate(nextRotationIndex, kick);

        this.board.addPiece(piece);
    }

    hardDrop() {
        this.moveDown();

        if (this.piece.collision) return;

        this.score++;
        this.hardDrop();
    }

    checkGameState() {
        if (this.piece.collision) {
            if (this.piece.y < 0) {
                this.gameOver = true;
                return;
            }

            const rowsRemoved = this.board.removeRows();
            this.score += rowsRemoved * 100 * this.level;
            this.lines += rowsRemoved;

            this.nextPiece();
        }
        this.updateScreen();
    }
}

export { Tetris };
