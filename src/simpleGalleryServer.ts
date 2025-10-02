import { createServer as createHttpServer, Server } from "http";
import { resolve } from "node:path";
import { readFileSync } from "node:fs";
import { scanIcons } from "./iconScanner";

export interface GalleryServerOptions {
  iconsPath: string;
  port: number;
  open: boolean;
}

let galleryServer: Server | null = null;

/**
 * Находит свободный порт, начиная с указанного
 */
async function findAvailablePort(startPort: number): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = createHttpServer();
    server.listen(startPort, () => {
      const port = (server.address() as any)?.port;
      server.close(() => resolve(port));
    });
    server.on("error", (err: any) => {
      if (err.code === "EADDRINUSE") {
        findAvailablePort(startPort + 1)
          .then(resolve)
          .catch(reject);
      } else {
        reject(err);
      }
    });
  });
}

function generateGalleryHTML(icons: { name: string }[]): string {
  return `<!DOCTYPE html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <link
      rel="icon"
      href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🎨</text></svg>"
    />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vue Icon Gallery</title>
    <style>
      body {
        margin: 0;
        padding: 2rem;
        background: #1a1a1a;
        color: white;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      }
      .gallery {
        max-width: 1200px;
        margin: 0 auto;
      }
      .header {
        margin-bottom: 2rem;
      }
      .header h1 {
        margin: 0 0 1rem 0;
        font-size: 2rem;
        font-weight: 600;
      }
      .search {
        width: 100%;
        padding: 0.75rem 1rem;
        border: 1px solid #444;
        border-radius: 0.5rem;
        font-size: 1rem;
        background: #333;
        color: white;
        margin-bottom: 1rem;
      }
      .search:focus {
        outline: none;
        border-color: #00d4aa;
      }
      .icons-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
        gap: 1rem;
      }
      .icon-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 1rem;
        border: 1px solid #444;
        border-radius: 0.75rem;
        background: #333;
        cursor: pointer;
        transition: all 0.2s;
      }
      .icon-item:hover {
        border-color: #00d4aa;
        background: #444;
        transform: translateY(-2px);
      }
      .icon-preview {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 0.5rem;
        min-height: 2rem;
        width: 100%;
        height: 4rem;
        background: #222;
        border-radius: 0.5rem;
        font-size: 2rem;
      }
      .icon-svg {
        max-width: 100%;
        max-height: 100%;
        width: auto;
        height: auto;
      }
      .icon-svg svg {
        max-width: 100%;
        max-height: 100%;
        width: auto;
        height: auto;
      }
      .placeholder-icon {
        font-size: 2rem;
        opacity: 0.5;
      }
      .icon-name {
        font-size: 0.875rem;
        font-weight: 500;
        text-align: center;
        word-break: break-word;
      }
      .copy-hint {
        font-size: 0.75rem;
        color: #888;
        margin-top: 0.25rem;
        opacity: 0;
        transition: opacity 0.2s;
      }
      .icon-item:hover .copy-hint {
        opacity: 1;
      }
      .notification {
        position: fixed;
        top: 2rem;
        right: 2rem;
        background: #00d4aa;
        color: #000;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
      }
    </style>
  </head>
  <body>
    <div class="gallery">
      <div class="header">
        <h1>Icon Gallery</h1>
        <input
          type="text"
          placeholder="Search icons..."
          class="search"
          id="searchInput"
        />
      </div>
      <div class="icons-grid" id="iconsGrid">
        ${icons
          .map(
            (icon) => `
          <div class="icon-item" data-icon="${icon.name}">
            <div class="icon-preview">
              <div class="icon-svg placeholder-icon">📦</div>
            </div>
            <div class="icon-name">${icon.name}</div>
            <div class="copy-hint">Click to copy</div>
          </div>
        `
          )
          .join("")}
      </div>
    </div>

    <script>
      const icons = ${JSON.stringify(
        icons.map((icon) => ({ name: icon.name }))
      )};
      const searchInput = document.getElementById('searchInput');
      const iconsGrid = document.getElementById('iconsGrid');
      const loadedSvgs = {};

      // Поиск
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const items = iconsGrid.querySelectorAll('.icon-item');
        items.forEach(item => {
          const name = item.dataset.icon.toLowerCase();
          if (name.includes(query)) {
            item.style.display = 'flex';
          } else {
            item.style.display = 'none';
          }
        });
      });

      // Загрузка SVG
      async function loadIcon(iconName) {
        if (loadedSvgs[iconName]) {
          return loadedSvgs[iconName];
        }
        try {
          const response = await fetch('/api/icon/' + iconName);
          if (response.ok) {
            const svgContent = await response.text();
            loadedSvgs[iconName] = svgContent;
            return svgContent;
          }
        } catch (error) {
          console.error('Failed to load icon:', iconName, error);
        }
        return '<div class="placeholder-icon">❌</div>';
      }

      // Копирование
      async function copyIconName(iconName) {
        try {
          await navigator.clipboard.writeText(iconName);
          showNotification('Copied: ' + iconName);
        } catch (err) {
          console.error('Failed to copy icon name:', err);
        }
      }

      function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => {
          notification.remove();
        }, 2000);
      }

      // Загружаем все иконки
      async function loadAllIcons() {
        const items = iconsGrid.querySelectorAll('.icon-item');
        for (const item of items) {
          const iconName = item.dataset.icon;
          const svgContainer = item.querySelector('.icon-svg');
          const svgContent = await loadIcon(iconName);
          svgContainer.innerHTML = svgContent;
        }
      }

      // Обработчики кликов
      iconsGrid.addEventListener('click', (e) => {
        const iconItem = e.target.closest('.icon-item');
        if (iconItem) {
          copyIconName(iconItem.dataset.icon);
        }
      });

      // Загружаем иконки при загрузке страницы
      loadAllIcons();
    </script>
  </body>
</html>`;
}

