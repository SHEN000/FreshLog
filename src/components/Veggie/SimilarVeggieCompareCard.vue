<template>
  <div class="similar-card">
    <div class="header">
      <h2 class="title">相關產品比較</h2>
    </div>

    <!-- 列表 -->
    <div class="items">
      <div
        v-for="veg in similarVeggies"
        :key="veg.id"
        class="item"
      >
        <!-- 左側：icon + 文字 -->
        <div class="item-left">
          <div class="icon-wrapper">
            <img :src="veg.icon" alt="" />
          </div>
          <div class="info">
            <div class="name">{{ veg.name }}</div>
            <div class="subtitle">{{ veg.subtitle }}</div>
          </div>
        </div>

        <!-- 右側：價格 + 漲跌箭頭 -->
        <div class="price">
          ${{ veg.pricePerKg }}/公斤
          <span
            class="trend"
            :class="veg.trend === 'up' ? 'up' : 'down'"
          >
            {{ veg.trend === 'up' ? '↑' : '↓' }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { veggieMockData } from '@/data/mockVeggieData.js'
const similarVeggies = veggieMockData.similarVeggies || []
</script>

<style scoped>
.similar-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
  box-sizing: border-box;
}

/* 標題 */
.header .title {
  font-size: 18px;
  font-weight: bold;
  color: #2e7d32;
  margin: 0 0 12px;
}

/* 項目列表 */
.items {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

/* 單一項目 */
.item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
}
.item:last-child {
  border-bottom: none;  /* 最後一筆不畫底線 */
}

/* 左側區塊：icon + 文字 */
.item-left {
  display: flex;
  align-items: center;
}
.icon-wrapper {
  width: 40px;
  height: 40px;
  background: #e8f5e9;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.icon-wrapper img {
  width: 24px;
  height: 24px;
}
.info {
  margin-left: 12px; /* 與 icon 之間間距 */
}
.name {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}
.subtitle {
  font-size: 12px;
  color: #777;
  margin-top: 4px;
}

/* 右側價格區 */
.price {
  font-size: 16px;
  font-weight: bold;
  color: #FFA000;
  display: flex;
  align-items: center;
}
.trend {
  font-size: 14px;
  margin-left: 4px;
}
.trend.up {
  color: #E53935; /* 漲：紅 */
}
.trend.down {
  color: #43A047; /* 跌：綠 */
}

/* 手機版 */
@media (max-width: 768px) {
  .similar-card {
    padding: 16px;
  }
}
</style>
