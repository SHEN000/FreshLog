<template>
  <div class="nutrition-card">
    <h3 class="card-title">
      <img src="@/assets/icons/nutrition.png" alt="營養資訊" class="icon" />
      營養資訊
    </h3>
    <div class="grid">
      <!-- 用 normalized 迭代，label 會是冒號前文字、value 是冒號後的值 -->
      <div v-for="(value, label) in normalized" :key="label" class="grid-item">
        <span class="value">{{ value }}</span>
        <span class="label">{{ label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // 後端可能給 Object 或 Array 都接受
  data: { type: [Object, Array], default: () => ({}) }
})

// 英文 → 中文 對照
const EN_TO_ZH = {
  'calories': '卡路里',
  'carbohydrate': '碳水化合物',
  'potassium': '鉀',
  'fiber': '膳食纖維',
  'dietary fiber': '膳食纖維',
  'vitamin c': '維生素C',
  'folate': '葉酸',
  'sugar': '糖',
  'sugars': '糖',
  'iron': '鐵',
  'calcium': '鈣',
  'protein': '蛋白質',
  'vitamin b12': '維生素B12',
  'fat': '脂肪',
  'cholesterol': '膽固醇',
  'omega-3': 'Omega-3 脂肪酸',
  'vitamin d': '維生素D',
  'vitamin a': '維生素A',
  'vitamin k': '維生素K',
  'zinc': '鋅',
  'vitamin b6': '維生素B6',
  'sodium': '鈉',
  'magnesium': '鎂'
}

// 轉中文標籤（含規則補捉）
function toZh(label) {
  const raw = String(label || '').trim()
  const key = raw.toLowerCase()

  // 直接對照
  if (EN_TO_ZH[key]) return EN_TO_ZH[key]

  // 一般「Vitamin X」自動轉：Vitamin e → 維生素E、vitamin b2 → 維生素B2
  const m = key.match(/^vitamin\s+([a-z]\d*)$/i)
  if (m) return `維生素${m[1].toUpperCase()}`

  // Omega 變體
  if (/^omega[-\s]?3$/i.test(key)) return EN_TO_ZH['omega-3']

  // 沒對到就回原文
  return raw
}

// 把 ["Fiber : 3 g", "Carbohydrate : 23 g", ...]
// 或 { Fiber: "3 g", ... } 轉成 { "膳食纖維": "3 g", "碳水化合物": "23 g", ... }
const normalized = computed(() => {
  if (Array.isArray(props.data)) {
    const out = {}
    props.data.forEach(s => {
      if (typeof s !== 'string') return
      // 支援中/英冒號與空白
      const m = s.match(/^\s*([^:：]+)\s*[:：]\s*(.+)\s*$/)
      if (!m) return
      const labelZh = toZh(m[1])
      const value = m[2].trim()
      out[labelZh] = value
    })
    return out
  }

  // 已是物件：把 key 轉中文
  const out = {}
  Object.entries(props.data || {}).forEach(([k, v]) => {
    out[toZh(k)] = v
  })
  return out
})
</script>



<style scoped>
/* 卡片整體樣式 */
.nutrition-card {
  background-color: #45a049;
  border-radius: 16px;
  padding: 30px 40px;
  color: #fff;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
}

/* 標題列：圖示 + 文字 */
.card-title {
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: 500;
  margin: 0 0 16px;
  color: #333;
}

/* 標題圖示 */
.icon {
  width: 20px;
  height: 32px;
  margin-right: 8px;
}

/* 格線容器 */
.grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: space-between;
}

/* 單一格子 */
.grid-item {
  flex: 0 0 45%;
  text-align: center;
}

/* 格子中的數值 */
.value {
  display: block;
  font-size: 20px;
  font-weight: bold;
  line-height: 1;
}

/* 格子中的標籤 */
.label {
  display: block;
  font-size: 14px;
  margin-top: 4px;
}
</style>
