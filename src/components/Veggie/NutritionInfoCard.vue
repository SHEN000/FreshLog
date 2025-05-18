<template>
  <div class="nutrition-card">
    <div class="section-title">營養與健康資訊</div>

    <div class="sub-section">
      <div class="sub-title">主要營養成分</div>
      <div class="nutrition-bars">
        <div class="nutrition-bar" v-for="macro in nutrition.macros" :key="macro.id">
          <div class="bar-content" :style="{ backgroundColor: macro.color, width: getBarWidth(macro) + '%' }">
            {{ macro.label }} {{ macro.value }}{{ macro.unit }}
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
      <p class="audience">{{ nutrition.audience }}</p>
    </div>
  </div>
</template>

<script>
import { veggieMockData } from '@/data/mockVeggieData.js'

export default {
  name: 'NutritionInfoCard',
  data() {
    return {
      veggie: veggieMockData
    }
  },
  computed: {
    nutrition() {
      return this.veggie.nutrition
    }
  },
  methods: {
    getBarWidth(macro) {
      // 根據不同的營養素類型計算合適的百分比
      if (macro.id === 'carbs') {
        // 碳水化合物：以 15g 為 100%
        return Math.min((macro.value / 15) * 100, 100)
      } else if (macro.id === 'protein') {
        // 蛋白質：以 2g 為 100%
        return Math.min((macro.value / 2) * 100, 100)
      } else if (macro.id === 'fat') {
        // 脂肪：以 2g 為 100%
        return Math.min((macro.value / 2) * 100, 100)
      } else if (macro.id === 'vitaminA') {
        // 維生素A：以 1000µg 為 100%
        return Math.min((macro.value / 1000) * 100, 100)
      }
      return 50 // 預設值
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
  font-size: 20px;
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
  border-radius: 100px;  /* 圓角長條 */
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
}

/* 健康益處列表樣式 */
.benefits-list {
  list-style-type: disc;
  padding-left: 20px;
  line-height: 1.6;
  margin: 0;
}

.benefits-list li {
  margin-bottom: 8px;
}

/* 適合人群段落文字 */
.audience {
  line-height: 1.6;
  margin: 0;
}

/* 手機版 */
@media (max-width: 768px) {
  .nutrition-card {
    padding: 16px;
  }

  .section-title {
    font-size: 16px;
  }

  .sub-title {
    font-size: 14px;
  }

  .bar-content {
    font-size: 14px;
  }
}
</style>
