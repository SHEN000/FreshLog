<template>
  <div class="card">
    <!-- 如果有傳入 title prop，就顯示標題 -->
    <h3 v-if="title" class="card-title">{{ title }}</h3>

    <div class="card-content">
      <slot />  <!-- slot 讓卡片內容可以由父層插入自訂內容 -->
    </div>
  </div>
</template>

<script setup>
// 定義 props：title 為可選字串，控制是否顯示標題
defineProps({
  title: String
})
</script>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  width: 100%; /* 讓卡片填滿容器寬度 */
  min-width: 0; /* 防止內容撐破卡片寬度 */
  height: 100%;  /* 高度由內容自動撐開 */
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.05); /* 陰影 */
  padding: 20px;
  margin: 0;
  box-sizing: border-box; /* padding不會影響卡片總寬度 */
  transition: transform 0.3s ease, box-shadow 0.3s ease; /* 滑鼠 hover 過渡動畫 */
}

.card:hover {
  transform: translateY(-4px); /* 滑鼠移上時卡片略往上抬 */
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08); /* 加強陰影 */
}

.card-title {
  margin-bottom: 12px;
  font-size: 18px;
  font-weight: 600;
  color: #333;
  flex-shrink: 0;
}

.card-content {
  flex: 1;
  overflow: hidden; /* 超出部分隱藏（防止溢出） */
}
</style>
