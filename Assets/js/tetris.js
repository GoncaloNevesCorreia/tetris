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

        this.events = {
            gameOver: new Event("gameover"),
        };

        this.sounds = {
            isMuted: false,
            volume: {
                high: 0.15,
                low: 0.05,
            },
            list: {
                music: new Audio("Assets/sounds/main_theme.mp3"),
                pause: new Audio("Assets/sounds/pause.mp3"),
                continue: new Audio("Assets/sounds/continue.mp3"),
                game_over: new Audio("Assets/sounds/game_over.mp3"),
                rotate: new Audio("Assets/sounds/rotate.mp3"),
                move: new Audio("Assets/sounds/move.mp3"),
                block_fall: new Audio("Assets/sounds/block_fall.mp3"),
                single: new Audio("Assets/sounds/single.mp3"),
                double: new Audio("Assets/sounds/double.mp3"),
                triple: new Audio("Assets/sounds/triple.mp3"),
                tetris: new Audio("Assets/sounds/tetris.mp3"),
            },
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

    moveDown = (sound = true) => {
        const piece = this.piece;

        if (this.board.collision(piece.x, piece.y + 1, piece.rotation)) {
            piece.collision = true;
            return;
        }

        this.board.removePiece(piece);

        piece.move(piece.x, piece.y + 1);

        this.board.addPiece(piece);

        this.score++;

        if (sound) {
            this.playSound("move");
        }
    };

    moveLeft = () => {
        const piece = this.piece;

        if (this.board.collision(piece.x - 1, piece.y, piece.rotation)) return;

        this.board.removePiece(piece);

        piece.move(piece.x - 1, piece.y);

        this.board.addPiece(piece);

        this.playSound("move");
    };

    moveRight = () => {
        const piece = this.piece;

        if (this.board.collision(piece.x + 1, piece.y, piece.rotation)) return;

        this.board.removePiece(piece);

        piece.move(piece.x + 1, piece.y);

        this.board.addPiece(piece);

        this.playSound("move");
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

        this.playSound("rotate");
    };

    hardDrop = () => {
        this.moveDown(false);

        if (this.piece.collision) {
            return;
        }

        this.score++;
        this.hardDrop();
    };

    checkGameState() {
        if (this.piece.collision) {
            this.playSound("block_fall");
            if (this.piece.y < 0) {
                this.endGame();
                this.dispatchEvent(this.events.gameOver);
                return;
            }

            const rowsRemoved = this.board.removeRows();
            this.score += rowsRemoved * 100 * this.level;
            this.lines += rowsRemoved;

            if (rowsRemoved > 0) {
                const rowRemovedEvent = new CustomEvent("rowRemoved", {
                    detail: rowsRemoved,
                });

                this.dispatchEvent(rowRemovedEvent);
            }

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
        if (this.sounds.isMuted) return;

        this.sounds.list.music.loop = true;
        this.sounds.list.music.currentTime = 0;
        this.sounds.list.music.volume = this.sounds.volume.high;
        this.sounds.list.music.play();
    }

    stopMusic() {
        this.sounds.list.music.pause();
        this.sounds.list.music.currentTime = 0;
    }

    playSound(soundName) {
        if (this.sounds.isMuted) return;

        const sound = this.sounds.list[soundName];
        sound.volume = this.sounds.volume.high;
        sound.currentTime = 0;
        sound.play();
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
            if (!this.isPaused) this.moveDown(false);
            this.timestamps.dropTimer = now;
        }
    };
}

export { Tetris };
