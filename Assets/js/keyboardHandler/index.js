class KeyboardHandler {
    constructor(tetris) {
        this.tetris = tetris;

        this.constrols = {
            ArrowDown: {
                isPressed: false,
                longPress: true,
                needToPress: false,
                times: 0,
                timestamp: 0,
                exec: this.tetris.moveDown,
            },
            ArrowLeft: {
                isPressed: false,
                longPress: true,
                needToPress: false,
                times: 0,
                timestamp: 0,
                exec: this.tetris.moveLeft,
            },
            ArrowRight: {
                isPressed: false,
                longPress: true,
                needToPress: false,
                times: 0,
                timestamp: 0,
                exec: this.tetris.moveRight,
            },
            ArrowUp: {
                isPressed: false,
                longPress: false,
                needToPress: false,
                times: 0,
                timestamp: 0,
                exec: this.tetris.rotatePiece,
            },
            KeyS: {
                isPressed: false,
                longPress: true,
                needToPress: false,
                times: 0,
                timestamp: 0,
                exec: this.tetris.moveDown,
            },
            KeyA: {
                isPressed: false,
                longPress: true,
                needToPress: false,
                times: 0,
                timestamp: 0,
                exec: this.tetris.moveLeft,
            },
            KeyD: {
                isPressed: false,
                longPress: true,
                needToPress: false,
                times: 0,
                timestamp: 0,
                exec: this.tetris.moveRight,
            },
            KeyW: {
                isPressed: false,
                longPress: false,
                needToPress: false,
                times: 0,
                timestamp: 0,
                exec: this.tetris.rotatePiece,
            },
            Space: {
                isPressed: false,
                longPress: false,
                needToPress: false,
                times: 0,
                timestamp: 0,
                exec: this.tetris.hardDrop,
            },
        };

        document.addEventListener("keydown", this.keyDown);
        document.addEventListener("keyup", this.keyUp);
    }

    keyDown = ({ code }) => {
        if (this.tetris.isPaused) return;
        if (!this.isValidKeyPress(code)) return;
        const key = this.constrols[code];
        if (!key.isPressed) {
            key.isPressed = true;
            key.needToPress = true;
        }
    };

    keyUp = ({ code }) => {
        if (this.tetris.isPaused) return;
        if (!this.isValidKeyPress(code)) return;
        this.constrols[code].isPressed = false;
        this.constrols[code].times = 0;
        this.constrols[code].timestamp = 0;
    };

    isValidKeyPress(key) {
        return this.constrols.hasOwnProperty(key);
    }

    getKeysToExecute() {
        let keys = [];

        Object.keys(this.constrols).forEach((code) => {
            const key = this.constrols[code];

            // Se nenhuma tecla está a ser premida e o comando já foi executado
            // e não foi clicado momentáriamente numa tecla, não move
            if (!key.isPressed && !key.needToPress) return;

            // Se está a ser premida, mas a tecla não é de longPress e já foi executado, não move
            if (key.isPressed && !key.longPress && key.times) return;

            if (key.timestamp === 0) key.timestamp = new Date().getTime();

            const now = new Date().getTime();

            if (now - key.timestamp < 200 && key.times) return;

            keys.push(key);
        });

        return keys;
    }
}

export { KeyboardHandler };
