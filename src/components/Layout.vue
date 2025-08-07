<template>
  <div class="layout-wrapper">
    <!-- Header 自己一層，不放 page-container -->
    <Header />

    <!-- 主內容包在 page-container 中 -->
    <div class="page-container">
      <slot />
    </div>

    <!-- 移除 Footer，讓頁面自己決定是否要顯示 Footer -->
  </div>
</template>

<script setup>
import Header from "@/components/Header.vue";
</script>

<style scoped>
.layout-wrapper {
  background-color: #f9f9f9;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.page-container {
  padding: 0 24px;
  max-width: 1320px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
  flex: 1; /* 讓主內容佔據剩餘空間 */
}

/* 響應式內距 */
@media (min-width: 768px) {
  .page-container {
    padding: 0px;
  }
}
</style>
