import { Board } from "./board.js";

const canvas = document.querySelector("#board");
const ctx = canvas.getContext("2d");

const rows = 20;
const columns = 10;

const board = new Board(rows, columns, ctx);
board.newGame();

document.addEventListener("keydown", (event) => {
    switch (event.code) {
        case "ArrowDown":
            board.currentPiece.moveDown();
            break;
        case "ArrowLeft":
            board.currentPiece.moveLeft();
            break;
        case "ArrowRight":
            board.currentPiece.moveRight();
            break;
        case "ArrowUp":
            board.currentPiece.rotate();
            break;
    }

    board.render();
});

var lastAnimationTime = Date.now();
function startAnimationFrames() {
    const now = Date.now();
    const delta = now - lastAnimationTime;
    if (delta > 1000) {
        board.currentPiece.moveDown();
        board.render();
        lastAnimationTime = Date.now();
    }
    requestAnimationFrame(startAnimationFrames);
}
startAnimationFrames();
