import { Square } from "./square.js";
import { Piece } from "./Piece.js";

class Board {
  constructor(rows, columns, ctx) {
    this.rows = rows;
    this.columns = columns;
    this.emptyCode = 0;
    this.board = this.emptyBoard();
    this.ctx = ctx;
    this.currentPiece = this.randomPiece();
    this.lastAnimationTime = Date.now();
  }

  emptyBoard() {
    let tempBoard = [];
    for (let i = 0; i < this.rows; i++) {
      tempBoard.push(new Array(this.columns).fill(this.emptyCode));
    }
    return tempBoard;
  }

  draw() {
    const square = new Square(this.ctx);
    console.log(this.board);
    this.board.forEach((row, y) =>
      row.forEach((value, x) => square.draw(x, y, value))
    );
  }

  randomPiece() {
    const piece = new Piece("z", this.board);
    return piece;
  }

  
}

export { Board };
