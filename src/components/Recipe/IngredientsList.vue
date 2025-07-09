<template>
  <div class="ingredients-card">
    <h3 class="card-title">
      <img src="@/assets/icons/carrot.png" alt="食材" class="title-icon" />
      食材清單
    </h3>
    <ul class="ingredients-list">
      <li v-for="(ing, idx) in ingredients" :key="ing.name + idx" class="ingredient-item">
        <span class="name">{{ ing.name }}</span>
        <span class="quantity">{{ ing.quantity }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
defineProps({
  ingredients: {
    type: Array,
    default: () => []
  }
})
</script>

<style scoped>
/* 整張卡片的外觀設定 */
.ingredients-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  padding: 24px;
}

/* 標題列：包含圖示與文字 */
.card-title {
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: 500;
  margin: 0 0 16px;
  color: #333;
}

/* 標題圖示尺寸及間距 */
.title-icon {
  width: 24px;
  height: 24px;
  margin-right: 8px;
}

/* 列表外層：移除預設樣式 */
.ingredients-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

/* 單一食材列：左右對齊並加分隔線 */
.ingredient-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

/* 移除最後一項的分隔線 */
.ingredient-item:last-child {
  border-bottom: none;
}

/* 食材名稱文字樣式 */
.name {
  color: #333;
  font-size: 15px;
}

/* 食材數量文字樣式 */
.quantity {
  color: #22a135;
  font-size: 15px;
}
</style>
