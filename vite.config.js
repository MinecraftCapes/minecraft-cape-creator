import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
    build: {
        copyPublicDir: false,
        lib: {
            entry: resolve(__dirname, 'src/main.js'),
            name: 'Minecraft-Cape-Creator',
            fileName: 'minecraft-cape-creator',
        },
        outDir: './dist'
    }
})