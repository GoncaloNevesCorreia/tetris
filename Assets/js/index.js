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

resizeCanvas(canvas, 10, 20, squareSize);
resizeCanvas(nextPieces, 6, 13, squareSize);

function resizeCanvas(canvasToResize, cols, rows, size) {
    canvasToResize.width = cols * size;
    canvasToResize.height = rows * size;

    canvasToResize.style.width = canvasToResize.width;
    canvasToResize.style.height = canvasToResize.height;
}

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
            pause: document.querySelector("#pause_btn"),
        },
    },
    pause: {
        section: document.querySelector("#gamePause"),
        buttons: {
            resume: document.querySelector("#gamePause .resumeGameBtn"),
            newGame: document.querySelector("#gamePause .newGameBtn"),
            exit: document.querySelector("#gamePause .exitGameBtn"),
            mute: document.querySelector("#gamePause .mute_sound_btn"),
        },
    },
    gameOver: {
        section: document.querySelector("#gameOver"),
        buttons: {
            newGame: document.querySelector("#gameOver .newGameBtn"),
            exit: document.querySelector("#gameOver .exitGameBtn"),
            mute: document.querySelector("#gameOver .mute_sound_btn"),
        },
    },
};

tetris.addEventListener("gameover", () => {
    sections.gameOver.section.classList.remove("hide");

    tetris.sounds.music.volume = tetris.sounds.volume.low;

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

sections.pause.buttons.mute.addEventListener("click", toggleMute);
sections.gameOver.buttons.mute.addEventListener("click", toggleMute);

sections.game.buttons.pause.addEventListener("click", () => {
    if (tetris.gameOver) return;
    togglePause();
});

document.addEventListener("keydown", ({ code }) => {
    switch (code) {
        case "Escape":
            if (tetris.gameOver) return;

            togglePause();
            break;
    }
});

function toggleMute() {
    if (tetris.sounds.isMuted) {
        tetris.sounds.isMuted = false;
        tetris.playMusic();
        const iconMuted = document.querySelectorAll(".fa-volume-xmark");
        const iconUnMuted = document.querySelectorAll(".fa-volume-high");

        iconUnMuted.forEach((icon) => {
            icon.classList.remove("hide");
        });

        iconMuted.forEach((icon) => {
            icon.classList.add("hide");
        });
    } else {
        tetris.sounds.isMuted = true;
        tetris.stopMusic();
        const iconMuted = document.querySelectorAll(".fa-volume-xmark");
        const iconUnMuted = document.querySelectorAll(".fa-volume-high");

        iconUnMuted.forEach((icon) => {
            icon.classList.add("hide");
        });

        iconMuted.forEach((icon) => {
            icon.classList.remove("hide");
        });
    }
}

function togglePause() {
    tetris.isPaused = !tetris.isPaused;
    sections.pause.section.classList.toggle("hide");
    if (tetris.isPaused) {
        tetris.sounds.music.volume = tetris.sounds.volume.low;
    } else {
        tetris.sounds.music.volume = tetris.sounds.volume.high;
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
