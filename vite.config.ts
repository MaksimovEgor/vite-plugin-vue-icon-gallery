import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'VueIconGallery',
      fileName: 'index',
      formats: ['cjs']
    },
    rollupOptions: {
      external: [
        'vite',
        'vue',
        '@vue/server-renderer',
        'node:fs',
        'node:path',
        'node:module',
        'node:crypto',
        'node:http',
        'node:stream',
        'http',
        'fs',
        'stream',
        'tty',
        'util'
      ],
      output: {
        globals: {
          vite: 'Vite',
          vue: 'Vue'
        }
      }
    }
  },
  define: {
    __dirname: JSON.stringify(__dirname)
  },
  resolve: {
    alias: {
      '@': resolve(process.cwd(), 'src')
    }
  },
  // Отключаем TypeScript проверку в Vite, так как мы используем tsc отдельно
  esbuild: {
    target: 'es2020'
  }
})
