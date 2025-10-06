import { createApp } from 'vue'
import IconGallery from '../IconGallery.vue'
import '../styles.css'

interface IconInfo {
  name: string
  path: string
}

async function bootstrap() {
  try {
    const res = await fetch('/api/icons')
    const icons: IconInfo[] = await res.json()
    const app = createApp(IconGallery, { icons })
    app.mount('#app')
  } catch (e) {
    console.error('Failed to load icons:', e)
    const el = document.getElementById('app')
    if (el) {
      el.innerHTML = `
        <div style="text-align:center;padding:2rem;color:#666">
          <h2>Failed to load icons</h2>
          <p>Failed to load icons</p>
        </div>
      `
    }
  }
}

bootstrap()
