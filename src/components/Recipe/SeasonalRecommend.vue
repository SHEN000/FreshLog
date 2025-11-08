<template>
  <div class="season-card">
    <div class="header">
      <img src="@/assets/icons/season.png" alt="當季推薦" class="header-icon" />
      <!-- 標題文字，顯示月份 -->
      <h3 class="title">當季推薦食材（{{ month }}）</h3>
    </div>
    <p class="subtitle">
      以下是目前當季且價格實惠的蔬果，適合製作類似料理
    </p>

    <div class="grid">
      <div v-for="item in items" :key="item.name" class="item-card" :class="{ recommended: item.recommended }">
        <!-- 推薦標籤 -->
        <div v-if="item.recommended" class="badge">推薦</div>

        <!-- 圖片、名稱、價格 -->
        <img :src="$img(item.image)" :alt="item.name" class="item-img" />
        <div class="item-name">{{ item.name }}</div>
        <div class="item-price">{{ item.displayPrice }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    default: () => []
  },
  /* 月份字串 */
  month: {
    type: String,
    default: () => `${new Date().getMonth() + 1}月`
  }
})
</script>

<style scoped>
/* 最外層卡片容器 */
.season-card {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

/* 標題區塊 */
.header {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 標題圖示 */
.header-icon {
  width: 24px;
  height: 24px;
}

/* 主標題 */
.title {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
  color: #333;
}

/* 副標題 */
.subtitle {
  margin: 8px 0 16px;
  font-size: 14px;
  color: #666;
}

/* 卡片格子排版*/
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 16px;
}

/* 單一食材卡片 */
.item-card {
  position: relative;
  /* 讓內部 badge 可絕對定位 */
  overflow: visible;
  /* 允許 badge 溢出 */
  background: #fafafa;
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  transition: border 0.2s, background 0.2s;
}

/* 推薦的橘色邊框與背景 */
.item-card.recommended {
  border: 2px solid #ff9800;
  background: #fff3e0;
  border-radius: 16px;
}

/* 右上推薦徽章 */
.badge {
  position: absolute;
  top: -8px;
  /* 向上溢出 */
  right: -8px;
  /* 向右溢出 */
  background: #ff9800;
  color: #fff;
  font-size: 12px;
  font-weight: bold;
  padding: 4px 12px;
  border-radius: 12px;
  /* 圓角 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 圖片 */
.item-img {
  width: 60px;
  height: 60px;
  object-fit: contain;
  margin-bottom: 8px;
  border-radius: 35px;
}

/* 名稱 */
.item-name {
  font-size: 14px;
  color: #333;
  margin-bottom: 4px;
}

/* 價格 */
.item-price {
  font-size: 14px;
  color: #22a135;
}

/* PC版：3 欄 */
@media (min-width: 769px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* 手機版 2 欄 */
@media (max-width: 768px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
