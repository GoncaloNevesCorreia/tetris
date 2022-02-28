import tetraminosList from "./data/tetraminos.json" assert { type: "json" };

class Square {
  constructor(ctx) {
    this.size = 40;
    this.ctx = ctx;
  }

  draw(x, y, code) {
    const positionX = x * this.size;
    const positionY = y * this.size;

    this.ctx.fillStyle = tetraminosList[code].color;
    this.ctx.fillRect(positionX, positionY, this.size, this.size);
    this.ctx.strokeStyle = "black";
    this.ctx.strokeRect(positionX, positionY, this.size, this.size);
  }
}

export { Square };
