#!/usr/bin/env node
import { createServer } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = resolve(fileURLToPath(import.meta.url), "..");

// Парсим аргументы командной строки
const args = process.argv.slice(2);
const port = args.includes("--port")
  ? parseInt(args[args.indexOf("--port") + 1])
  : 3002;
const iconsPath = args.includes("--path")
  ? args[args.indexOf("--path") + 1]
  : "src/components/app-svg";
const open = !args.includes("--no-open");

console.log("🎨 Запуск Vue Icon Gallery...");
console.log(`📁 Путь к иконкам: ${iconsPath}`);
console.log(`🌐 Порт: ${port}`);

const server = await createServer({
  configFile: false,
  root: process.cwd(),
  server: {
    port,
    open,
    host: "0.0.0.0",
  },
  resolve: {
    alias: {
      "@": resolve(process.cwd(), "src"),
    },
  },
  plugins: [vue()],
});

await server.listen();
console.log(`✅ Icon Gallery запущена на http://localhost:${port}`);
