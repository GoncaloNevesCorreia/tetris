import tetraminosList from "../pieces/data/tetraminos.json" assert { type: "json" };

class Square {
    constructor(ctx, code) {
        this.size = 40;
        this.ctx = ctx;
        this.code = code;
        this.opacity = 1;
        this.deg = 0;
    }

    async draw(x, y) {
        const positionX = x * this.size;
        const positionY = y * this.size;
        const piece = tetraminosList[this.code];

        this.ctx.save();

        this.ctx.globalAlpha = this.opacity;
        this.ctx.fillStyle = piece.color;
        this.ctx.strokeStyle = "#333333";

        if (this.deg > 0) {
            this.ctx.translate(positionX, positionY);
            this.ctx.rotate((this.deg * Math.PI) / 180);
            this.ctx.fillRect(0, 0, this.size, this.size);
            this.ctx.strokeRect(0, 0, this.size, this.size);
        } else {
            this.ctx.fillRect(positionX, positionY, this.size, this.size);
            this.ctx.strokeRect(positionX, positionY, this.size, this.size);
        }

        this.ctx.restore();

        // if (!piece.image) {
        //     this.ctx.fillStyle = piece.color;
        //     this.ctx.fillRect(positionX, positionY, this.size, this.size);
        //     this.ctx.globalAlpha = this.opacity;
        //     this.ctx.strokeStyle = "#333333";
        //     this.ctx.strokeRect(positionX, positionY, this.size, this.size);
        // } else {
        //     const image = await this.loadImage(piece.image);

        //     this.ctx.save();

        //     this.ctx.translate(positionX, positionY);
        //     this.ctx.rotate((this.deg * Math.PI) / 180);

        //     this.ctx.drawImage(image, 0, 0, this.size, this.size);
        // }
        // this.ctx.restore();
    }

    // fade() {
    //     this.opacity -= 0.01;
    //     this.draw();
    //     requestAnimationFrame(fade);
    // }

    // loadImage(name) {
    //     if (this.imageIsLoaded(name)) {
    //         return this.images[name];
    //     }

    //     return new Promise((resolve, reject) => {
    //         const imageDir = "/Assets/images/";
    //         const base_image = new Image();
    //         base_image.src = `${imageDir}${name}`;
    //         base_image.onload = () => {
    //             this.saveImage(name, base_image);
    //             resolve(base_image);
    //         };
    //         base_image.onerror = reject;
    //     });
    // }

    // imageIsLoaded(name) {
    //     return this.images.hasOwnProperty(name) && this.images[name].complete;
    // }

    // saveImage(name, image) {
    //     if (this.images.hasOwnProperty(name)) return;
    //     this.images[name] = image;
    // }
}

export { Square };
