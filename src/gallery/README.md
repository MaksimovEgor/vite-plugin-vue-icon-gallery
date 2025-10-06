# Gallery Development

This directory contains the **Vue Icon Gallery** UI as a standalone Vite app with full HMR support.

## Development Workflow

### 1. Start the plugin's gallery server (port 3002)

In a consuming project that uses this plugin, the gallery server will start automatically and serve the `/api/icons` and `/api/icon/:name` endpoints.

Alternatively, you can mock the API or run a test project.

### 2. Start the gallery dev server with HMR

```bash
npm run dev:gallery
```

This starts Vite on **port 5175** with:

- ✅ Hot Module Replacement (HMR)
- ✅ Vue SFC support
- ✅ TypeScript
- ✅ Proxy to `http://localhost:3002/api/*` for icon data

Open **http://localhost:5175** to develop the gallery UI with instant feedback.

### 3. Build for production

```bash
npm run build:gallery
```

Outputs optimized assets to `dist/gallery/`, which the plugin's `simpleGalleryServer.ts` serves in consuming projects.

## Files

- **`index.html`** – Entry point for the gallery app
- **`main.ts`** – Bootstraps the Vue app, fetches icons from `/api/icons`
- **`../IconGallery.vue`** – Main gallery component (shared)
- **`../styles.css`** – Global styles (shared)

## Notes

- The old `gallery-browser.js` (string-template approach) is **deprecated** and no longer used.
- All gallery development now happens in this folder with proper Vue tooling.
