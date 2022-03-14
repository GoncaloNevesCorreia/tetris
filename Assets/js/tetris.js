import { Board } from "./board/index.js";
import { Pieces } from "./pieces/index.js";
import { KeyboardHandler } from "./keyboardHandler/index.js";

class Tetris {
    constructor(elements, columns, rows, ctx) {
        this.piece = null;
        this.board = new Board(columns, rows, ctx);
        this.piecesQueue = new Pieces(elements.nextPieces);
        this.keyboardHandler = new KeyboardHandler();
        this.gameOver = false;
        this.elements = elements;
        this.score = 0;
        this.level = 1;
        this.lines = 0;
        this.lastIntervalTimestamp = 0;
        this.menu = {
            gameOver: false,
            settings: false,
        };
        this.timestamps = {
            gameLoop: 0,
            dropTimer: 0,
        };
        this.baseSpeed = 900;
    }

    newGame() {
        this.gameOver = false;
        this.score = 0;
        this.level = 1;
        this.lines = 0;
        this.showGameOver(false);
        this.board.newBoard();
        this.piecesQueue.clear();
        this.piecesQueue.add();
        this.piecesQueue.add();
        this.piecesQueue.add();
        this.nextPiece();
    }

    updateScreen() {
        this.board.render();
        this.elements.scoreBoard.textContent = this.score;
        this.elements.lines.textContent = this.lines;
        this.elements.level.textContent = this.level;
    }

    pieceCollided() {
        return this.piece.collision;
    }

    nextPiece() {
        this.piece = this.piecesQueue.next();
        this.piecesQueue.showNextPieces();
    }

    movePiece(key) {
        const functionName = key.funcName;
        this[functionName]();
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
            if (this.score - 1000 * this.level > 0) {
                this.level++;
                this.baseSpeed -= 50;
            }

            this.nextPiece();
        }
    }

    showGameOver(show = true) {
        if (show) {
            if (this.menu.gameOver) return;
            this.menu.gameOver = true;
            this.elements.gameOverScreen.classList.add("show");
        } else {
            if (!this.menu.gameOver) return;
            this.menu.gameOver = false;
            this.elements.gameOverScreen.classList.remove("show");
        }
    }

    executeCommands() {
        const keys = this.keyboardHandler.getKeysToExecute();

        for (const key of keys) {
            this.movePiece(key);

            key.needToPress = false;

            key.times += 1;
        }
    }

    startAnimations() {
        requestAnimationFrame(this.gameLoop);
        requestAnimationFrame(this.dropTimer);
    }

    gameLoop = (now) => {
        if (now - this.timestamps.gameLoop >= 20) {
            // Update the timestamp to right now
            this.timestamps.gameLoop = now;

            this.executeCommands();

            if (this.gameOver) {
                // Mostra alguma coisa de gameOver
                this.showGameOver();
            } else {
                this.checkGameState();
            }
        }
        this.updateScreen();

        requestAnimationFrame(this.gameLoop);
    };

    dropTimer = (now) => {
        if (now - this.timestamps.dropTimer >= this.baseSpeed) {
            this.moveDown();
            this.timestamps.dropTimer = now;
        }
        requestAnimationFrame(this.dropTimer);
    };
}

export { Tetris };
