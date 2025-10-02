import { copyFileSync, mkdirSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const srcDir = resolve(__dirname, '../src')
const distDir = resolve(__dirname, '../dist')

// Создаем dist директорию если её нет
if (!existsSync(distDir)) {
  mkdirSync(distDir, { recursive: true })
}

// Копируем статические файлы
const filesToCopy = ['index.html', 'styles.css', 'main.ts']

filesToCopy.forEach((file) => {
  const srcPath = resolve(srcDir, file)
  const distPath = resolve(distDir, file)

  if (existsSync(srcPath)) {
    copyFileSync(srcPath, distPath)
    console.log(`✅ Скопирован: ${file}`)
  } else {
    console.warn(`⚠️  Файл не найден: ${file}`)
  }
})

console.log('🎨 Статические файлы скопированы в dist/')
