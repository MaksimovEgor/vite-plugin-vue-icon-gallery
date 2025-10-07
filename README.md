# 🎨 vue-icon-gallery

**A Vite plugin for Vue 3 that opens a local gallery to preview your SVG icons before using them in templates.**
Perfect for projects where icon names aren’t enough — see your icons instantly, browse, search, and copy names without leaving your dev environment.

---

## ✨ Features

- 🖼️ **SVG preview gallery** — visualize all your icons directly in the browser
- 🔄 **Auto-updates** — new icons appear instantly, no rebuild required
- ⚙️ **Configurable paths & port** — preview multiple icon folders
- 🚫 **No production impact** — runs only during development
- 🎨 **Live color testing** — try different `fill` / `stroke` colors right in the gallery

---

## 🧩 Preview

![Icon gallery preview](./src/assets/screen.png)

---

## 📦 Installation

```bash
npm i -D vue-icon-gallery
```

---

## ⚙️ Usage (vite.config.ts)

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { vueIconGallery } from 'vue-icon-gallery'

export default defineConfig({
  plugins: [
    vue(),
    vueIconGallery({
      iconsPath: ['src/components/icons', 'src/assets/svg'], // folders with your SVG files
      port: 3002, // default: 3002
      open: true // default: true (open gallery in browser automatically)
    })
  ]
})
```

Then start your dev server as usual:

```bash
npm run dev
```

The plugin will launch a local **SVG gallery server** and print its URL to the console.

---

## 🧠 How it works

1. Scans specified folders for `.vue` files with `<svg>` tags.
2. Serves them via a lightweight local server.
3. Opens a visual gallery page for previewing and copying icon names.

---

## 💡 Why use this plugin?

When you store SVGs as `<template>` components or inline assets, it’s often hard to remember what each one looks like.
This plugin solves that — you can **see every icon visually before inserting it into code**.

---

## 🧰 Requirements

- Vue 3
- Vite 5+
- Node.js 20+

---

## 🚀 Roadmap

- [ ] Support for React / Svelte projects
- [ ] Icon metadata and categorization
- [ ] Light theme for gallery
- [ ] Inline icon copy option

---

## 📊 Example use cases

- Component libraries with large icon sets
- Design systems using SVG templates
- Teams maintaining internal icon packs

---

## 🧾 License

MIT © [Egor Maksimov](https://github.com/MaksimovEgor)

---

## 🔗 Links

- 📦 [NPM Package](https://www.npmjs.com/package/vue-icon-gallery)
- 💻 [GitHub Repository](https://github.com/MaksimovEgor/vue-icon-gallery)
- 🌟 If you like it — give it a ⭐ on GitHub!

---

### 🧭 Keywords

`vite plugin svg` · `vue svg icons` · `svg gallery` · `vite icon preview` · `vue3` · `frontend tools`
