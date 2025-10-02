import { build } from 'vite'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

async function buildVue() {
  try {
    console.log('🔨 Сборка Vue компонентов...')

    await build({
      configFile: false,
      plugins: [(await import('@vitejs/plugin-vue')).default()],
      build: {
        lib: {
          entry: resolve(__dirname, '../src/main.ts'),
          name: 'IconGallery',
          fileName: 'main',
          formats: ['es']
        },
        outDir: resolve(__dirname, '../dist'),
        rollupOptions: {
          external: ['vue'],
          output: {
            globals: {
              vue: 'Vue'
            }
          }
        }
      }
    })

    console.log('✅ Vue компоненты собраны успешно')
  } catch (error) {
    console.error('❌ Ошибка сборки Vue компонентов:', error)
    process.exit(1)
  }
}

buildVue()
