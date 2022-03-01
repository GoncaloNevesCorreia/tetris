import { Board } from "./board.js";

const canvas = document.querySelector("#board");
const ctx = canvas.getContext("2d");

const rows = 20;
const columns = 10;

const board = new Board(rows, columns, ctx);
board.newGame();

document.addEventListener("keydown", (event) => {
  const piece = board.currentPiece;

  switch (event.code) {
    case "ArrowDown":
      // console.log(piece.collision(piece.x, piece.y++, piece.currentTetramino));

      // if (!piece.collision(piece.x, piece.y++, piece.currentTetramino))
      piece.moveDown();
      break;
    case "ArrowLeft":
      piece.moveLeft();
      break;
    case "ArrowRight":
      piece.moveRight();
      break;
    case "ArrowUp":
      piece.rotate();
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
// startAnimationFrames();
