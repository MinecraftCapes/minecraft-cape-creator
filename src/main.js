class MinecraftCapeCreator {
    constructor() {
        this.canvas = document.createElement('canvas')
        this.context = this.canvas.getContext('2d', { willReadFrequently: true });

        this.color = "#FF0000"
        this.scale = 1;
    }
    loadImage() {
    }
    setColor(color) {
        this.color = color;
    }
    setScale(scale) {
        let newScale = Math.max(1, Math.min(scale, 6));
        this.scale = Math.pow(2, newScale - 1)
    }
    setImage(image) {
        this.image = image
    }
    async buildCape(callback) {
        this.context.canvas.width = 64 * this.scale
        this.context.canvas.height = 32 * this.scale;

        console.log(`${this.context.canvas.width} / ${this.context.canvas.height}`)

        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);

        this.context.fillStyle = this.color;

        let fillRect = (x, y, w, h) => {
            this.context.fillRect(x * this.scale, y * this.scale, w * this.scale, h * this.scale)
        }

        //Cape
        fillRect(0, 1, 1, 16); //Left
        fillRect(1, 0, 10, 1); //Top
        fillRect(11, 1, 1, 16); //Right
        fillRect(1, 1, 10, 16); //Front
        fillRect(11, 0, 10, 1); //Bottom
        fillRect(12, 1, 10, 16); //Back

        //Elytra
        fillRect(22, 11, 1, 11); //Inside Wing
        fillRect(31, 0, 3, 1); //Shoulder
        fillRect(32, 1, 2, 1); //Shoulder
        fillRect(34, 0, 6, 1); //Bottom

        fillRect(34, 2, 1, 2); //Outside Wing
        fillRect(35, 2, 1, 9); //Outside Wing

        fillRect(36, 2, 6, 14); //Wing
        fillRect(42, 3, 1, 13); //Wing
        fillRect(43, 4, 1, 12); //Wing
        fillRect(44, 7, 1, 9); //Wing
        fillRect(45, 11, 1, 5); //Wing
        fillRect(37, 16, 9, 3); //Wing
        fillRect(38, 19, 8, 2); //Wing
        fillRect(39, 21, 7, 1); //Wing

        // Draw the image
        if(this.image != null) {
            let img = new Image();
            img.crossOrigin = "anonymous";
            img.src = this.image
            await img.decode();
            this.context.drawImage(img, 1 * this.scale, 1 * this.scale, 10 * this.scale, 16 * this.scale);
        }

        return this.canvas.toDataURL()
    }
}

window.MinecraftCapeCreator = MinecraftCapeCreator;

export default MinecraftCapeCreator