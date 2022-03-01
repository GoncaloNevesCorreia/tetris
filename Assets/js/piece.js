import tetraminosList from "./data/tetraminos.json" assert { type: "json" };

class Piece {
  constructor(code, board) {
    this.tetramino = tetraminosList[code];
    this.currentRotation = 0;
    this.currentTetramino = this.tetramino.rotations[this.currentRotation];
    this.code = code;
    this.y = 0;
    this.x = 3;
    this.board = board;
  }

  showPiece(show = true) {
    this.currentTetramino.forEach((row, y) =>
      row.forEach((value, x) => {
        if (value) {
          const positionX = this.x + x;
          const positionY = this.y + y;
          this.board[positionY][positionX] = show ? this.code : 0;
        }
      })
    );
  }

  moveDown() {
    this.showPiece(false);
    this.y++;
    this.showPiece();
  }

  // moveDown() {
  //   if (this.collision(this.x, this.y + 1, this.currentTetramino)) return;

  //   this.showPiece(false);
  //   this.y++;
  //   this.showPiece();
  // }
	
  moveLeft() {
    if (this.collision(this.x - 1, this.y, this.currentTetramino)) return;

    this.showPiece(false);
    this.x--;
    this.showPiece();
  }
  moveRight() {
    if (this.collision(this.x + 1, this.y, this.currentTetramino)) return;

    this.showPiece(false);
    this.x++;
    this.showPiece();
  }
  rotate() {
    const nextRotation =
      this.currentRotation + 1 > 3 ? 0 : this.currentRotation + 1;

    let kick = 0;

    if (
      this.collision(this.x, this.y, this.tetramino.rotations[nextRotation])
    ) {
      kick = this.x > this.board[0].length / 2 ? -1 : 1;
    }

    if (
      this.collision(
        this.x + kick,
        this.y,
        this.tetramino.rotations[nextRotation]
      )
    )
      return;

    this.showPiece(false);

    this.x += kick;

    this.currentRotation = nextRotation;

    this.currentTetramino = this.tetramino.rotations[this.currentRotation];

    this.showPiece();
  }

  collision(futureX, futureY, piece) {
    const currentPositions = this.getTetraminoPositions();

    for (let y = 0; y < piece.length; y++) {
      for (let x = 0; x < piece[y].length; x++) {
        if (!piece[y][x]) continue;
        const newX = futureX + x;
        const newY = futureY + y;

        if (newX < 0 || newX >= this.board[0].length) return true;
        if (newY < 0 || newY >= this.board.length) return true;

        if (currentPositions.includes(`${newX}${newY}`)) continue;
        if (this.board[newY][newX] != 0) return true;
      }
    }

    return false;
  }

  getTetraminoPositions() {
    let positions = [];

    this.currentTetramino.forEach((row, y) =>
      row.forEach((value, x) => {
        if (value) {
          positions.push(`${this.x + x}${this.y + y}`);
        }
      })
    );

    return positions;
  }
}

export { Piece };
