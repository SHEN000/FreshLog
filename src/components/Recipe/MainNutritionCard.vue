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
  'calcium': '鈣',
        'calories': '卡路里 / 熱量',
        'carbohydrate': '碳水化合物',
        'carbohydrates': '碳水化合物',
        'carbohydrate_total': '總碳水化合物',
        'cholesterol': '膽固醇',
        'copper': '銅',
        'dietary_fiber': '膳食纖維',
        'fat': '脂肪',
        'fiber': '纖維',
        'fiber_total': '總纖維',
        'fiber_total_dietary': '總膳食纖維',
        'folate': '葉酸',
        'iodine': '碘',
        'iron': '鐵',
        'lycopene': '茄紅素',
        'magnesium': '鎂',
        'manganese': '錳',
        'monounsaturated_fat': '單元不飽和脂肪',
        'niacin': '維生素B3',
        'omega-3': 'Omega-3 脂肪酸',
        'omega_3_fatty_acids': 'Omega-3 脂肪酸',
        'potassium': '鉀',
        'protein': '蛋白質',
        'riboflavin': '維生素B2',
        'saturated_fat': '飽和脂肪',
        'selenium': '硒',
        'sodium': '鈉',
        'sugar': '糖',
        'sugars': '糖類',
        'thiamine': '維生素B1',
        'total_carbohydrate': '總碳水化合物',
        'total_carbohydrates': '總碳水化合物',
        'total_fat': '總脂肪',
        'total_sugars': '總糖',
        'vitamin a': '維生素A',
        'vitamin b12': '維生素B12',
        'vitamin b6': '維生素B6',
        'vitamin c': '維生素C',
        'vitamin d': '維生素D',
        'vitamin k': '維生素K',
        'vitamin_a': '維生素A',
        'vitamin_b12': '維生素B12',
        'vitamin_b6': '維生素B6',
        'vitamin_c': '維生素C',
        'vitamin_e': '維生素E',
        'vitamin_k': '維生素K',
        'water': '水分',
        'zinc': '鋅',
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
