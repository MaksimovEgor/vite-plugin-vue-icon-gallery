import { copyFileSync, mkdirSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const srcDir = resolve(__dirname, '../src')
const distDir = resolve(__dirname, '../dist/gallery') // Изменено на dist/gallery

// Создаем dist/gallery директорию если её нет
if (!existsSync(distDir)) {
  mkdirSync(distDir, { recursive: true })
}

// Копируем статические файлы
const filesToCopy = ['index.html', 'styles.css', 'gallery-browser.js']

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

console.log('🎨 Статические файлы скопированы в dist/gallery/')
