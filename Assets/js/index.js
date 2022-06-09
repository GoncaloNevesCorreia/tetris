import { Tetris } from "./tetris.js";

const canvas = document.querySelector("#board");
const ctx = canvas.getContext("2d");

const scoreBoard = document.querySelector("#score");
const highscoreElement = document.querySelector("#highscore");
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

const squareSize = 35;

const rows = 20;
const columns = 10;

canvas.width = columns * squareSize;
canvas.height = rows * squareSize;

canvas.style.width = canvas.width;
canvas.style.height = canvas.height;

nextPieces.width = 6 * squareSize;
nextPieces.height = 13 * squareSize;

nextPieces.style.width = nextPieces.width;
nextPieces.style.height = nextPieces.height;

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
        buttons: {
            pause: document.querySelector("#pause_btn")
        }
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

    const highscore = localStorage.getItem("highscore");

    if (highscore === null) {
        localStorage.setItem("highscore", tetris.score);
        highscoreElement.textContent = tetris.score;
    } else if (parseInt(highscore) < tetris.score) {
        localStorage.setItem("highscore", tetris.score);
        highscoreElement.textContent = tetris.score;
    }
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

    const highscore = localStorage.getItem("highscore");

    if (highscore !== null) {
        highscoreElement.textContent = highscore;
    } else {
        highscoreElement.textContent = 0;
    }
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
    tetris.stopMusic();
});

sections.game.buttons.pause.addEventListener("click", () => {
    if (tetris.gameOver) return;
    togglePause();
})

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
    if (tetris.isPaused) {
        tetris.sounds.music.volume = 0.05;
    } else {
        tetris.sounds.music.volume = 0.15;
    }
}

window.addEventListener("load", () => {
    const loader = document.querySelector("#loader");
    loader.classList.add("fade-out");

    setTimeout(() => {
        loader.querySelector("div").classList.add("hide");
    }, 500);

    setTimeout(() => {
        loader.classList.add("hide");
    }, 2000);
});
