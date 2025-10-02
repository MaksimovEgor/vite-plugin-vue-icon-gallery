import type { Plugin } from "vite";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

export interface IconGalleryOptions {
  /** Путь к папке с иконками (по умолчанию: 'src/components/app-svg') */
  iconsPath?: string;
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

  return {
    name: "vue-icon-gallery",
    configureServer(server) {
      // Создаем отдельный Vite сервер для галереи
      const createIconGalleryServer = async () => {
        const { createServer } = await import("vite");

        const iconGalleryServer = await createServer({
          configFile: false,
          root: __dirname,
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
          plugins: [(await import("@vitejs/plugin-vue")).default()],
        });

        await iconGalleryServer.listen();
        console.log(`🎨 Icon Gallery доступна на http://localhost:${port}`);
      };

      // Запускаем сервер галереи при старте основного сервера
      server.middlewares.use("/icon-gallery", (req, res, next) => {
        if (req.url === "/icon-gallery") {
          createIconGalleryServer();
          res.writeHead(302, { Location: `http://localhost:${port}` });
          res.end();
        } else {
          next();
        }
      });
    },
  };
}
