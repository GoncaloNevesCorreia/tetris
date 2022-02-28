import { Board } from "./board.js";

const canvas = document.querySelector("#board");
const ctx = canvas.getContext("2d");

const rows = 20;
const columns = 10;

const board = new Board(rows, columns, ctx);
startAnimationFrames();

document.addEventListener("keydown", (event) => {
  if (event.code === "ArrowDown") {
    board.currentPiece.moveDown();
    console.log(board.board);
  }
});

// var lastAnimationTime = Date.now();
// function startAnimationFrames() {
//   const now = Date.now();
//   const delta = now - lastAnimationTime;
//   if (delta > 1000) {
//     board.draw();
//     lastAnimationTime = Date.now();
//   }
//   requestAnimationFrame(startAnimationFrames);
// }
// startAnimationFrames();
