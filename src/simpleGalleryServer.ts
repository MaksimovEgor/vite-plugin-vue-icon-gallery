import { createServer as createHttpServer, Server } from 'http'
import { resolve, extname, dirname } from 'node:path'
import { readFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { scanIcons } from './iconScanner.js'

export interface GalleryServerOptions {
  iconsPath: string | string[]
  port: number
  open: boolean
}

let galleryServer: Server | null = null

// Получаем путь к модулю плагина
function getPluginPath(): string {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = dirname(__filename)
  // Возвращаем путь к dist папке плагина (где находится simpleGalleryServer.js)
  return __dirname
}

function getGalleryDir(): string {
  // В проде после сборки галерея лежит в dist/gallery
  return resolve(getPluginPath(), 'gallery')
}

function contentTypeByExt(path: string): string {
  const ext = extname(path)
  switch (ext) {
    case '.html':
      return 'text/html; charset=utf-8'
    case '.css':
      return 'text/css'
    case '.js':
      return 'application/javascript'
    case '.map':
      return 'application/json'
    case '.json':
      return 'application/json'
    case '.svg':
      return 'image/svg+xml'
    case '.png':
      return 'image/png'
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg'
    case '.ico':
      return 'image/x-icon'
    default:
      return 'application/octet-stream'
  }
}

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

    // API endpoints
    if (url === '/' || url === '') {
      const indexPath = resolve(getGalleryDir(), 'index.html')
      if (existsSync(indexPath)) {
        res.setHeader('Content-Type', contentTypeByExt(indexPath))
        res.end(readFileSync(indexPath, 'utf-8'))
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

    // Static assets from built gallery (dist/gallery)
    const safeUrl = url.split('?')[0].split('#')[0]
    const filePath = resolve(getGalleryDir(), '.' + safeUrl)
    if (existsSync(filePath)) {
      res.setHeader('Content-Type', contentTypeByExt(filePath))
      res.end(readFileSync(filePath))
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
