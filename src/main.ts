import { createApp } from 'vue'
import IconGallery from './IconGallery.vue'

export interface IconInfo {
  name: string
  path: string
}

// Функция для инициализации приложения
export function createIconGalleryApp(icons: IconInfo[]) {
  const app = createApp(IconGallery, { icons })
  return app
}

// Загружаем данные иконок и инициализируем приложение
async function initApp() {
  try {
    const response = await fetch('/api/icons')
    const icons: IconInfo[] = await response.json()

    const app = createApp(IconGallery, { icons })
    app.mount('#app')

    console.log(`🎨 Icon Gallery загружена с ${icons.length} иконками`)
  } catch (error) {
    console.error('Ошибка загрузки иконок:', error)
    document.getElementById('app')!.innerHTML =
      '<div class="loading">❌ Ошибка загрузки галереи</div>'
  }
}

// Инициализируем приложение при загрузке
initApp()
