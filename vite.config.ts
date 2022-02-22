import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'

// https://vitejs.dev/config/
export default defineConfig({
    // This changes the out put dir from dist to build
    // comment this out if that isn't relevant for your project
    build: {
        // base: "https://doodl.maner.fr/public/",
        outDir: '../doodl-back/public',
    },
    base: "https://doodl.maner.fr/public/",
    server: {
      port: 5000
    },
    plugins: [
        reactRefresh(),
    ],
})