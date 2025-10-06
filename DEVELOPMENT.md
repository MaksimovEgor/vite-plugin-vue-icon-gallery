# Development Guide (short)

## Quick start
- **Dev UI (HMR):**
  ```bash
  npm run dev:gallery
  ```
  Галерея на http://localhost:5175. Прокси `/api/*` → `http://localhost:3002` (нужен запущенный сервер плагина).

- **Build UI:**
  ```bash
  npm run build:gallery
  ```
  Результат в `dist/gallery/`.

- **Build plugin + UI:**
  ```bash
  npm run build
  ```

## Структура
```
src/
├── gallery/              # Vue-приложение галереи (разработка)
│   ├── index.html
│   └── main.ts
├── IconGallery.vue       # Компонент галереи
├── styles.css            # Глобальные переменные и базовые стили
├── index.ts              # Точка входа плагина
├── simpleGalleryServer.ts
└── iconScanner.ts

vite.gallery.config.ts    # Vite-конфиг для UI галереи
```

## Поведение галереи
- Показываются только реальные SVG с сервера (без заглушек).
- Цвета:
  - Если у элемента нет `fill`/`stroke`, применяется выбранный цвет.
  - Если заданы `fill`/`stroke` — они не переопределяются.

## Подсказки
- Редактируйте `src/IconGallery.vue` и `src/gallery/main.ts`.
- Для реального теста соберите плагин и подключите его в проект с иконками.
