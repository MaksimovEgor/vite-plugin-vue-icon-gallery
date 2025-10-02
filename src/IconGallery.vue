<template>
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
          :title="`Кликните чтобы скопировать: ${icon.name}`"
        >
          <div class="icon-container">
            <img
              :src="`/api/icon/${icon.name}`"
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
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface IconInfo {
  name: string
  path: string
}

interface Props {
  icons: IconInfo[]
}

const props = defineProps<Props>()

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
  const style: Record<string, string> = {}

  if (showFill.value) {
    style.fill = fillColor.value
  }

  if (showStroke.value) {
    style.stroke = strokeColor.value
  }

  return style
})

// Методы
const copyIconName = async (iconName: string) => {
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

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.style.display = 'none'
  console.warn(`Не удалось загрузить иконку: ${img.alt}`)
}

const showNotification = (message: string) => {
  // Простое уведомление (можно улучшить)
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
    document.body.removeChild(notification)
  }, 3000)
}

// Инициализация
onMounted(() => {
  console.log(`🎨 Icon Gallery загружена с ${props.icons.length} иконками`)
})
</script>

<style scoped>
.icon-gallery {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #333;
}

.gallery-header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 2rem;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.gallery-header h1 {
  margin: 0 0 0.5rem 0;
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.gallery-subtitle {
  margin: 0 0 2rem 0;
  color: #666;
  font-size: 1.1rem;
}

.controls {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
  align-items: center;
}

.search-container {
  position: relative;
  display: flex;
  align-items: center;
}

.search-input {
  padding: 0.75rem 1rem 0.75rem 3rem;
  border: 2px solid #e1e5e9;
  border-radius: 25px;
  font-size: 1rem;
  width: 300px;
  transition: all 0.3s ease;
  outline: none;
}

.search-input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.search-icon {
  position: absolute;
  left: 1rem;
  color: #999;
  pointer-events: none;
}

.color-controls {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.control-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.control-group label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  cursor: pointer;
}

.control-checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.color-input {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.color-input:hover {
  transform: scale(1.1);
}

.color-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.gallery-main {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.no-results {
  text-align: center;
  padding: 4rem 2rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.no-results p {
  font-size: 1.2rem;
  color: #666;
  margin: 0 0 1.5rem 0;
}

.clear-button {
  background: #667eea;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s ease;
}

.clear-button:hover {
  background: #5a6fd8;
}

.icons-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
  padding: 1rem 0;
}

.icon-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 1.5rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.icon-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  background: rgba(255, 255, 255, 1);
}

.icon-container {
  width: 80px;
  height: 80px;
  margin: 0 auto 1rem auto;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  border-radius: 12px;
  transition: background 0.3s ease;
}

.icon-card:hover .icon-container {
  background: #e9ecef;
}

.icon-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.icon-card:hover .icon-image {
  transform: scale(1.1);
}

.icon-name {
  font-weight: 600;
  color: #333;
  font-size: 0.9rem;
  word-break: break-word;
  line-height: 1.3;
}

.gallery-footer {
  text-align: center;
  padding: 2rem;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
}

/* Адаптивность */
@media (max-width: 768px) {
  .gallery-header {
    padding: 1.5rem 1rem;
  }

  .gallery-header h1 {
    font-size: 2rem;
  }

  .controls {
    flex-direction: column;
    gap: 1rem;
  }

  .search-input {
    width: 100%;
    max-width: 300px;
  }

  .color-controls {
    flex-direction: column;
    gap: 1rem;
  }

  .gallery-main {
    padding: 1rem;
  }

  .icons-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1rem;
  }

  .icon-card {
    padding: 1rem;
  }

  .icon-container {
    width: 60px;
    height: 60px;
  }
}
</style>
