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
      iconsPath: 'src/components/app-svg', // одна папка или массив путей
      port: 3002, // порт галереи
      open: true // открыть браузер
    })
  ]
})
```

Запустите dev-сервер как обычно. Плагин поднимет отдельный сервер галереи и выведет URL в консоль.

### Способ 2: Отдельная команда

#### 1. Добавьте команду в package.json

```json
{
  "scripts": {
    "dev:icons": "vue-icon-gallery",
    "dev:all": "npm-run-all --parallel dev dev:icons"
  }
}
```

#### 2. Запуск

```bash
# Только галерея иконок
npm run dev:icons

# Основной проект + галерея параллельно
npm run dev:all
```

## Опции

```typescript
interface IconGalleryOptions {
  iconsPath?: string | string[] // по умолчанию: 'src/components/app-svg'
  port?: number // по умолчанию: 3002
  open?: boolean // по умолчанию: true
}
```

## Как это работает

- Плагин сканирует указанные папки иконок и поднимает сервер галереи.
- Галерея отображает только реальные SVG иконки с сервера (без заглушек).
- Цвета:
  - Если у элемента SVG не задан `fill`/`stroke`, галерея применит выбранный цвет.
  - Если `fill`/`stroke` заданы в SVG — галерея их не переопределяет.
- По клику копируется имя иконки.

## Команды разработчика

- `npm run dev:gallery` — dev для UI галереи (порт 5175, HMR). Требует доступный `/api/*` плагина.
- `npm run build` — сборка плагина и UI галереи.

## 🎯 Vue 3 Composition API

Галерея построена на современном Vue 3 с использованием Composition API и структуры как в обычных Vue проектах. **Вы работаете с обычными Vue компонентами!**

### ✨ Как работать с проектом

**Вы редактируете только Vue компоненты:**

```vue
<!-- src/IconGallery.vue -->
<template>
  <div class="icon-gallery">
    <header class="gallery-header">
      <h1>🎨 Vue Icon Gallery</h1>
      <!-- Ваш HTML код -->
    </header>
    <!-- Остальной код -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// Ваш Vue код здесь
const searchQuery = ref('')
const filteredIcons = computed(() => {
  // Ваша логика
})
</script>

<style scoped>
/* Ваши стили здесь */
.icon-gallery {
  /* CSS код */
}
</style>
```

### Структура проекта

```
src/
├── IconGallery.vue     # 🎯 ОСНОВНОЙ КОМПОНЕНТ - редактируйте здесь!
├── main.ts             # Точка входа Vue приложения
├── index.html          # HTML шаблон
├── styles.css          # Глобальные стили
├── iconScanner.ts      # Сканер иконок
├── simpleGalleryServer.ts # HTTP сервер
└── index.ts            # Основной плагин
```

### 🚀 Разработка

1. **Редактируйте `IconGallery.vue`** - это ваш основной компонент
2. **Добавляйте стили** в `<style scoped>` или в `styles.css`
3. **Используйте Composition API** как в обычном Vue проекте
4. **Собирайте проект** командой `npm run build`

### Архитектура Vue приложения

```html
<!-- index.html -->
<!DOCTYPE html>
<html>
  <head>
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
    <link rel="stylesheet" href="/styles.css" />
  </head>
  <body>
    <div id="app">
      <div class="loading">🎨 Загрузка галереи иконок...</div>
    </div>
    <script type="module" src="/main.js"></script>
  </body>
</html>
```

```typescript
// main.ts
import { createApp, ref, computed, onMounted } from 'vue'

const IconGallery = {
  props: ['icons'],
  setup(props) {
    const searchQuery = ref('')
    const filteredIcons = computed(() => {
      return props.icons.filter((icon) =>
        icon.name.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    })

    return { searchQuery, filteredIcons }
  },
  template: `<!-- Vue template -->`
}

// Глобальная функция для инициализации
window.initIconGallery = (icons) => {
  const app = createApp(IconGallery, { icons })
  app.mount('#app')
}
```

```css
/* styles.css */
.icon-gallery {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  /* ... остальные стили */
}
```

## Лицензия

MIT
