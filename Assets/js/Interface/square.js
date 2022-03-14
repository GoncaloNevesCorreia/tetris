import tetraminosList from "../pieces/data/tetraminos.json" assert { type: "json" };

class Square {
    constructor(ctx) {
        this.size = 40;
        this.ctx = ctx;
        this.images = {};
    }

    async draw(x, y, code) {
        const positionX = x * this.size;
        const positionY = y * this.size;
        const piece = tetraminosList[code];

        if (!piece.image) {
            this.ctx.fillStyle = piece.color;
            this.ctx.fillRect(positionX, positionY, this.size, this.size);
            this.ctx.strokeStyle = "#333333";
            this.ctx.strokeRect(positionX, positionY, this.size, this.size);
        } else {
            const image = await this.loadImage(piece.image);
            this.ctx.drawImage(
                image,
                positionX,
                positionY,
                this.size,
                this.size
            );
        }
    }

    loadImage(name) {
        if (this.imageIsLoaded(name)) {
            return this.images[name];
        }

        return new Promise((resolve, reject) => {
            const imageDir = "/Assets/images/";
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
        return this.images.hasOwnProperty(name) && this.images[name].complete;
    }

    saveImage(name, image) {
        if (this.images.hasOwnProperty(name)) return;
        this.images[name] = image;
    }
}

export { Square };
