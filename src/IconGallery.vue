<template>
  <div class="icon-gallery">
    <div class="gallery-header">
      <h2>Vue Icon Gallery</h2>
      <div class="search-container">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search icons..."
          class="search-input"
        />
        <div class="filter-buttons">
          <div class="toggle-buttons">
            <button class="toggle-btn" :class="{ active: fillEnabled }" @click="toggleFill">
              Fill
            </button>
            <button class="toggle-btn" :class="{ active: strokeEnabled }" @click="toggleStroke">
              Stroke
            </button>

            <input v-model="currentColor" type="color" class="color-picker" @input="updateColors" />
          </div>
        </div>
      </div>
    </div>

    <div v-if="displayedPropIcons.length" class="icons-grid">
      <div
        v-for="icon in displayedPropIcons"
        :key="icon.name"
        class="icon-item"
        @click="copyIconName(icon.name)"
        :title="`Click to copy: ${icon.name}`"
      >
        <div class="icon-preview" :style="previewStyle">
          <div v-html="svgHtmlMap[icon.name]"></div>
        </div>
        <div class="icon-name">{{ icon.name }}</div>
        <div class="icon-copy-hint">Click to copy</div>
      </div>
    </div>
    <div v-else class="no-icons">Иконки не найдены.</div>

    <div v-if="copiedIcon" class="copy-notification">Copied: {{ copiedIcon }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

// Props provided by gallery server (fallback mode)
interface IconInfo {
  name: string
  path: string
}
const props = defineProps<{
  icons?: IconInfo[]
}>()

const searchQuery = ref('')
const copiedIcon = ref('')

const fillEnabled = ref(false)
const strokeEnabled = ref(true)
const currentColor = ref('#ffffee')

const propIcons = computed(() => props.icons ?? [])
const filteredPropIcons = computed(() => {
  const list = propIcons.value
  if (!searchQuery.value) return list
  return list.filter((icon) => icon.name.toLowerCase().includes(searchQuery.value.toLowerCase()))
})

// Cache for inlined SVG HTML per icon name
const svgHtmlMap = ref<Record<string, string>>({})

// Only render icons that have inlined SVG ready
const displayedPropIcons = computed(() =>
  filteredPropIcons.value.filter((i) => Boolean(svgHtmlMap.value[i.name]))
)

// Very basic sanitizer: remove <script> tags and inline on* handlers
const sanitizeSvg = (raw: string) =>
  raw
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/ on[a-z]+="[^"]*"/gi, '')
    .replace(/ on[a-z]+='[^']*'/gi, '')
const toggleStroke = () => {
  strokeEnabled.value = !strokeEnabled.value
}

const toggleFill = () => {
  fillEnabled.value = !fillEnabled.value
}

const updateColors = () => {
  // reactive via computed below
}

const previewStyle = computed(() => ({
  '--icon-fill': fillEnabled.value ? currentColor.value : 'none',
  '--icon-stroke': strokeEnabled.value ? currentColor.value : 'none'
}))

// Copy icon name to clipboard
const copyIconName = async (iconName: string) => {
  try {
    await navigator.clipboard.writeText(iconName)
    copiedIcon.value = iconName
    setTimeout(() => (copiedIcon.value = ''), 2000)
  } catch (err) {
    console.error('Failed to copy icon name:', err)
  }
}

const fetchSvgIfNeeded = async (name: string) => {
  if (svgHtmlMap.value[name]) return
  try {
    const res = await fetch(`/api/icon/${name}`)
    const text = await res.text()
    // Find the <svg ...> regardless of XML declaration/BOM
    const idx = text.toLowerCase().indexOf('<svg')
    if (idx !== -1) {
      const svgOnly = text.slice(idx)
      svgHtmlMap.value[name] = sanitizeSvg(svgOnly)
    }
  } catch (e) {
    // ignore fetch errors; <img> fallback remains
  }
}

// Fetch inline SVG for currently visible prop icons
watch(
  () => filteredPropIcons.value.map((i) => i.name),
  (names) => {
    names.forEach((n) => void fetchSvgIfNeeded(n))
  },
  { immediate: true }
)
</script>

