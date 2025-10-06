// Галерея иконок для браузера (использует глобальный Vue из CDN)
const { createApp, ref, computed, onMounted } = Vue

// Компонент галереи иконок
const IconGallery = {
  props: {
    icons: {
      type: Array,
      required: true
    }
  },
  setup(props) {
    // Реактивные данные
    const searchQuery = ref('')
    const showFill = ref(true)
    const showStroke = ref(false)
    const fillColor = ref('#fff')
    const strokeColor = ref('#fff')

    // Вычисляемые свойства
    const filteredIcons = computed(() => {
      if (!searchQuery.value) {
        return props.icons
      }
      return props.icons.filter((icon) =>
        icon.name.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    })

    const iconStyle = computed(() => {
      const style = {}
      if (showFill.value) {
        style.fill = fillColor.value
      }
      if (showStroke.value) {
        style.stroke = strokeColor.value
      }
      return style
    })

    // Методы
    const copyIconName = async (iconName) => {
      try {
        await navigator.clipboard.writeText(iconName)
        showNotification(`Скопировано: ${iconName}`)
      } catch (err) {
        console.error('Ошибка копирования:', err)
        // Fallback для старых браузеров
        const textArea = document.createElement('textarea')
        textArea.value = iconName
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        showNotification(`Скопировано: ${iconName}`)
      }
    }

    const clearSearch = () => {
      searchQuery.value = ''
    }

    const handleImageError = (event) => {
      const img = event.target
      img.style.display = 'none'
      console.warn(`Не удалось загрузить иконку: ${img.alt}`)
    }

    const showNotification = (message) => {
      const notification = document.createElement('div')
      notification.textContent = message
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 12px 20px;
        border-radius: 4px;
        z-index: 1000;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      `
      document.body.appendChild(notification)

      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification)
        }
      }, 3000)
    }

    // Инициализация
    onMounted(() => {
      console.log(`🎨 Icon Gallery загружена с ${props.icons.length} иконками`)
    })

    return {
      searchQuery,
      showFill,
      showStroke,
      fillColor,
      strokeColor,
      filteredIcons,
      iconStyle,
      copyIconName,
      clearSearch,
      handleImageError
    }
  },
  template: `
    <div class="icon-gallery">
      <header class="gallery-header">
        <h1>🎨 Vue Icon Gallery</h1>
        <p class="gallery-subtitle">
          Найдено {{ filteredIcons.length }} из {{ icons.length }} иконок
        </p>

        <div class="controls">
          <div class="search-container">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Поиск иконок..."
              class="search-input"
            />
            <span class="search-icon">🔍</span>
          </div>

          <div class="color-controls">
            <div class="control-group">
              <label>
                <input v-model="showFill" type="checkbox" class="control-checkbox" />
                Fill
              </label>
              <input v-model="fillColor" type="color" class="color-input" :disabled="!showFill" />
            </div>

            <div class="control-group">
              <label>
                <input v-model="showStroke" type="checkbox" class="control-checkbox" />
                Stroke
              </label>
              <input v-model="strokeColor" type="color" class="color-input" :disabled="!showStroke" />
            </div>
          </div>
        </div>
      </header>

      <main class="gallery-main">
        <div v-if="filteredIcons.length === 0" class="no-results">
          <p>Иконки не найдены</p>
          <button @click="clearSearch" class="clear-button">Очистить поиск</button>
        </div>

        <div v-else class="icons-grid">
          <div
            v-for="icon in filteredIcons"
            :key="icon.name"
            class="icon-card"
            @click="copyIconName(icon.name)"
            :title="'Кликните чтобы скопировать: ' + icon.name"
          >
            <div class="icon-container">
              <img
                :src="'/api/icon/' + icon.name"
                :alt="icon.name"
                class="icon-image"
                :style="iconStyle"
                @error="handleImageError"
              />
            </div>
            <div class="icon-name">{{ icon.name }}</div>
          </div>
        </div>
      </main>

      <footer class="gallery-footer">
        <p>Кликните на иконку, чтобы скопировать её название</p>
      </footer>
    </div>
  `
}

// Функция для инициализации приложения
function createIconGalleryApp(icons) {
  const app = createApp(IconGallery, { icons })
  return app
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Загружаем иконки с сервера
    const response = await fetch('/api/icons')
    const icons = await response.json()

    // Создаем и монтируем приложение
    const app = createIconGalleryApp(icons)
    app.mount('#app')
  } catch (error) {
    console.error('Ошибка загрузки галереи:', error)
    document.getElementById('app').innerHTML = `
      <div style="text-align: center; padding: 2rem; color: #666;">
        <h2>Ошибка загрузки галереи</h2>
        <p>Не удалось загрузить иконки с сервера</p>
      </div>
    `
  }
})
