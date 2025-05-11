<template>
  <div class="main-info-card">
    <!-- 手機版用的當季推薦徽章 -->
    <div class="mobile-badge">
      <img src="@/assets/season-badge.png" alt="當季推薦" />
    </div>

    <div class="left">
      <img :src="veggie.image" alt="蔬菜圖片" class="veggie-image" />
    </div>

    <div class="center">
      <div class="title-line">
        <h2 class="name">{{ veggie.name }}</h2>
        <span class="english-name">{{ veggie.englishName }}</span>
        <button class="favorite-button" @click="toggleFavorite">
          <img :src="isFavorite ? redHeart : grayHeart" alt="收藏" class="heart-icon" />
        </button>
      </div>

      <div class="sub-info">{{ veggie.category }} / {{ veggie.usage }}</div>

      <div class="price-warning">
        <div class="price-badge">最新均價：${{ veggie.pricePerKg || "35" }}/公斤</div>
      </div>

      <!-- 動態警示文字 -->
      <div v-if="adviceText" :class="[
        'warning-text',
        diffPercent <= -20 ? 'warning-fall'
          : diffPercent >= 20 ? 'warning-rise'
            : ''
      ]">
        {{ adviceText }}
      </div>
    </div>

    <div class="right">
      <div class="date-text">數據日期：{{ veggie.date }}</div>
      <div class="season-badge">
        <img src="@/assets/season-badge.png" alt="當季推薦" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, toRefs } from 'vue'
import { priceTrendData } from '@/data/priceTrendData.js'

// 收藏按鈕的灰心與紅心
import grayHeart from '@/assets/icons/heart-gray.png'
import redHeart from '@/assets/icons/heart-red.png'

const props = defineProps({
  veggie: { type: Object, required: true },
})

const { veggie } = toRefs(props)

// 收藏狀態與切換
const isFavorite = ref(false)
const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value
}

// 取 30 天趨勢資料
const trend30 = computed(() => priceTrendData['30days'])

// 當前價格：最後一筆
const currentPrice = computed(() => {
  const a = trend30.value
  return a.length ? a[a.length - 1].price : NaN
})
// 一週前價格：往前 7 筆
const weekAgoPrice = computed(() => {
  const a = trend30.value
  const idx = a.length - 1 - 7
  return idx >= 0 ? a[idx].price : NaN
})

// 漲跌百分比
const diffPercent = computed(() => {
  const p0 = weekAgoPrice.value
  const p1 = currentPrice.value
  if (!p0) return NaN
  return ((p1 - p0) / p0) * 100
})

// 警示文字：±20% 才顯示
const adviceText = computed(() => {
  const d = diffPercent.value
  if (isNaN(d)) return ''
  if (d >= 20) return '價格飆漲超過 20%，建議選購替代品'
  if (d <= -20) return '價格超跌超過 20%，建議多加購買'
  return ''
})
</script>

<style scoped>
.main-info-card {
  display: flex;
  align-items: center;
  background: white;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  gap: 20px;
  position: relative;
}

/* PC版 */

/* 左側：圖片區塊固定寬度 */
.left {
  flex: 0 0 120px;
}

/* 蔬菜圖片 */
.veggie-image {
  width: 80%;
  height: auto;
  border-radius: 12px;
  background: #f0f8f0;
  padding: 15px;
}

/* 中間：主要文字資訊區 */
.center {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* 標題列：名稱 + 英文名 + 收藏按鈕 */
.title-line {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 中文名稱 */
.name {
  font-size: 24px;
  font-weight: 700;
  margin: 0;
}

/* 英文名稱 */
.english-name {
  font-size: 20px;
  color: #555;
}

/* 收藏按鈕樣式 */
.favorite-button {
  background: none;
  border: 1.5px solid #ddd;
  border-radius: 50%;
  padding: 4px;
  width: 26px;
  height: 26px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 收藏圖示 */
.heart-icon {
  width: 13px;
  height: 13px;
  margin: 0;
  display: block;
}

.sub-info {
  font-size: 16px;
  color: #666;
}


/* 價格與警示列 */
.price-warning {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

/* 均價標籤 */
.price-badge {
  background: #ff9800;
  color: white;
  font-size: 16px;
  font-weight: bold;
  padding: 6px 16px;
  border-radius: 999px;
  display: inline-block;
}

/* 警示文字 */
.warning-text {
  font-weight: bold;
  font-size: 16px;
}

/* 新增：超跌 20% 時的文字顏色 */
.warning-fall {
  color: #8d6eff;
}

/* 新增：超漲 20% 時的文字顏色 */
.warning-rise {
  color: #ff5a5a;
}

/* 右側：桌機版顯示數據日期與徽章 */
.right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}

/* 當季徽章大小 */
.season-badge img {
  width: 100px;
}

/* 數據日期文字 */
.date-text {
  font-size: 14px;
  color: #888;
}

/* PC隱藏元素(手機版的徽章) */
.mobile-badge,
.mobile-show {
  display: none;
}


/* 手機版 */
@media (max-width: 768px) {

  /* 隱藏桌機版右側日期 */
  .date-text {
    display: none;
  }

  .main-info-card {
    flex-direction: row;
    align-items: flex-start;
    flex-wrap: wrap;
    padding: 16px;
    position: relative;
  }

  /* 圖片區縮小 */
  .left {
    width: 100px;
    flex: none;
  }

  .veggie-image {
    width: 100px;
  }

  .center {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .title-line {
    justify-content: flex-start;
  }

  .right {
    display: none;
  }

  /* 顯示手機版用徽章 */
  .mobile-badge {
    display: block;
    position: absolute;
    top: -30px;
    right: -20px;
    z-index: 10;
  }

  .mobile-badge img {
    width: 70px;
  }

  .mobile-show {
    display: inline;
  }

  .price-warning {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  .date-text {
    display: none;
  }

  .sub-info {
    font-size: 14px;
    color: #666;
  }

  .name {
    font-size: 22px;
    font-weight: 700;
    margin: 0;
  }

  .price-badge {
    background: #ff9800;
    color: white;
    font-size: 14px;
    font-weight: bold;
    padding: 6px 16px;
    border-radius: 999px;
    display: inline-block;
  }


  .warning-text {
    color: #ff5a5a;
    font-weight: bold;
    font-size: 14px;
  }

  .veggie-image {
    width: 90%;
    height: auto;
    border-radius: 12px;
    background: #f0f8f0;
    padding: 10px;
  }
}
</style>
