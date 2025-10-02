import type { Plugin } from "vite";
import type { AddressInfo } from "net";
import { scanIcons } from "./iconScanner.js";
import {
  startGalleryServer,
  stopGalleryServer,
} from "./simpleGalleryServer.js";

export interface IconGalleryOptions {
  /** Путь к папке с иконками или массив путей (по умолчанию: 'src/components/app-svg') */
  iconsPath?: string | string[];
  /** Порт для галереи (по умолчанию: 3002) */
  port?: number;
  /** Автоматически открывать браузер (по умолчанию: true) */
  open?: boolean;
}

export function vueIconGallery(options: IconGalleryOptions = {}): Plugin {
  const {
    iconsPath = "src/components/app-svg",
    port = 3002,
    open = true,
  } = options;

  // Сканируем иконки при инициализации плагина
  const icons = scanIcons(iconsPath);
  const pathsArray = Array.isArray(iconsPath) ? iconsPath : [iconsPath];
  console.log(
    `🎨 Найдено ${icons.length} иконок в папках: ${pathsArray.join(", ")}`
  );

  let galleryServer: any = null;

  // Добавляем обработчик для корректного завершения
  const cleanup = () => {
    if (galleryServer) {
      console.log("🎨 Останавливаем галерею иконок...");
      stopGalleryServer();
      galleryServer = null;
    }
  };

  return {
    name: "vue-icon-gallery",

    configureServer(server) {
      console.log(`🎨 Configuring server, starting gallery on port ${port}...`);

      // Запускаем галерею асинхронно, но не блокируем основной процесс
      startGalleryServer({ iconsPath, port, open })
        .then((server) => {
          galleryServer = server;

          const addr = server.address() as AddressInfo;
          const galleryPort = addr?.port || port;
          console.log(
            `🎨 Icon Gallery запущена на отдельном сервере: http://localhost:${galleryPort}`
          );
        })
        .catch((error) => {
          console.warn("Не удалось запустить галерею иконок:", error);
        });

      // Добавляем обработчик для cleanup при остановке Vite сервера
      server.middlewares.use((req, res, next) => {
        next();
      });

      // Возвращаем cleanup функцию
      return () => {
        cleanup();
      };
    },
  };
}
