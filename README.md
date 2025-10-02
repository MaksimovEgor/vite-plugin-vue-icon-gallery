# 🎨 Vite Plugin Vue Icon Gallery

Интерактивная галерея SVG иконок для Vue проектов. Автоматически импортирует все иконки из указанной папки и предоставляет удобный интерфейс для их просмотра, поиска и тестирования.

## ✨ Возможности

- 🔍 **Автоматический импорт** всех SVG иконок из папки проекта
- 🎨 **Интерактивное изменение цветов** (fill/stroke)
- 🔎 **Поиск по названиям** иконок
- 📋 **Копирование названий** иконок одним кликом
- 📱 **Masonry layout** - ячейки адаптируются под размер иконок
- 🚀 **Два способа использования** - плагин или отдельная команда

## 📦 Установка

```bash
npm install vite-plugin-vue-icon-gallery --save-dev
```

## 🚀 Способы использования

### Способ 1: Vite плагин (рекомендуется)

#### 1. Настройка в vite.config.ts

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
import { vueIconGallery } from "vite-plugin-vue-icon-gallery";

export default defineConfig({
  plugins: [
    vue(),
    vueIconGallery(), // Использует настройки по умолчанию
  ],
});
```

### Кастомная конфигурация

```typescript
// vite.config.ts
import { vueIconGallery } from "vite-plugin-vue-icon-gallery";

export default defineConfig({
  plugins: [
    vue(),
    vueIconGallery({
      iconsPath: "src/assets/icons", // Другая папка с иконками
      port: 3003, // Другой порт
      open: false, // Не открывать браузер автоматически
    }),
  ],
});
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

## 🚀 Преимущества

- ✅ **Не влияет на production build** - работает только в dev режиме
- ✅ **Автоматическое обновление** - новые иконки появляются без перезапуска
- ✅ **Гибкая настройка** - настраиваемые пути и порты
- ✅ **Два способа использования** - выберите удобный для вашего workflow
- ✅ **Masonry layout** - эффективное использование пространства
- ✅ **TypeScript поддержка** - полная типизация

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
