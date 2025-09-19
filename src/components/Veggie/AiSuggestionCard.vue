<template>
  <div class="ai-suggestion-card" v-if="displayList.length">
    <div class="suggestion-section">
      <h2 class="card-title">AI智慧推薦</h2>
    </div>

    <div
      v-for="(it, idx) in displayList"
      :key="idx"
      class="suggestion-section"
    >
      <div class="icon">
        <img :src="iconByIndex(idx)" :alt="it.title" />
      </div>
      <div class="info">
        <!-- 冒號前：標題 -->
        <h3>{{ it.title }}</h3>
        <!-- 冒號後：內容 -->
        <p>
          <span v-for="(line, i) in it.desc.split('\n')" :key="i">
            {{ line }}<br v-if="i < it.desc.split('\n').length - 1" />
          </span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import timingIcon from '@/assets/icons/timing.png'
import alternativeIcon from '@/assets/icons/alternative.png'
import locationIcon from '@/assets/icons/location.png'

const props = defineProps({
  // 可吃字串化陣列（你 API 的格式），或直接是陣列
  aiSuggestion: { type: [String, Array], default: () => '[]' }
})

/** 用冒號切分（支援全形/半形） */
const splitText = (text = '') => {
  const parts = String(text).split(/[:：]/)
  const title = (parts[0] || '').trim()
  const desc  = parts.slice(1).join('：').trim()
  return { title, desc }
}

/** 把「字串化陣列」→ 陣列 */
const rawList = computed(() => {
  if (Array.isArray(props.aiSuggestion)) return props.aiSuggestion
  if (typeof props.aiSuggestion === 'string') {
    try {
      const arr = JSON.parse(props.aiSuggestion)
      return Array.isArray(arr) ? arr : []
    } catch {
      return props.aiSuggestion.split(/\r?\n/).filter(Boolean)
    }
  }
  return []
})

/** 只取前三筆，且需有內容才顯示 */
const displayList = computed(() =>
  rawList.value
    .map(s => splitText(s))
    .filter(x => x.title || x.desc)
    .slice(0, 3)
)

/** icon 固定依序顯示 */
const icons = [timingIcon, alternativeIcon, locationIcon]
const iconByIndex = (i) => icons[i] || icons[icons.length - 1]
</script>

<style scoped>
/* 卡片最外層容器 */
.ai-suggestion-card {
  background-color: #f3f8fb;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.card-title {
  font-size: 18px;
  font-weight: bold;
  color: #2e7d32;
  margin-bottom: 8px;
}

.suggestion-section {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  border-bottom: 1px solid #d9d9d9;
  padding-bottom: 12px;
}

.suggestion-section:last-of-type {
  border-bottom: none;
}

.icon img {
  width: 32px;
  height: 32px;
}

.info h3 {
  font-size: 16px;
  font-weight: bold;
  margin: 0 0 4px 0;
}

.info p {
  font-size: 14px;
  color: #555;
  margin: 0;
}

/* 通知開關 */
.notice-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 16px;
  margin-top: 16px;
}

/* 增加滑鼠手勢提示 */
.notification-setting {
  cursor: pointer;
}

.switch {
  position: relative;
  display: inline-block;
  width: 42px;
  height: 24px;
}

.switch input {
  position: absolute;
  opacity: 0;
  width: 42px;
  height: 24px;
  pointer-events: none;
}

.slider {
  position: absolute;
  cursor: pointer;
  background-color: #ccc;
  border-radius: 24px;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  transition: 0.4s;
}

.slider::before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  border-radius: 50%;
  transition: 0.4s;
}

.switch input:checked+.slider {
  background-color: #2e7d32;
}

.switch input:checked+.slider::before {
  transform: translateX(18px);
}

/* 理想價格 編輯區 */
.price-edit-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 8px;
  flex-wrap: wrap;
}

.price-setting {
  font-size: 16px;
  color: #333;
}

.edit-button {
  padding: 6px 16px;
  background-color: #2e7d32;
  color: white;
  border: none;
  border-radius: 24px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color .3s;
}

.edit-button:hover {
  background-color: #27682b;
}
</style>
