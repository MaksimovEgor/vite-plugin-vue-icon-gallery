# Vite Plugin Vue Icon Gallery

A Vite plugin for creating an interactive SVG icon gallery in Vue projects.

## Features

- Interactive SVG icon gallery
- Easy integration with Vite and Vue 3
- Development tool for browsing and testing icons

## Installation

```bash
npm install vite-plugin-vue-icon-gallery
```

## Usage

Add the plugin to your `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { iconGallery } from 'vite-plugin-vue-icon-gallery'

export default defineConfig({
  plugins: [
    vue(),
    iconGallery()
  ]
})
```

## License

MIT
