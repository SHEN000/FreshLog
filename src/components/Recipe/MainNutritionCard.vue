<template>
  <div class="nutrition-card">
    <h3 class="card-title">
      <img src="@/assets/icons/nutrition.png" alt="營養資訊" class="icon" />
      營養資訊
    </h3>
    <div class="grid">
      <div
        v-for="(value, label) in data"
        :key="label"
        class="grid-item"
      >
        <span class="value">{{ value }}</span>
        <span class="label">{{ label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
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
