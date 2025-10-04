class MinecraftCapeCreator {
    constructor() {
        this.canvas = document.createElement('canvas')
        this.context = this.canvas.getContext('2d', { willReadFrequently: true });

        // Fixes resizing blurriness
        this.context.mozImageSmoothingEnabled = false;
        this.context.webkitImageSmoothingEnabled = false;
        this.context.msImageSmoothingEnabled = false;
        this.context.imageSmoothingEnabled = false;

        this.AUTO_COLOR = "auto"
        this.color = this.AUTO_COLOR
        this.scale = 1;
        this.elytraImage = true;
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
    setBackground(background) {
        this.background = background
    }
    showOnElytra(value) {
        this.elytraImage = value
    }
    buildCape() {
        return new Promise(async (resolve, reject) => {
            const ctx = this.context;
            try {
                // Prepare canvas
                ctx.canvas.width = 64 * this.scale;
                ctx.canvas.height = 32 * this.scale;
                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

                // Helpers
                const calculateAverageColor = (image) => {
                    const { data } = image;
                    const length = data.length;
                    let count = 0;
                    let rgb = { r: 0, g: 0, b: 0 };
                    for (let i = 0; i < length; i += 5 * 4) {
                        count++;
                        rgb.r += data[i];
                        rgb.g += data[i + 1];
                        rgb.b += data[i + 2];
                    }
                    rgb.r = Math.floor(rgb.r / count);
                    rgb.g = Math.floor(rgb.g / count);
                    rgb.b = Math.floor(rgb.b / count);
                    return `#${((1 << 24) | (rgb.r << 16) | (rgb.g << 8) | rgb.b).toString(16).slice(1)}`;
                };

                const fillRect = (x, y, w, h) => ctx.fillRect(x * this.scale, y * this.scale, w * this.scale, h * this.scale);
                const clearRect = (x, y, w, h) => ctx.clearRect(x * this.scale, y * this.scale, w * this.scale, h * this.scale);

                const loadImage = (src) => new Promise((res, rej) => {
                    const i = new Image();
                    i.crossOrigin = "anonymous";
                    i.onload = () => res(i);
                    i.onerror = (e) => rej(e);
                    i.src = src;
                });

                // Load whichever images are present
                let bgImg = null, fgImg = null;
                const tasks = [];
                if (this.background) tasks.push(loadImage(this.background).then(i => (bgImg = i)));
                if (this.image) tasks.push(loadImage(this.image).then(i => (fgImg = i)));

                // Wait for all requested images to load
                await Promise.all(tasks);

                // Draw in correct z-order: background first
                if (bgImg) {
                    if(bgImg.width > 64 * this.scale && bgImg.height > 32 * this.scale) {
                        ctx.drawImage(bgImg, 0, 0, ctx.canvas.width, ctx.canvas.height);
                    } else {
                        const tempCanvas = document.createElement('canvas').getContext('2d');
                        tempCanvas.drawImage(bgImg, 0, 0);
                        var imgData = tempCanvas.getImageData(0, 0, bgImg.width, bgImg.height).data;

                        // Draw the zoomed-up pixels to a different canvas context
                        for (var x = 0; x < bgImg.width; x++) {
                            for (var y = 0; y < bgImg.height; y++){
                                // Find the starting index in the one-dimensional image data
                                var i = (y * bgImg.width + x) * 4;
                                var r = imgData[i];
                                var g = imgData[i+1];
                                var b = imgData[i+2];
                                var a = imgData[i+3];
                                ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a / 255})`;
                                fillRect(x, y, 1, 1);
                            }
                        }
                    }
                }

                // Then draw the foreground/cape + elytra logic
                if (fgImg) {
                    // Cape image
                    ctx.drawImage(fgImg, 1 * this.scale, 1 * this.scale, 10 * this.scale, 16 * this.scale);

                    // Set the auto colour if required
                    if (this.color === this.AUTO_COLOR) {
                        const capeRegion = ctx.getImageData(1 * this.scale, 1 * this.scale, 10 * this.scale, 16 * this.scale);
                        ctx.fillStyle = calculateAverageColor(capeRegion);
                    } else {
                        ctx.fillStyle = this.color;
                    }

                    if (this.elytraImage) {
                        ctx.drawImage(fgImg, 36 * this.scale, 2 * this.scale, 10 * this.scale, 20 * this.scale); // Elytra
                    } else if (!this.background) {
                        fillRect(36, 2, 10, 20); // Elytra fallback when no background
                    }
                    
                    if (!this.background) {
                        // Cape outlines/back
                        fillRect(0, 1, 1, 16);   // Left
                        fillRect(1, 0, 10, 1);  // Top
                        fillRect(11, 1, 1, 16); // Right
                        fillRect(11, 0, 10, 1); // Bottom
                        fillRect(12, 1, 10, 16); // Back

                        // Elytra extras
                        fillRect(22, 11, 1, 11); // Inside Wing
                        fillRect(31, 0, 3, 1);   // Shoulder
                        fillRect(32, 1, 2, 1);   // Shoulder
                        fillRect(34, 0, 6, 1);   // Bottom

                        fillRect(34, 2, 1, 2);   // Outside Wing
                        fillRect(35, 2, 1, 9);   // Outside Wing
                    }

                    if (!this.background || (this.background && this.elytraImage)) {
                        // Remove Elytra parts
                        clearRect(36, 16, 1, 6); // Bottom Left
                        clearRect(37, 19, 1, 3); // Bottom Left
                        clearRect(38, 21, 1, 1); // Bottom Left
                        clearRect(42, 2, 1, 1);  // Top Right
                        clearRect(43, 2, 1, 2);  // Top Right
                        clearRect(44, 2, 1, 5);  // Top Right
                        clearRect(45, 2, 1, 9);  // Top Right
                    }
                }

                // Export
                try {
                    resolve(ctx.canvas.toDataURL());
                } catch (e) {
                    // Likely a CORS taint error
                    reject(e);
                }
            } catch (err) {
                reject(err);
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