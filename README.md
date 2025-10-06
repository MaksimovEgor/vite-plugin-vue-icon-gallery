# 🎨 vue-icon-gallery

Простой плагин для предпросмотра SVG-иконок в проектах на Vue. Показывает реальные иконки из ваших папок, позволяет искать и быстро проверять цвет fill/stroke.

## Требования

- Vue 3
- Vite 7+
- Node.js 20+

## Установка

```bash
npm i -D vue-icon-gallery
```

## Использование (vite.config.ts)

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { vueIconGallery } from 'vue-icon-gallery'

export default defineConfig({
  plugins: [
    vue(),
   vueIconGallery({
      iconsPath: ['src/components/app-svg', 'src/components/icons', ...], // Путь к папке с иконками
      port: 3002, // (по умолчанию: 3002)
      open: true // Автоматически открывать браузер, по умолчанию: true
    })
  ]
})
```

Запустите dev-сервер как обычно. Плагин поднимет отдельный сервер галереи и выведет URL в консоль.

## Как это работает

- Плагин сканирует указанные папки иконок и поднимает сервер галереи.
- Галерея отображает найденные SVG.
- По клику копируется имя иконки.

## 🚀 Преимущества

- ✅ **Не влияет на production build** - работает только в dev режиме
- ✅ **Автоматическое обновление** - новые иконки появляются без перезапуска
- ✅ **Гибкая настройка** - настраиваемые пути и порт

## Лицензия

MIT
