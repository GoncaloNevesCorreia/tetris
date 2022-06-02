import { Tetris } from "./tetris.js";

const canvas = document.querySelector("#board");
const ctx = canvas.getContext("2d");

const scoreBoard = document.querySelector("#score");
const lines = document.querySelector("#lines");
const level = document.querySelector("#level");
const nextPieces = document.querySelector("#nextPieces");
const gameOverScreen = document.querySelector("#gameOver");

const elements = {
    scoreBoard,
    nextPieces,
    lines,
    level,
    gameOverScreen,
};

const rows = 20;
const columns = 10;

const tetris = new Tetris(elements, rows, columns, ctx);

document.addEventListener("keydown", ({ code }) => {
    switch (code) {
        case "Escape":
            tetris.isPaused = !tetris.isPaused;
            break;
    }
});

tetris.newGame();
