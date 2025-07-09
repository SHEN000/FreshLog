<template>
  <div class="compare-card">
    <div class="header">
      <div class="header-text">
        <h2 class="title">多通路價格比較與CP值排行</h2>
        <p class="subtitle">
          為您提供最透明的 {{ veggieName }} 市場價格對比，讓您做出最明智的選擇
        </p>
      </div>
      <!-- 切換排序的按鈕 -->
      <div class="tabs">
        <button v-for="opt in sortOptions" :key="opt.value" :class="{ active: sortBy === opt.value }"
          @click="sortBy = opt.value">
          {{ opt.label }}
        </button>
      </div>
    </div>

    <!-- 卡片區 -->
    <div class="cards">
      <div class="card" v-for="(item, index) in sortedItems" :key="item.id" :class="{ highlight: index === 0 }">
        <div class="card-header">
          <span class="market-name">{{ item.name }}</span>
          <!-- 根據 排序方式 動態顯示標籤 -->
          <span class="badge" v-if="index === 0">
            {{ badgeLabel }}
          </span>
        </div>

        <img :src="item.image" class="market-img" alt="市場圖片" />

        <div class="price">NT${{ item.pricePerKg }}/公斤</div>

        <!-- 品質分數與 CP 值兩條進度條 -->
        <div class="metrics">
          <div class="metric">
            <span class="label">品質分數</span>
            <div class="bar-bg">
              <div class="bar-fill quality" :style="{ width: item.qualityScore + '%' }"></div>
            </div>
            <span class="value">{{ item.qualityScore }}</span>
          </div>
          <div class="metric">
            <span class="label">CP值</span>
            <div class="bar-bg">
              <!-- 填滿比例 = cpValue / maxCp * 100% -->
              <div class="bar-fill cp" :style="{ width: (item.cpValue / maxCp) * 100 + '%' }"></div>
            </div>
            <span class="value">{{ item.cpValue.toFixed(2) }}</span>
          </div>
        </div>

        <!-- 市場描述 -->
        <p class="description">{{ item.description }}</p>

        <div class="tags">
          <span v-for="tag in item.tags" :key="tag" class="tag">{{ tag }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, toRefs } from 'vue'

/*
 Props: 
 - marketCompare: Array (多通路價格資料)
 - veggieName: String (蔬菜名稱)
 */
const props = defineProps({
  marketCompare: {
    type: Array,
    default: () => []
  },
  veggieName: {
    type: String,
    default: ''
  }
})

const { marketCompare, veggieName } = toRefs(props)

// 排序模式
const sortBy = ref('cp')
const sortOptions = [
  { value: 'cp', label: '按CP值排序' },
  { value: 'price', label: '按價格排序' },
  { value: 'quality', label: '按品質排序' },
]

// 計算最大 CP 值 (maxCp) , 用於顯示進度條比例
const maxCp = computed(() => {
  if (!marketCompare.value.length) return 1
  return Math.max(...marketCompare.value.map(i => i.cpValue))
})

// 排序後的陣列
const sortedItems = computed(() => {
  return [...marketCompare.value].sort((a, b) => {
    if (sortBy.value === 'cp') {
      return b.cpValue - a.cpValue
    }
    if (sortBy.value === 'price') {
      return a.pricePerKg - b.pricePerKg
    }
    return b.qualityScore - a.qualityScore
  })
})

// 根據 sortBy 產生第一筆標籤文字
const badgeLabel = computed(() => {
  switch (sortBy.value) {
    case 'cp':
      return '最高CP值'
    case 'price':
      return '最便宜價格'
    case 'quality':
      return '最高品質'
    default:
      return ''
  }
})
</script>

<style scoped>
.compare-card {
  border-radius: 12px;
  padding: 20px;
  box-sizing: border-box;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 12px;
}

.header-text {
  flex: 1 1 auto;
}

/* 主標題 */
.title {
  font-size: 18px;
  margin: 0;
  color: #2e7d32;
}

/* 副標題 */
.subtitle {
  font-size: 14px;
  color: #777;
  margin: 4px 0 12px;
}

/* 排序 Tabs */
.tabs {
  display: flex;
  gap: 12px;
}

.tabs button {
  padding: 6px 14px;
  border: 1px solid #ddd;
  border-radius: 20px;
  background: #fff;
  cursor: pointer;
  font-size: 14px;
}

.tabs button.active {
  background: #3498db;
  color: #fff;
  border-color: #3498db;
}

.cards {
  display: flex;
  gap: 20px;
  overflow-x: auto;
  padding: 16px 20px 20px;
  /* 左右與上方留一點內邊距 */
}

/* 美化 scrollbar */
.cards::-webkit-scrollbar {
  height: 8px;
}

.cards::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.cards::-webkit-scrollbar-track {
  background: #eee;
}

/* 單張卡片樣式 */
.card {
  background: #fff;
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 16px;
  box-sizing: border-box;
  flex: 0 0 310px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

/* 第一筆 highlight 樣式 */
.card.highlight {
  border-color: #3498db;
  border-width: 2px;
  box-shadow: 0 0 0 1px #3498db;
}

/* 卡片標頭：市場名稱 + 標籤 */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #2e7d32;
}

.market-name {
  font-weight: 600;
}

.badge {
  background: #2ecc71;
  color: #fff;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  white-space: nowrap;
}

/* 市場圖片 */
.market-img {
  width: 100%;
  border-radius: 8px;
  margin: 12px 0;
}

/* 價格顯示 */
.price {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 12px;
}

/* 指標文字顯示 */
.metrics {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 12px;
}

.metric {
  display: flex;
  align-items: center;
}

.metric .label {
  width: 70px;
  font-size: 14px;
  color: #555;
}

/* 進度條背景 */
.bar-bg {
  flex: 1;
  height: 6px;
  background: #f0f0f0;
  border-radius: 3px;
  overflow: hidden;
  margin: 0 8px;
}

/* 進度條填滿 */
.bar-fill {
  height: 100%;
}

/* 品質分數：藍→綠 漸層 */
.bar-fill.quality {
  background: linear-gradient(to right,
      #2196f3 0%,
      #26c281 100%);
}

/* CP值：藍→綠 漸層 */
.bar-fill.cp {
  background: linear-gradient(to right,
      #2196f3 0%,
      #26c281 100%);
}

.value {
  width: 36px;
  text-align: right;
  font-size: 14px;
  color: #333;
}

/* 說明文字 */
.description {
  font-size: 14px;
  color: #555;
  margin: 12px 0;
}

/* 標籤群 */
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  background: #eee;
  border-radius: 12px;
  padding: 4px 8px;
  font-size: 12px;
  color: #555;
}

/* 手機版 */
@media (max-width: 768px) {
  .header {
    flex-direction: column;
    align-items: center;
  }

  .header-text {
    width: 100%;
    text-align: center;
  }

  .tabs {
    justify-content: center;
    width: 100%;
    margin: 8px 0 12px;
  }

  .cards {
    padding: 12px 10px 10px;
    gap: 12px;
  }

  .card {
    flex: 0 0 260px;
    min-width: 260px;
  }

  .tabs button {
    padding: 6px 8px;
    border: 1px solid #ddd;
    border-radius: 20px;
    background: #fff;
    cursor: pointer;
    font-size: 14px;
  }
}
</style>
