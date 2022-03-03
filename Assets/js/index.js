import { Tetris } from "./tetris.js";

const canvas = document.querySelector("#board");
const ctx = canvas.getContext("2d");
const scoreBoard = document.querySelector("#score");

const rows = 20;
const columns = 10;

const tetris = new Tetris(rows, columns, ctx, scoreBoard);
tetris.newGame();

document.addEventListener("keydown", ({ code }) => {
    if (!tetris.isValidKeyPress(code)) return;
    tetris.movePiece(code);
    if (tetris.pieceCollided) {
        tetris.checkGameState();
        if (tetris.gameOver) {
            alert("Game Over!");
            tetris.newGame();
            return;
        }

        tetris.randomPiece();
    }
});

var lastAnimationTime = Date.now();
function startAnimationFrames() {
    const now = Date.now();
    const delta = now - lastAnimationTime;
    if (delta > 500) {
        simulateArrowDown();
        lastAnimationTime = Date.now();
    }
    requestAnimationFrame(startAnimationFrames);
}
// startAnimationFrames();

function simulateArrowDown() {
    document.dispatchEvent(
        new KeyboardEvent("keydown", {
            code: "ArrowDown",
        })
    );
}