<style>
.icon-gallery {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  background: var(--col-2);
  min-height: 100vh;
  border-radius: 0.75rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.gallery-header {
  margin-bottom: 2rem;
}

.gallery-header h2 {
  margin: 0 0 1rem 0;
  font-size: 2rem;
  font-weight: 600;
  color: var(--font-color);
}

.search-container {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.search-input {
  flex: 1;
  min-width: 200px;
  padding: 0.75rem 1rem;
  border: 1px solid var(--col-4);
  border-radius: 0.5rem;
  font-size: 1rem;
  background: var(--col-3);
  color: var(--font-color);
  font-family: 'NotoSans', sans-serif;
}

.search-input:focus {
  outline: none;
  border-color: var(--primary);
}

.search-input::placeholder {
  color: var(--col-7);
}

.filter-buttons {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.toggle-buttons {
  display: flex;
  gap: 0.25rem;
  background: var(--col-3);
  border-radius: 0.75rem;
  padding: 0.25rem;
  border: 1px solid var(--col-4);
}

.toggle-btn {
  padding: 0.75rem 1.25rem;
  border: none;
  border-radius: 0.5rem;
  background: transparent;
  color: var(--col-8);
  font-size: 0.875rem;
  font-weight: 500;
  font-family: 'NotoSans', sans-serif;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.toggle-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--primary);
  opacity: 0;
  transition: opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 0.5rem;
}

.toggle-btn:hover::before {
  opacity: 0.1;
}

.toggle-btn.active {
  background: var(--primary);
  color: var(--col-1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

.toggle-btn.active::before {
  opacity: 0;
}

.toggle-btn:active {
  transform: translateY(0);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.color-control {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: var(--col-3);
  border: 1px solid var(--col-4);
  border-radius: 0.75rem;
  padding: 0.5rem 0.75rem;
}

.color-picker {
  width: 2.5rem;
  height: 2.5rem;
  border: 2px solid var(--col-4);
  border-radius: 0.5rem;
  cursor: pointer;
  background: none;
  padding: 0;
  transition: all 0.2s ease;
}

.color-picker:hover {
  border-color: var(--primary);
  transform: scale(1.05);
}

.color-picker:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(166, 100%, 79%, 0.25);
}

.color-preview {
  width: 1.75rem;
  height: 1.75rem;
  border: 2px solid var(--col-4);
  border-radius: 0.375rem;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.color-preview:hover {
  border-color: var(--primary);
  transform: scale(1.1);
}

.icons-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  grid-auto-rows: max-content;
  gap: 1rem;
}

.icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  border: 1px solid var(--col-4);
  border-radius: 0.75rem;
  background: var(--col-3);
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.icon-item:hover {
  border-color: var(--primary);
  background: var(--col-4);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.icon-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
  color: var(--font-color);
}

/* Do not constrain intrinsic icon size */

/* Force color on all SVG descendants using CSS vars so icons without explicit
   attributes still receive color. Presentation attributes will be overridden. */
.icon-preview svg:not([fill]),
.icon-preview svg *:not([fill]) {
  fill: var(--icon-fill);
}
.icon-preview svg:not([stroke]),
.icon-preview svg *:not([stroke]) {
  stroke: var(--icon-stroke);
}

.icon-name {
  color: var(--font-color);
  text-align: center;
  word-break: break-word;
  font-family: 'NotoSans', sans-serif;
}

.icon-copy-hint {
  font-size: 0.75rem;
  color: var(--col-7);
  margin-top: 0.25rem;
  opacity: 0;
  transition: opacity 0.2s;
  font-family: 'NotoSans', sans-serif;
}

.icon-item:hover .icon-copy-hint {
  opacity: 1;
}

.copy-notification {
  position: fixed;
  top: 2rem;
  right: 2rem;
  background: var(--pos-3);
  color: var(--col-1);
  padding: 1rem 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  animation: slideIn 0.3s ease-out;
  font-family: 'NotoSans', sans-serif;
  font-weight: 500;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .icon-gallery {
    padding: 1rem;
  }

  .icons-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 0.75rem;
  }

  .icon-item {
    padding: 0.75rem;
  }

  .search-container {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-buttons {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }

  .toggle-buttons {
    justify-content: center;
  }

  .color-control {
    justify-content: center;
  }
}
</style>
