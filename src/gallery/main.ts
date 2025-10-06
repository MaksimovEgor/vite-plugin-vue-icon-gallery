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
    console.error('Ошибка загрузки галереи:', e)
    const el = document.getElementById('app')
    if (el) {
      el.innerHTML = `
        <div style="text-align:center;padding:2rem;color:#666">
          <h2>Ошибка загрузки галереи</h2>
          <p>Не удалось загрузить иконки с сервера</p>
        </div>
      `
    }
  }
}

bootstrap()
