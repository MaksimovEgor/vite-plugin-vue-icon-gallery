# 🎨 Vite Plugin Vue Icon Gallery

Интерактивная галерея SVG иконок для Vue проектов. Автоматически импортирует все иконки из указанной папки и предоставляет удобный интерфейс для их просмотра, поиска и тестирования.

## ✨ Возможности

- 🔍 **Автоматический импорт** всех SVG иконок из папки проекта
- 🎨 **Интерактивное изменение цветов** (fill/stroke)
- 🔎 **Поиск по названиям** иконок
- 📋 **Копирование названий** иконок одним кликом
- 📱 **Masonry layout** - ячейки адаптируются под размер иконок
- 🚀 **Два способа использования** - плагин или отдельная команда
- ⚡ **Vue 3 Composition API** - современный реактивный интерфейс
- 🎯 **Поддержка нескольких папок** - сканирование иконок из разных директорий

## 📦 Установка

```bash
npm install vite-plugin-vue-icon-gallery --save-dev
```

## 🚀 Способы использования

### Способ 1: Vite плагин (рекомендуется)

#### 1. Настройка в vite.config.ts

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { vueIconGallery } from 'vite-plugin-vue-icon-gallery'

export default defineConfig({
  plugins: [
    vue(),
    vueIconGallery({
      iconsPath: 'src/components/app-svg', // Путь к папке с иконками
      port: 3002, // Порт для галереи
      open: true // Автоматически открывать браузер
    })
  ]
})
```

#### 2. Запуск

```bash
# Обычный dev сервер (галерея доступна на /icon-gallery)
npm run dev

# Или перейдите на http://localhost:5173/icon-gallery
```

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

## ⚙️ Опции конфигурации

```typescript
interface IconGalleryOptions {
  /** Путь к папке с иконками или массив путей (по умолчанию: 'src/components/app-svg') */
  iconsPath?: string | string[]

  /** Порт для галереи (по умолчанию: 3002) */
  port?: number

  /** Автоматически открывать браузер (по умолчанию: true) */
  open?: boolean
}
```

## 📁 Структура проекта

```
your-project/
├── src/
│   └── components/
│       └── app-svg/          # ← Ваши SVG иконки здесь
│           ├── Icon1.vue
│           ├── Icon2.vue
│           └── ...
├── vite.config.ts
└── package.json
```

## 🎯 Использование галереи

1. **Просмотр иконок** - все иконки автоматически загружаются из указанной папки
2. **Поиск** - используйте поле поиска для фильтрации иконок по названию
3. **Изменение цветов** - переключайте fill/stroke и выбирайте цвета
4. **Копирование** - кликните на иконку, чтобы скопировать её название
5. **Адаптивный размер** - ячейки автоматически подстраиваются под размер иконок

## 🔧 Требования

- Vue 3.x
- Vite 4.x+
- Node.js 16+

## 📝 Примеры

### Базовое использование

```typescript
// vite.config.ts
import { vueIconGallery } from 'vite-plugin-vue-icon-gallery'

export default defineConfig({
  plugins: [
    vue(),
    vueIconGallery() // Использует настройки по умолчанию
  ]
})
```

### Кастомная конфигурация

```typescript
// vite.config.ts
import { vueIconGallery } from 'vite-plugin-vue-icon-gallery'

export default defineConfig({
  plugins: [
    vue(),
    vueIconGallery({
      iconsPath: 'src/assets/icons', // Другая папка с иконками
      port: 3003, // Другой порт
      open: false // Не открывать браузер автоматически
    })
  ]
})
```

### Использование с несколькими папками

```typescript
// vite.config.ts
import { vueIconGallery } from 'vite-plugin-vue-icon-gallery'

export default defineConfig({
  plugins: [
    vue(),
    vueIconGallery({
      iconsPath: [
        'src/components/app-svg', // Основные иконки приложения
        'src/components/ui-icons', // UI иконки
        'src/assets/icons' // Дополнительные иконки
      ],
      port: 3002,
      open: true
    })
  ]
})
```

### Отдельная команда с настройками

```json
{
  "scripts": {
    "dev:icons": "vue-icon-gallery --port 3002 --path src/components/app-svg",
    "dev:all": "npm-run-all --parallel dev dev:icons"
  }
}
```

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

## 🚀 Преимущества

- ✅ **Не влияет на production build** - работает только в dev режиме
- ✅ **Автоматическое обновление** - новые иконки появляются без перезапуска
- ✅ **Гибкая настройка** - настраиваемые пути и порты
- ✅ **Два способа использования** - выберите удобный для вашего workflow
- ✅ **Masonry layout** - эффективное использование пространства
- ✅ **TypeScript поддержка** - полная типизация
- ✅ **Vue 3 Composition API** - современный реактивный интерфейс
- ✅ **Поддержка нескольких папок** - сканирование из разных директорий

## 🤝 Вклад в проект

1. Fork репозитория
2. Создайте feature branch (`git checkout -b feature/amazing-feature`)
3. Commit изменения (`git commit -m 'Add amazing feature'`)
4. Push в branch (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

## 📄 Лицензия

MIT License - см. файл [LICENSE](LICENSE) для деталей.

## 🙏 Благодарности

- [Vue.js](https://vuejs.org/) - за отличный фреймворк
- [Vite](https://vitejs.dev/) - за быстрый инструмент сборки
- [Vite Plugin Vue](https://github.com/vitejs/vite-plugin-vue) - за плагин Vue
