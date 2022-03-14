class KeyboardHandler {
    constructor() {
        this.constrols = {
            ArrowDown: {
                isPressed: false,
                longPress: true,
                needToPress: false,
                times: 0,
                timestamp: 0,
                funcName: "moveDown",
            },
            ArrowLeft: {
                isPressed: false,
                longPress: true,
                needToPress: false,
                times: 0,
                timestamp: 0,
                funcName: "moveLeft",
            },
            ArrowRight: {
                isPressed: false,
                longPress: true,
                needToPress: false,
                times: 0,
                timestamp: 0,
                funcName: "moveRight",
            },
            ArrowUp: {
                isPressed: false,
                longPress: false,
                needToPress: false,
                times: 0,
                timestamp: 0,
                funcName: "rotatePiece",
            },
            Space: {
                isPressed: false,
                longPress: false,
                needToPress: false,
                times: 0,
                timestamp: 0,
                funcName: "hardDrop",
            },
            Escape: {
                isPressed: false,
                longPress: false,
                needToPress: false,
                funcName: "newGame",
            },
        };
    }

    keyDown = ({ code }) => {
        if (!this.isValidKeyPress(code)) return;
        const key = this.constrols[code];
        if (!key.isPressed) {
            key.isPressed = true;
            key.needToPress = true;
        }
    };

    keyUp = ({ code }) => {
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