export async function startGalleryServer(
  options: GalleryServerOptions
): Promise<Server> {
  const { iconsPath, port: requestedPort, open } = options;

  if (galleryServer) {
    console.log(`🎨 Gallery server уже запущен`);
    return galleryServer;
  }

  const availablePort = await findAvailablePort(requestedPort);
  const icons = scanIcons(iconsPath);

  galleryServer = createHttpServer((req, res) => {
    const url = req.url || "";

    if (url === "/" || url === "") {
      const html = generateGalleryHTML(icons);
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.end(html);
      return;
    }

    if (url === "/api/icons") {
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(icons.map((i) => i.name)));
      return;
    }

    if (url.startsWith("/api/icon/")) {
      const iconName = url.replace("/api/icon/", "");
      try {
        const iconPath = resolve(process.cwd(), iconsPath, `${iconName}.vue`);
        const content = readFileSync(iconPath, "utf-8");
        const svgMatch = content.match(/<svg[^>]*>[\s\S]*?<\/svg>/);
        if (svgMatch) {
          res.setHeader("Content-Type", "image/svg+xml");
          res.end(svgMatch[0]);
        } else {
          res.statusCode = 404;
          res.end("SVG not found");
        }
      } catch {
        res.statusCode = 404;
        res.end("Icon not found");
      }
      return;
    }

    res.statusCode = 404;
    res.end("Not found");
  });

  await new Promise<void>((resolve, reject) => {
    galleryServer!.listen(availablePort, () => {
      console.log(
        `✅ Gallery server запущен на http://localhost:${availablePort}`
      );
      resolve();
    });
    galleryServer!.on("error", reject);
  });

  if (open) {
    // открыть в браузере (опционально)
    const { exec } = await import("child_process");
    const url = `http://localhost:${availablePort}`;
    const cmd =
      process.platform === "win32"
        ? `start ${url}`
        : process.platform === "darwin"
        ? `open ${url}`
        : `xdg-open ${url}`;
    exec(cmd);
  }

  return galleryServer!;
}

export async function stopGalleryServer(): Promise<void> {
  if (galleryServer) {
    await new Promise<void>((resolve, reject) => {
      galleryServer!.close((err) => (err ? reject(err) : resolve()));
    });
    console.log("🛑 Gallery server остановлен");
    galleryServer = null;
  }
}
