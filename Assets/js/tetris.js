import { Board } from "./board/index.js";
import { Pieces } from "./pieces/index.js";

class Tetris {
    constructor(elements, columns, rows, ctx) {
        this.piece = null;
        this.board = new Board(columns, rows, ctx);
        this.piecesQueue = new Pieces(elements.nextPieces);
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
        this.constrols = {
            ArrowDown: {
                isPressed: false,
                longPress: true,
                needToPress: false,
                times: 0,
                funcName: "moveDown",
            },
            ArrowLeft: {
                isPressed: false,
                longPress: true,
                needToPress: false,
                times: 0,
                funcName: "moveLeft",
            },
            ArrowRight: {
                isPressed: false,
                longPress: true,
                needToPress: false,
                times: 0,
                funcName: "moveRight",
            },
            ArrowUp: {
                isPressed: false,
                longPress: false,
                needToPress: false,
                times: 0,
                funcName: "rotatePiece",
            },
            Space: {
                isPressed: false,
                longPress: false,
                needToPress: false,
                funcName: "hardDrop",
            },
            Escape: {
                isPressed: false,
                longPress: false,
                needToPress: false,
                funcName: "newGame",
            },
        };
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

    async rotatePiece() {
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
    }

    keyDownHandler = ({ code }) => {
        if (!this.isValidKeyPress(code)) return;
        const key = this.constrols[code];
        if (!key.isPressed) {
            key.isPressed = true;
            key.needToPress = true;
        }
    };

    keyUpHandler = ({ code }) => {
        if (!this.isValidKeyPress(code)) return;
        this.constrols[code].isPressed = false;
        this.constrols[code].times = 0;
    };

    isValidKeyPress(key) {
        return this.constrols.hasOwnProperty(key);
    }

    executeMoves() {
        Object.keys(this.constrols).forEach((code) => {
            const key = this.constrols[code];

            // Se nenhuma tecla está a ser premida e o comando já foi executado
            // e não foi clicado momentáriamente numa tecla, não move
            if (!key.isPressed && !key.needToPress) return;

            // Se está a ser premida, mas a tecla não é de longPress e já foi executado, não move
            if (key.isPressed && !key.longPress && key.times) return;

            this.movePiece(key);

            key.needToPress = false;

            key.times += 1;
        });
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

    animate = (now) => {
        if (now - this.lastIntervalTimestamp >= 50) {
            // Update the timestamp to right now
            this.lastIntervalTimestamp = now;

            this.executeMoves();
            this.checkGameState();

            if (this.gameOver) {
                // Mostra alguma coisa de gameOver
                this.showGameOver();
            }
        }
        this.updateScreen();

        requestAnimationFrame(this.animate);
    };
}

export { Tetris };
