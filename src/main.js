class MinecraftCapeCreator {
    constructor() {
        this.canvas = document.createElement('canvas')
        this.context = this.canvas.getContext('2d', { willReadFrequently: true });

        this.AUTO_COLOR = "auto"
        this.color = this.AUTO_COLOR
        this.scale = 1;
    }
    loadImage() {
    }
    setColor(color) {
        this.color = color;
    }
    setAutoColor() {
        this.color = this.AUTO_COLOR;
    }
    setScale(scale) {
        let newScale = Math.max(1, Math.min(scale, 6));
        this.scale = Math.pow(2, newScale - 1)
    }
    setImage(image) {
        this.image = image
    }
    buildCape() {
        return new Promise((resolve, reject) => {
            this.context.canvas.width = 64 * this.scale
            this.context.canvas.height = 32 * this.scale;

            this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);

            const calculateAverageColor = (image) => {
                const { data } = image;
                const length = data.length;
                let count = 0;
                let rgb = { r: 0, g: 0, b: 0 };

                // Step through the pixels, every 5 pixels (each pixel has 4 values: RGBA)
                for (let i = 0; i < length; i += 5 * 4) {
                    count++;
                    rgb.r += data[i];
                    rgb.g += data[i + 1];
                    rgb.b += data[i + 2];
                }

                // Calculate the average color
                rgb.r = Math.floor(rgb.r / count);
                rgb.g = Math.floor(rgb.g / count);
                rgb.b = Math.floor(rgb.b / count);

                // Convert RGB to hex
                return `#${((1 << 24) | (rgb.r << 16) | (rgb.g << 8) | rgb.b).toString(16).slice(1)}`;
            };
            let fillRect = (x, y, w, h) => this.context.fillRect(x * this.scale, y * this.scale, w * this.scale, h * this.scale)
            let clearRect = (x, y, w, h) => this.context.clearRect(x * this.scale, y * this.scale, w * this.scale, h * this.scale)

            // Load the cropped image
            if (this.image != null) {
                let img = new Image();
                img.crossOrigin = "anonymous";
                img.src = this.image;

                img.onload = () => {
                    // Draw the image
                    this.context.drawImage(img, 1 * this.scale, 1 * this.scale, 10 * this.scale, 16 * this.scale); // The Cape
                    this.context.drawImage(img, 36 * this.scale, 2 * this.scale, 10 * this.scale, 20 * this.scale); // The Elytra

                    // Set the auto colour if required
                    if(this.color == this.AUTO_COLOR) {
                        this.context.fillStyle = calculateAverageColor(this.context.getImageData(1 * this.scale, 1 * this.scale, 10 * this.scale, 16 * this.scale))
                    } else {
                        this.context.fillStyle = this.color;
                    }

                    // Cape
                    fillRect(0, 1, 1, 16); //Left
                    fillRect(1, 0, 10, 1); //Top
                    fillRect(11, 1, 1, 16); //Right
                    fillRect(11, 0, 10, 1); //Bottom
                    fillRect(12, 1, 10, 16); //Back

                    // Elytra
                    fillRect(22, 11, 1, 11); //Inside Wing
                    fillRect(31, 0, 3, 1); //Shoulder
                    fillRect(32, 1, 2, 1); //Shoulder
                    fillRect(34, 0, 6, 1); //Bottom

                    fillRect(34, 2, 1, 2); //Outside Wing
                    fillRect(35, 2, 1, 9); //Outside Wing

                    // Remove Elytra parts
                    clearRect(36, 16, 1, 6); // Bottom Left
                    clearRect(37, 19, 1, 3); // Bottom Left
                    clearRect(38, 21, 1, 1); // Bottom Left
                    clearRect(42, 2, 1, 1); // Top Right
                    clearRect(43, 2, 1, 2); // Top Right
                    clearRect(44, 2, 1, 5); // Top Right
                    clearRect(45, 2, 1, 9); // Top Right

                    resolve(this.context.canvas.toDataURL());
                };

                img.onerror = (error) => reject(error);
            } else {
                resolve(this.context.canvas.toDataURL());
            }
        });
    }
    downloadCape(name = "Cape") {
        let link = document.createElement('a')
        link.setAttribute('download', `${name}.png`);
        link.setAttribute('href', this.context.canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"));
        link.click();
    }
}

window.MinecraftCapeCreator = MinecraftCapeCreator;

export default MinecraftCapeCreator