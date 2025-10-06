import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'

// Vite config dedicated to developing and building the Gallery UI as a normal Vue app
// Output is written to dist/gallery, which the plugin's simpleGalleryServer serves in consuming projects
export default defineConfig({
  root: 'src/gallery',
  plugins: [vue()],
  build: {
    outDir: '../../dist/gallery',
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(__dirname, 'src/gallery/index.html')
    }
  },
  resolve: {
    alias: {
      '@': resolve(process.cwd(), 'src')
    }
  },
  server: {
    port: 5175,
    open: false,
    proxy: {
      '/api': {
        target: 'http://localhost:3002',
        changeOrigin: true
      }
    }
  }
})
