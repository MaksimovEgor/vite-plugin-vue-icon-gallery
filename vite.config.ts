import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "VueIconGallery",
      fileName: "index",
    },
    rollupOptions: {
      external: ["vue", "vite"],
      output: {
        globals: {
          vue: "Vue",
          vite: "Vite",
        },
      },
    },
  },
});
