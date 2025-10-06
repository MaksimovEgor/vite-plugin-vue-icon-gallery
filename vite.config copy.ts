import path from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import vueDevTools from 'vite-plugin-vue-devtools'
import mkcert from 'vite-plugin-mkcert'
import { vueIconGallery } from 'vue-icon-gallery'

export default defineConfig(({ mode }) => {
  process.env = Object.assign(process.env, loadEnv(mode, process.cwd()))

  return {
    plugins: [
      vue(),
      VueI18nPlugin({
        include: path.resolve(__dirname, 'src/locales/*.json')
      }),
      process.env.VITE_VUE_DEV_TOOLS === 'true' && vueDevTools(),
      mkcert(),
      vueIconGallery({
        iconsPath: 'src/components/app-svg', // Путь к вашим иконкам
        port: 3002, // Порт для галереи
        open: true // Автоматически открывать браузер
      })
    ],
    server: {
      host: '0.0.0.0',
      port: 3000,
      https: true,
      headers: {
        'Cross-Origin-Embedder-Policy': 'require-corp',
        'Cross-Origin-Opener-Policy': 'same-origin'
      },
      proxy: {
        '/api/v1': {
          target: `https://${process.env.VITE_DEV_URL}`,
          changeOrigin: true,
          secure: false
        },
        '/styles/v1': {
          target: `https://${process.env.VITE_DEV_URL}`,
          changeOrigin: true,
          secure: false
        },
        '/images': {
          target: `https://${process.env.VITE_DEV_URL}`,
          changeOrigin: true,
          secure: false
        }
      },
      open: true
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
          @use "@/assets/styles/colors-theme/${process.env.VITE_UI_THEME}.scss";
          @use "@/assets/styles/mixins.scss" as *;
          `
        }
      }
    },
    resolve: {
      extensions: ['.ts', '.js', '.vue', '.json'],
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    }
  }
})
