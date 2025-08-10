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

    <div class="sub-section">
      <div class="sub-title">健康益處</div>
      <ul class="benefits-list">
        <li v-for="(benefit, index) in nutrition.benefits" :key="index">{{ benefit }}</li>
      </ul>
    </div>

    <div class="sub-section">
      <div class="sub-title">適合人群</div>
      <p class="audience">{{ nutrition.eatingSuggestions }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NutritionInfoCard',
  props: { nutrition: { type: Object, required: true } },

  computed: {
    // （可留可拿掉）為了顏色穩定，固定顯示順序；若想照 API 原順序，就改回 this.nutrition.macros
    orderedMacros() {
      const ORDER = ['carbohydrate', 'protein', 'fat', 'vitamin a', 'potassium', 'fiber']
      const norm = (s = '') => String(s).trim().toLowerCase()
      const idx = (n) => ORDER.indexOf(norm(n))
      return [...(this.nutrition.macros || [])].sort((a, b) => {
        const ia = idx(a.nutrient), ib = idx(b.nutrient)
        return (ia < 0 ? 999 : ia) - (ib < 0 ? 999 : ib)
      })
    }
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
        'k': 'potassium', '鉀': 'potassium', '蛋白質': 'protein', '脂肪': 'fat'
      }
      return alias[s] || s
    },

    getScaleSpec(name) {
      const key = this.normalize(name)
      const table = {
        'carbohydrate': { max: 15, unit: 'g' },
        'protein': { max: 2, unit: 'g' },
        'fat': { max: 2, unit: 'g' },
        'vitamin a': { max: 1000, unit: 'µg' },
        'potassium': { max: 1000, unit: 'mg' },
        'fiber': { max: 5, unit: 'g' },
      }
      return table[key]
    },

    getBarWidth(macro) {
      const v = Number(macro.amount ?? macro.value ?? 0)
      let spec = this.getScaleSpec(macro.nutrient)

      // （可選）如果是其他維生素沒在表內，給個通用門檻避免顯示 50%
      if (!spec && /^vitamin\b/i.test(macro.nutrient || '')) {
        // mg 用 100 當滿刻度、µg 用 1000，g 用 1
        const u = (macro.unit || '').toLowerCase()
        spec = { max: u === 'mg' ? 100 : (u === 'g' ? 1 : 1000), unit: u || 'mg' }
      }

      if (!spec) return 50
      const val = this.convertUnit(v, macro.unit, spec.unit)
      return Math.min((val / spec.max) * 100, 100)
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
        'carbohydrate': '碳水化合物',
        'potassium': '鉀',
        'fiber': '膳食纖維',
        'vitamin c': '維生素C',
        'folate': '葉酸',
        'sugar': '糖',
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
