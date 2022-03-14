import { Tetris } from "./tetris.js";

const canvas = document.querySelector("#board");
const ctx = canvas.getContext("2d");

const scoreBoard = document.querySelector("#score");
const lines = document.querySelector("#lines");
const nextPieces = document.querySelector("#nextPieces");
const gameOverScreen = document.querySelector("#gameOver");

const elements = {
    scoreBoard,
    nextPieces,
    lines,
    gameOverScreen,
};

const rows = 20;
const columns = 10;

const tetris = new Tetris(elements, rows, columns, ctx);
tetris.newGame();

requestAnimationFrame(tetris.animate);

document.addEventListener("keydown", tetris.keyDownHandler);
document.addEventListener("keyup", tetris.keyUpHandler);

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
// startAnimationFrames();

function simulateArrowDown() {
    document.dispatchEvent(
        new KeyboardEvent("keydown", {
            code: "ArrowDown",
        })
    );
}
