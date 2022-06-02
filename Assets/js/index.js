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

const sections = {
    mainMenu: {
        section: document.querySelector("#mainMenu"),
        buttons: {
            newGame: document.querySelector("#mainMenu .newGameBtn"),
        },
    },
    game: {
        section: document.querySelector("#game"),
    },
    pause: {
        section: document.querySelector("#gamePause"),
        buttons: {
            resume: document.querySelector("#gamePause .resumeGameBtn"),
            newGame: document.querySelector("#gamePause .newGameBtn"),
            exit: document.querySelector("#gamePause .exitGameBtn"),
        },
    },
    gameOver: {
        section: document.querySelector("#gameOver"),
        buttons: {
            newGame: document.querySelector("#gameOver .newGameBtn"),
            exit: document.querySelector("#gameOver .exitGameBtn"),
        },
    },
};

tetris.addEventListener("gameover", () => {
    sections.gameOver.section.classList.remove("hide");
});

sections.gameOver.buttons.newGame.addEventListener("click", () => {
    sections.gameOver.section.classList.add("hide");
    tetris.newGame();
});

sections.gameOver.buttons.exit.addEventListener("click", () => {
    sections.gameOver.section.classList.add("hide");

    sections.game.section.classList.add("hide");
    sections.mainMenu.section.classList.remove("hide");
});

sections.mainMenu.buttons.newGame.addEventListener("click", () => {
    sections.mainMenu.section.classList.add("hide");
    sections.game.section.classList.remove("hide");

    tetris.newGame();
});

sections.pause.buttons.newGame.addEventListener("click", () => {
    togglePause();
    tetris.endGame();
    tetris.newGame();
});

sections.pause.buttons.resume.addEventListener("click", togglePause);

sections.pause.buttons.exit.addEventListener("click", () => {
    togglePause();
    tetris.endGame();
    sections.game.section.classList.add("hide");
    sections.mainMenu.section.classList.remove("hide");
});

document.addEventListener("keydown", ({ code }) => {
    switch (code) {
        case "Escape":
            if (tetris.gameOver) return;

            togglePause();
            break;
    }
});

function togglePause() {
    tetris.isPaused = !tetris.isPaused;
    sections.pause.section.classList.toggle("hide");
}
