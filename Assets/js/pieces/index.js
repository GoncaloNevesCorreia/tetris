import tetraminosList from "./data/tetraminos.json" assert { type: "json" };
import { Queue } from "./queue/index.js";
import { Piece } from "./piece.js";
import { Square } from "../Interface/square.js";

class Pieces extends Queue {
    constructor(nextPiecesSection) {
        super();
        this.nextPiecesSection = nextPiecesSection;
        this.codes = ["i", "o", "t", "j", "l", "s", "z"];
    }

    add() {
        const piece = this.randomPiece();
        this.enqueue(piece);
        this.showNextPieces();
    }

    next() {
        const piece = this.dequeue();
        this.add();
        return piece;
    }

    randomPiece() {
        const validCodes = this.codes.filter((code) => {
            return !this.items.some((item) => item.code === code);
        });

        const pieceIndex = Math.floor(Math.random() * validCodes.length);
        const pieceCode = validCodes[pieceIndex];
        const tetramino = tetraminosList[pieceCode];
        return new Piece(pieceCode, tetramino);
    }

    showNextPieces() {
        const ctx = this.nextPiecesSection.getContext("2d");
        const square = new Square(ctx);

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        let adjust = 0;

        this.items.forEach((piece, index) => {
            if (piece.rotations[0].length === 4) adjust--;
            piece.rotations[0].forEach((row, y) =>
                row.forEach((value, x) => {
                    if (!value) return;
                    const yPositions = [2, 6, 10];

                    const xPos = row.length === 4 ? 1 : 1.5;

                    const yPos = yPositions[index] + adjust;

                    square.draw(xPos + x, yPos + y, piece.code);
                })
            );
        });
    }
}

export { Pieces };