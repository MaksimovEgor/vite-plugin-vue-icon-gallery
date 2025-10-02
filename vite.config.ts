import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "VueIconGallery",
      fileName: "index",
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: [
        "vue",
        "vite",
        "node:fs",
        "node:path",
        "node:module",
        "node:crypto",
        "tty",
        "util",
      ],
      output: {
        globals: {
          vue: "Vue",
          vite: "Vite",
        },
      },
    },
  },
  define: {
    __dirname: JSON.stringify(__dirname),
  },
});
