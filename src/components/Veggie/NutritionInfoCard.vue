<template>
  <div class="nutrition-card">
    <div class="section-title">營養與健康資訊</div>

    <div class="sub-section">
      <div class="sub-title">主要營養成分</div>
      <div class="nutrition-bars">
        <div class="nutrition-bar" v-for="(macro, idx) in orderedMacros" :key="macro.nutrient">
          <div class="bar-content" :class="colorByIndex(idx)" :style="{ width: getBarWidth(macro) + '%' }">
            {{ zhName(macro.nutrient) }} {{ macro.amount }}{{ fmtUnit(macro.unit) }}
          </div>
        </div>
      </div>
    </div>
    <!-- 健康益處：只有有內容才顯示整段（含標題） -->
    <div class="sub-section" v-if="hasBenefits">
      <div class="sub-title">健康益處</div>
      <ul class="benefits-list" v-if="parsedBenefits.length">
        <li v-for="(benefit, index) in parsedBenefits" :key="index">{{ benefit }}</li>
      </ul>
    </div>

    <!-- 適合人群：只有有內容才顯示整段（含標題） -->
    <div class="sub-section" v-if="hasAudience">
      <div class="sub-title">適合人群</div>
      <p class="audience">{{ nutrition.eatingSuggestions }}</p>
    </div>
  </div>
</template>

<script>
import { NUTRIENT_STATS } from '@/data/nutrientStats.js'

