# 🎨 Vite Plugin Vue Icon Gallery - Инструкция по использованию

## 📦 Установка

```bash
npm install vite-plugin-vue-icon-gallery --save-dev
```

## 🚀 Использование

### 1. Настройка в vite.config.ts

```typescript
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { vueIconGallery } from "vite-plugin-vue-icon-gallery";

export default defineConfig({
  plugins: [
    vue(),
    vueIconGallery({
      iconsPath: "src/components/app-svg", // Путь к папке с иконками
      port: 3002, // Порт для галереи
      open: true, // Автоматически открывать браузер
    }),
  ],
});
```

### 2. Запуск

```bash
npm run dev
```

После запуска:

- Основной проект будет доступен на `http://localhost:5173`
- Галерея иконок будет доступна на `http://localhost:3002`

## ⚙️ Опции конфигурации

```typescript
interface IconGalleryOptions {
  /** Путь к папке с иконками (по умолчанию: 'src/components/app-svg') */
  iconsPath?: string;

  /** Порт для галереи (по умолчанию: 3002) */
  port?: number;

  /** Автоматически открывать браузер (по умолчанию: true) */
  open?: boolean;
}
```

## 📁 Структура проекта

```
your-project/
├── src/
│   └── components/
│       └── app-svg/          # ← Ваши SVG иконки здесь
│           ├── HomeIcon.vue
│           ├── UserIcon.vue
│           └── SettingsIcon.vue
├── vite.config.ts
└── package.json
```

## 🎯 Возможности галереи

- 🔍 **Автоматический импорт** всех SVG иконок из папки проекта
- 🎨 **Интерактивное изменение цветов** (fill/stroke)
- 🔎 **Поиск по названиям** иконок
- 📋 **Копирование названий** иконок одним кликом
- 📱 **Адаптивный grid layout** - ячейки адаптируются под размер иконок
- 🚀 **Два сервера** - основной проект + галерея иконок

## 🔧 Требования

- Vue 3.x
- Vite 4.x+
- Node.js 16+

## 📝 Примеры иконок

Каждая иконка должна быть Vue компонентом с SVG:

```vue
<!-- src/components/app-svg/HomeIcon.vue -->
<template>
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M9 22V12H15V22"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>

<script setup lang="ts">
// Home icon component
</script>
```

## 🚀 Преимущества

- ✅ **Не влияет на production build** - работает только в dev режиме
- ✅ **Автоматическое обновление** - новые иконки появляются без перезапуска
- ✅ **Гибкая настройка** - настраиваемые пути и порты
- ✅ **TypeScript поддержка** - полная типизация
- ✅ **Красивый UI** - современный дизайн с темной темой

## 🤝 Вклад в проект

1. Fork репозитория
2. Создайте feature branch (`git checkout -b feature/amazing-feature`)
3. Commit изменения (`git commit -m 'Add amazing feature'`)
4. Push в branch (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

## 📄 Лицензия

MIT License - см. файл [LICENSE](LICENSE) для деталей.
