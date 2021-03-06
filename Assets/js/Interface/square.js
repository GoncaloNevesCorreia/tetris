import tetraminosList from "../pieces/data/tetraminos.json" assert { type: "json" };

class Square {
    static images = [];

    constructor(ctx, code) {
        this.size = 35;
        this.ctx = ctx;
        this.code = code;
    }

    async draw(x, y) {
        const positionX = x * this.size;
        const positionY = y * this.size;
        const piece = tetraminosList[this.code];

        if (!piece.image) return;

        const image = await this.loadImage(piece.image);

        this.ctx.drawImage(image, positionX, positionY, this.size, this.size);
    }

    loadImage(name) {
        if (this.imageIsLoaded(name)) {
            return this.constructor.images[name];
        }

        return new Promise((resolve, reject) => {
            const imageDir = "./Assets/images/blocks/";
            const base_image = new Image();
            base_image.src = `${imageDir}${name}`;
            base_image.onload = () => {
                this.saveImage(name, base_image);
                resolve(base_image);
            };
            base_image.onerror = reject;
        });
    }

    imageIsLoaded(name) {
        return (
            this.constructor.images.hasOwnProperty(name) &&
            this.constructor.images[name].complete
        );
    }

    saveImage(name, image) {
        if (this.constructor.images.hasOwnProperty(name)) return;
        this.constructor.images[name] = image;
    }
}

export { Square };