export default {
  name: 'NutritionInfoCard',
  props: { nutrition: { type: Object, required: true } },

  computed: {
    // 為了顏色穩定，固定顯示順序
    orderedMacros() {
      const ORDER = ['carbohydrate', 'protein', 'fat', 'vitamin a', 'potassium', 'fiber']
      const norm = (s = '') => String(s).trim().toLowerCase()
      const idx = (n) => ORDER.indexOf(norm(n))
      return [...(this.nutrition.macros || [])].sort((a, b) => {
        const ia = idx(a.nutrient), ib = idx(b.nutrient)
        return (ia < 0 ? 999 : ia) - (ib < 0 ? 999 : ib)
      })
    },
    parsedBenefits() {
      const src = this.nutrition?.benefits
      if (Array.isArray(src)) return src.filter(Boolean)

      if (typeof src === 'string') {
        const s = src.trim()
        if (!s) return []
        // 先嘗試 JSON.parse("[\"...\",\"...\"]")
        try {
          const arr = JSON.parse(s)
          if (Array.isArray(arr)) return arr.filter(Boolean)
        } catch (_) {
          // 不是合法 JSON：試著去掉方括號/引號，依常見分隔符切開
          return s
            .replace(/^\s*\[|\]\s*$/g, '')    // 去掉最外層 []
            .replace(/^"|"$|^'|'$/g, '')      // 去掉整體首尾引號
            .split(/","|','|,|；|;|\n/g)      // 以 "," 或 , / ; / 換行 分隔
            .map(t => t.replace(/^"|"$|^'|'$/g, '').trim())
            .filter(Boolean)
        }
      }
      return []
    },

        /* 只有有內容才顯示標題與區塊 */
    hasBenefits() {
      return this.parsedBenefits.length > 0
    },
    hasAudience() {
      const txt = this.nutrition?.eatingSuggestions
      return typeof txt === 'string' ? txt.trim().length > 0 : Boolean(txt)
    },
  },

  methods: {
    // 顏色「只看索引」
    colorByIndex(idx) {
      const palette = ['bar--orange', 'bar--green', 'bar--red', 'bar--blue', 'bar--purple', 'bar--teal']
      return palette[idx]
    },

    // 百分比邏輯
    normalize(name = '') {
      const s = String(name).trim().toLowerCase()
      const alias = {
        carbs: 'carbohydrate', '碳水': 'carbohydrate', '碳水化合物': 'carbohydrate',
        'vit a': 'vitamin a', 'vita': 'vitamin a', '維生素a': 'vitamin a',
        'dietary fiber': 'fiber', '膳食纖維': 'fiber', '纖維': 'fiber',
        'k': 'potassium', '鉀': 'potassium', '蛋白質': 'protein', '脂肪': 'fat',
        'total carbohydrate': 'total_carbohydrate',
        'total carbohydrates': 'total_carbohydrates',
        'total sugars': 'total_sugars',
        'omega 3': 'omega-3',
      }
      return alias[s] || s
    },

    // 從統計表取出對應的比例尺
    getScaleSpec(name) {
      const key = this.normalize(name)
      const stat = NUTRIENT_STATS[key]
      if (!stat) return null

      // 以 p95 作為 100%，沒有就退回 max，再退回 mean
      const full = Number(stat.p95 ?? stat.max ?? stat.mean ?? 0)
      if (!full) return null

      return { max: full, unit: null } // unit=null 表示與輸入相同
    },

    // 依統計表的 max（p95）計算百分比
    getBarWidth(macro) {
      const rawVal = Number(macro.amount ?? macro.value ?? 0)
      const spec = this.getScaleSpec(macro.nutrient)
      if (!spec) return 50

      // 若之後提供 UNIT_HINTS，可在這裡做轉換：
      // const val = spec.unit ? this.convertUnit(rawVal, macro.unit, spec.unit) : rawVal
      const val = rawVal

      const pct = (val / spec.max) * 100
      return Math.max(0, Math.min(pct, 100))
    },

    convertUnit(value, from, to) {
      const norm = (u) => (u || '').replace('μ', 'µ').toLowerCase()
      const f = norm(from), t = norm(to)
      if (!value || !t) return Number(value) || 0
      if (f === t) return Number(value)

      let inUg
      if (f === 'g') inUg = value * 1_000_000
      else if (f === 'mg') inUg = value * 1_000
      else if (f === 'µg') inUg = value
      else inUg = Number(value) || 0

      if (t === 'g') return inUg / 1_000_000
      if (t === 'mg') return inUg / 1_000
      return inUg // µg
    },

    // 把英文營養素名稱轉中文；未知的就原樣回傳
    zhName(name = '') {
      const s = String(name).trim().toLowerCase()

      // 直接對照的常見項目
      const map = {
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
      if (map[s]) return map[s]

      if (/^vitamin\s+/i.test(name)) {
        const rest = String(name).replace(/^vitamin\s+/i, '').toUpperCase()
        return `維生素${rest}`
      }

      return name // 找不到對照就原樣顯示
    },

    // 把 ug/μg 統一顯示為 µg（選配）
    fmtUnit(u) {
      if (!u) return ''
      return String(u).replace(/μ|ug/i, 'µg')
    }
  }
}
</script>


<style scoped>
.nutrition-card {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.section-title {
  color: #2e7d32;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 16px;
}

/* 每個小區塊間隔 */
.sub-section {
  margin-bottom: 20px;
}

.sub-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
}

/* 營養條列容器，縱向排列 */
.nutrition-bars {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* 進度條背景槽 */
.nutrition-bar {
  background: #e0e0e0;
  border-radius: 100px;
  /* 圓角長條 */
  height: 26px;
  overflow: hidden;
  width: 100%;
}

/* 進度條內容 */
.bar-content {
  height: 100%;
  color: white;
  padding: 0 12px;
  display: flex;
  align-items: center;
  border-radius: 100px;
  transition: width 0.5s ease;
  white-space: nowrap;
  font-weight: 500;
  font-size: 12px;
}

/* 固定配色 */
.bar--orange {
  background: #ff9800;
}

.bar--green {
  background: #4caf50;
}

.bar--red {
  background: #f44336;
}

.bar--blue {
  background: #2196f3;
}

.bar--purple {
  background: #9c27b0;
}

.bar--teal {
  background: #009688;
}

/* 健康益處列表樣式 */
.benefits-list {
  list-style-type: disc;
  padding-left: 20px;
  line-height: 1.6;
  margin: 0;
  font-size: 14px;
}

.benefits-list li {
  margin-bottom: 8px;
}

/* 適合人群段落文字 */
.audience {
  line-height: 1.6;
  margin: 0;
  font-size: 14px;
}

/* 手機版 */
@media (max-width: 768px) {
  .nutrition-card {
    padding: 16px;
  }

  .section-title {
    font-size: 18px;
  }
}
</style>
