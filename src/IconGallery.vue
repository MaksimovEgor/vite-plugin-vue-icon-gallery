<template>
  <div class="icon-gallery">
    <div class="gallery-header">
      <h2>Icon Gallery</h2>
      <div class="search-container">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search icons..."
          class="search-input"
        />
        <div class="filter-buttons">
          <div class="toggle-buttons">
            <button
              class="toggle-btn"
              :class="{ active: fillEnabled }"
              @click="toggleFill"
            >
              Fill
            </button>
            <button
              class="toggle-btn"
              :class="{ active: strokeEnabled }"
              @click="toggleStroke"
            >
              Stroke
            </button>

            <input
              v-model="currentColor"
              type="color"
              class="color-picker"
              @input="updateColors"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="icons-grid">
      <div
        v-for="icon in filteredIcons"
        :key="icon.name"
        class="icon-item"
        @click="copyIconName(icon.name)"
      >
        <div class="icon-preview">
          <component :is="icon.component" :style="iconStyles" />
        </div>
        <div class="icon-name">{{ icon.name }}</div>
        <div class="icon-copy-hint">Click to copy</div>
      </div>
    </div>

    <div v-if="copiedIcon" class="copy-notification">
      Copied: {{ copiedIcon }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

// Automatically import all SVG components from the app-svg directory
const svgModules = import.meta.glob("@/components/app-svg/*.vue", {
  eager: true,
});

const searchQuery = ref("");
const copiedIcon = ref("");

const fillEnabled = ref(true);
const strokeEnabled = ref(true);
const currentColor = ref("#ffffff");

// Automatically generate icons array from imported modules
const icons = Object.entries(svgModules)
  .map(([path, module]) => {
    // Extract component name from file path
    const fileName = path.split("/").pop()?.replace(".vue", "") || "";
    return {
      name: fileName,
      component: (module as any).default,
    };
  })
  .filter((icon) => icon.name !== "IconGallery"); // Exclude the gallery component itself

const filteredIcons = computed(() => {
  if (!searchQuery.value) {
    return icons;
  }

  return icons.filter((icon) =>
    icon.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const toggleFill = () => {
  fillEnabled.value = !fillEnabled.value;
};

const toggleStroke = () => {
  strokeEnabled.value = !strokeEnabled.value;
};

const updateColors = () => {
  // This will trigger the computed property to update
};

const iconStyles = computed(() => {
  const styles: any = {};

  if (fillEnabled.value) {
    styles.fill = currentColor.value;
  } else {
    styles.fill = "none";
  }

  if (strokeEnabled.value) {
    styles.stroke = currentColor.value;
  } else {
    styles.stroke = "none";
  }

  return styles;
});

const copyIconName = async (iconName: string) => {
  try {
    await navigator.clipboard.writeText(iconName);
    copiedIcon.value = iconName;
    setTimeout(() => {
      copiedIcon.value = "";
    }, 2000);
  } catch (err) {
    console.error("Failed to copy icon name:", err);
  }
};
</script>

<style>
/* CSS Variables from main project */
:root {
  --theme: rgb(24, 54, 70);
  --primary: hsl(170, 88%, 39%);
  --input-normal: hsl(224, 9%, 23%);
  --secondary: rgb(50, 134, 158);
  --white: #ffffff;

  --col-1: hsl(220, 14%, 8%);
  --col-2: hsl(220, 12%, 12%);
  --col-3: hsl(223, 10%, 17%);
  --col-4: hsl(222, 10%, 22%);
  --col-5: hsl(220, 9%, 29%);
  --col-6: hsl(222, 8%, 37%);
  --col-7: hsl(222, 7%, 47%);
  --col-8: hsl(222, 10%, 56%);
  --col-9: hsl(222, 18%, 74%);
  --col-10: hsl(222, 22%, 87%);

  --mint-1: hsl(166, 100%, 87%);
  --mint-2: hsl(166, 100%, 79%);
  --mint-3: hsl(170, 65%, 55%);
  --mint-4: hsl(174, 50%, 34%);
  --mint-5: hsl(180, 38%, 22%);

  --pos-1: hsl(144, 84%, 71%);
  --pos-2: hsl(144, 78%, 60%);
  --pos-3: hsl(144, 79%, 45%);
  --pos-4: hsl(144, 70%, 32%);
  --pos-5: hsl(144, 55%, 24%);

  --main-color: rgb(24, 26, 27);
  --header-color: rgb(40, 43, 56);
  --alt-color: rgb(28, 30, 31);
  --font-color: var(--white);
  --dropdown-color: rgb(66, 67, 79);
  --disabled-text: hsla(0, 0%, 100%, 0.3);
}

/* Reset and base styles */
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: "NotoSans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    sans-serif;
  background: var(--col-1);
  color: var(--font-color);
}

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
  font-family: "NotoSans", sans-serif;
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
  font-family: "NotoSans", sans-serif;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.toggle-btn::before {
  content: "";
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
  min-height: 2rem;
}

.icon-preview :deep(svg) {
  max-width: 100%;
  max-height: 4rem;
  width: auto;
  height: auto;
  fill: inherit;
  stroke: inherit;
}

.icon-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--font-color);
  text-align: center;
  word-break: break-word;
  font-family: "NotoSans", sans-serif;
}

.icon-copy-hint {
  font-size: 0.75rem;
  color: var(--col-7);
  margin-top: 0.25rem;
  opacity: 0;
  transition: opacity 0.2s;
  font-family: "NotoSans", sans-serif;
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
  font-family: "NotoSans", sans-serif;
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
