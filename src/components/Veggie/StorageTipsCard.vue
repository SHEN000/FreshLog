<template>
  <div class="storage-card" v-if="tipsList.length">
    <div class="header">
      <h2 class="title">保存與烹飪技巧</h2>
    </div>

    <div class="tips-grid">
      <div v-for="(tip, i) in tipsList" :key="i" class="tip-item">
        <div class="tip-title">{{ tip.title }}</div>
        <div class="tip-content">
          <span v-for="(line, j) in tip.desc.split('\n')" :key="j">
            {{ line }}<br v-if="j < tip.desc.split('\n').length - 1" />
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  /** 後端可能回：物件（tipOne..）、陣列、或字串化陣列 */
  storageTips: { type: [Object, Array, String], default: () => ({}) }
})

/** 與 RecipeSteps.vue 相同：用冒號切分 */
const splitText = (text = '') => {
  const parts = String(text).split(/[:：]/)
  const title = (parts[0] || '').trim()
  const desc = parts.slice(1).join('：').trim()
  return { title, desc }
}

/** 統一轉陣列 */
const toArray = (input) => {
  if (Array.isArray(input)) return input
  if (typeof input === 'string') {
    try {
      const j = JSON.parse(input)
      if (Array.isArray(j)) return j
    } catch (_) {}
    return input.split(/\r?\n/).filter(Boolean)
  }
  if (input && typeof input === 'object') {
    return Object.values(input).filter(Boolean)
  }
  return []
}

/** 過濾出有內容的項目 */
const tipsList = computed(() => {
  return toArray(props.storageTips)
    .map(s => splitText(s))
    .filter(t => t.title || t.desc)
})
</script>

<style scoped>
.storage-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
}

/* 標題 */
.header .title {
  font-size: 18px;
  font-weight: bold;
  color: #2e7d32;
  margin: 0 0 16px;
}

/* 桌機：兩欄 grid */
.tips-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

/* 單一提示項目 */
.tip-item {
  background: #e8f5e9;
  border-radius: 8px;
  padding: 16px;
  box-sizing: border-box;
}

/* icon 與標題排版 */
.tip-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.tip-icon {
  width: 20px;
  height: 20px;
  margin-right: 8px;
}

.tip-title {
  font-size: 16px;
  font-weight: 600;
  color: #2e7d32;
}

/* 內容 */
.tip-content {
  font-size: 14px;
  color: #555;
  line-height: 1.6;
}

/* 手機版：一欄 */
@media (max-width: 768px) {
  .tips-grid {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
}
</style>
