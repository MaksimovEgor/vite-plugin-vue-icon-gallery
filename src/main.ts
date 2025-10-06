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
