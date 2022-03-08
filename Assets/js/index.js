import { Tetris } from "./tetris.js";

const canvas = document.querySelector("#board");
const ctx = canvas.getContext("2d");
const scoreBoard = document.querySelector("#score");
const lines = document.querySelector("#lines");
const nextPieces = document.querySelector("#nextPieces");

const elements = {
    scoreBoard,
    nextPieces,
    lines,
};

const rows = 20;
const columns = 10;

const tetris = new Tetris(elements, rows, columns, ctx);
tetris.newGame();

document.addEventListener("keydown", ({ code }) => {
    if (!tetris.isValidKeyPress(code)) return;
    tetris.movePiece(code);

    if (!tetris.gameOver) return;

    alert("Game Over!");
    tetris.newGame();
});

var lastAnimationTime = Date.now();
function startAnimationFrames() {
    const now = Date.now();
    const delta = now - lastAnimationTime;
    if (delta > 900) {
        simulateArrowDown();
        lastAnimationTime = Date.now();
    }
    requestAnimationFrame(startAnimationFrames);
}
startAnimationFrames();

function simulateArrowDown() {
    document.dispatchEvent(
        new KeyboardEvent("keydown", {
            code: "ArrowDown",
        })
    );
}
