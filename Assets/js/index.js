import { Tetris } from "./tetris.js";

const canvas = document.querySelector("#board");
const ctx = canvas.getContext("2d");
const scoreBoard = document.querySelector("#score");

const elements = {
    scoreBoard: scoreBoard,
};

const rows = 20;
const columns = 10;

const tetris = new Tetris(elements);
tetris.createBoard(rows, columns, ctx);
tetris.newGame();

document.addEventListener("keydown", ({ code }) => {
    if (!tetris.isValidKeyPress(code)) return;
    tetris.movePiece(code);
    if (!tetris.pieceCollided()) return;

    tetris.checkGameState();

    if (tetris.gameOver) {
        alert("Game Over!");
        tetris.newGame();
        return;
    }

    tetris.randomPiece();
});

var lastAnimationTime = Date.now();
function startAnimationFrames() {
    const now = Date.now();
    const delta = now - lastAnimationTime;
    if (delta > 1000) {
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
