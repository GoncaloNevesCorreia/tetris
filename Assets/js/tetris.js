import { Board } from "./board/index.js";
import { Pieces } from "./pieces/index.js";
import { KeyboardHandler } from "./keyboardHandler/index.js";

class Tetris extends EventTarget {
    constructor(elements, columns, rows, ctx) {
        super();
        this.ctx = ctx;
        this.piece = null;
        this.board = new Board(columns, rows, ctx);
        this.piecesQueue = new Pieces(elements.nextPieces);
        this.keyboardHandler = new KeyboardHandler(this);
        this.elements = elements;
        this.score = 0;
        this.level = 1;
        this.lines = 0;
        this.lastIntervalTimestamp = 0;

        this.timestamps = {
            gameLoop: 0,
            dropTimer: 0,
        };

        this.baseSpeed = 900;
        this.gameOver = false;
        this.isPaused = false;

        this.animationLoops = {
            drop: null,
            movement: null,
        };

        this.gameOverEvent = new Event("gameover");

        this.sounds = {
            music: new Audio("Assets/sounds/main_theme.mp3"),
            isMuted: false,
            volume: {
                high: 0.15,
                low: 0.05
            }
        };
    }

    newGame() {
        this.keyboardHandler = new KeyboardHandler(this);
        this.startAnimations();
        this.gameOver = false;
        this.score = 0;
        this.level = 1;
        this.lines = 0;
        this.baseSpeed = 900;
        this.board.newBoard();
        this.piecesQueue.clear();
        this.piecesQueue.add();
        this.piecesQueue.add();
        this.piecesQueue.add();
        this.nextPiece();
        this.playMusic();
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

    moveDown = () => {
        const piece = this.piece;

        if (this.board.collision(piece.x, piece.y + 1, piece.rotation)) {
            piece.collision = true;
            return;
        }

        this.board.removePiece(piece);

        piece.move(piece.x, piece.y + 1);

        this.board.addPiece(piece);

        this.score++;
    };

    moveLeft = () => {
        const piece = this.piece;

        if (this.board.collision(piece.x - 1, piece.y, piece.rotation)) return;

        this.board.removePiece(piece);

        piece.move(piece.x - 1, piece.y);

        this.board.addPiece(piece);
    };

    moveRight = () => {
        const piece = this.piece;

        if (this.board.collision(piece.x + 1, piece.y, piece.rotation)) return;

        this.board.removePiece(piece);

        piece.move(piece.x + 1, piece.y);

        this.board.addPiece(piece);
    };

    rotatePiece = () => {
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
    };

    hardDrop = () => {
        this.moveDown();

        if (this.piece.collision) return;

        this.score++;
        this.hardDrop();
    };

    checkGameState() {
        if (this.piece.collision) {
            if (this.piece.y < 0) {
                this.endGame();
                this.dispatchEvent(this.gameOverEvent);
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

    executeCommands() {
        const keys = this.keyboardHandler.getKeysToExecute();

        for (const key of keys) {
            // this.movePiece(key);

            key.exec();

            key.needToPress = false;

            key.times += 1;
        }
    }

    endGame() {
        this.gameOver = true;
        this.stopAnimations();
    }

    startAnimations() {
        requestAnimationFrame(this.gameLoop);
        requestAnimationFrame(this.dropTimer);
    }

    stopAnimations() {
        cancelAnimationFrame(this.animationLoops.movement);
        cancelAnimationFrame(this.animationLoops.drop);
    }

    playMusic() {

        if (this.sounds.isMuted) return
        this.sounds.music.currentTime = 0;
        this.sounds.music.volume = this.sounds.volume.high;
        this.sounds.music.play();
    }

    stopMusic() {
        this.sounds.music.pause();
        this.sounds.music.currentTime = 0;
    }

    gameLoop = (now) => {
        if (!this.gameOver) {
            this.animationLoops.movement = requestAnimationFrame(this.gameLoop);
        }

        if (now - this.timestamps.gameLoop >= 20) {
            // Update the timestamp to right now
            this.timestamps.gameLoop = now;
            if (!this.isPaused) {
                this.executeCommands();
                this.checkGameState();
            }
        }

        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        this.updateScreen();
    };

    dropTimer = (now) => {
        if (!this.gameOver) {
            this.animationLoops.drop = requestAnimationFrame(this.dropTimer);
        }

        if (now - this.timestamps.dropTimer >= this.baseSpeed) {
            if (!this.isPaused) this.moveDown();
            this.timestamps.dropTimer = now;
        }
    };
}

export { Tetris };
