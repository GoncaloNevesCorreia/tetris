import { Square } from "./square.js";
import { Piece } from "./Piece.js";

class Board {
  constructor(rows, columns, ctx) {
    this.rows = rows;
    this.columns = columns;
    this.emptyCode = 0;
    this.board = [];
    this.ctx = ctx;
    this.currentPiece = null;
  }

  newGame() {
    for (let i = 0; i < this.rows; i++) {
      this.board.push(new Array(this.columns).fill(this.emptyCode));
    }

    this.randomPiece();

    this.render();
  }

	render() {
		const square = new Square(this.ctx);
		this.board.forEach((row, y) =>
			row.forEach((value, x) => square.draw(x, y, value))
		);
	}

	randomPiece() {
		this.currentPiece = new Piece("z", this.board);
		this.currentPiece.showPiece();
	}
}

export { Board };
