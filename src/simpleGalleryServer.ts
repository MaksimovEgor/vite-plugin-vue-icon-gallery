import { createServer as createHttpServer, Server } from 'http'
import { resolve, extname } from 'node:path'
import { readFileSync, existsSync } from 'node:fs'
import { scanIcons } from './iconScanner'

export interface GalleryServerOptions {
  iconsPath: string | string[]
  port: number
  open: boolean
}

let galleryServer: Server | null = null

/**
 * Находит свободный порт, начиная с указанного
 */
async function findAvailablePort(startPort: number): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = createHttpServer()
    server.listen(startPort, () => {
      const port = (server.address() as any)?.port
      server.close(() => resolve(port))
    })
    server.on('error', (err: any) => {
      if (err.code === 'EADDRINUSE') {
        findAvailablePort(startPort + 1)
          .then(resolve)
          .catch(reject)
      } else {
        reject(err)
      }
    })
  })
}

export async function startGalleryServer(options: GalleryServerOptions): Promise<Server> {
  const { iconsPath, port: requestedPort, open } = options

  if (galleryServer) {
    console.log(`🎨 Gallery server уже запущен`)
    return galleryServer
  }

  const availablePort = await findAvailablePort(requestedPort)
  const icons = scanIcons(iconsPath)

  galleryServer = createHttpServer((req, res) => {
    const url = req.url || ''

    if (url === '/' || url === '') {
      const htmlPath = resolve(process.cwd(), 'dist/index.html')
      if (existsSync(htmlPath)) {
        const html = readFileSync(htmlPath, 'utf-8')
        res.setHeader('Content-Type', 'text/html; charset=utf-8')
        res.end(html)
        return
      } else {
        res.statusCode = 404
        res.end('HTML file not found')
        return
      }
    }

    // Обслуживание статических файлов
    if (url.startsWith('/styles.css')) {
      const cssPath = resolve(process.cwd(), 'dist/styles.css')
      if (existsSync(cssPath)) {
        res.setHeader('Content-Type', 'text/css')
        res.end(readFileSync(cssPath, 'utf-8'))
        return
      }
    }

    if (url.startsWith('/main.js')) {
      const jsPath = resolve(process.cwd(), 'dist/main.js')
      if (existsSync(jsPath)) {
        res.setHeader('Content-Type', 'application/javascript')
        res.end(readFileSync(jsPath, 'utf-8'))
        return
      }
    }

    if (url === '/api/icons') {
      res.setHeader('Content-Type', 'application/json')
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.end(JSON.stringify(icons))
      return
    }

    if (url.startsWith('/api/icon/')) {
      const iconName = url.replace('/api/icon/', '')
      try {
        const icon = icons.find((i) => i.name === iconName)
        if (!icon) {
          res.statusCode = 404
          res.end('Icon not found')
          return
        }
        const content = readFileSync(icon.path, 'utf-8')
        const svgMatch = content.match(/<svg[^>]*>[\s\S]*?<\/svg>/)
        if (svgMatch) {
          res.setHeader('Content-Type', 'image/svg+xml')
          res.end(svgMatch[0])
        } else {
          res.statusCode = 404
          res.end('SVG not found')
        }
      } catch {
        res.statusCode = 404
        res.end('Icon not found')
      }
      return
    }

    res.statusCode = 404
    res.end('Not found')
  })

  await new Promise<void>((resolve, reject) => {
    galleryServer!.listen(availablePort, () => {
      console.log(`✅ Gallery server запущен на http://localhost:${availablePort}`)
      resolve()
    })
    galleryServer!.on('error', reject)
  })

  if (open) {
    // открыть в браузере (опционально)
    const { exec } = await import('child_process')
    const url = `http://localhost:${availablePort}`
    const cmd =
      process.platform === 'win32'
        ? `start ${url}`
        : process.platform === 'darwin'
        ? `open ${url}`
        : `xdg-open ${url}`
    exec(cmd)
  }

  return galleryServer!
}

export async function stopGalleryServer(): Promise<void> {
  if (galleryServer) {
    await new Promise<void>((resolve, reject) => {
      galleryServer!.close((err) => (err ? reject(err) : resolve()))
    })
    console.log('🛑 Gallery server остановлен')
    galleryServer = null
  }
}
