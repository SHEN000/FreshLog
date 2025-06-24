<template>
  <div class="layout-wrapper">
    <!-- Header 自己一層，不放 page-container -->
    <Header />

    <!-- 主內容包在 page-container 中 -->
    <div class="page-container">
      <slot />
    </div>
  </div>
</template>
  
<script setup>
import Header from '@/components/Header.vue'
</script>

<style scoped>
.layout-wrapper {
  background-color: #f9f9f9;
  min-height: 100vh;
}

.page-container {
  padding: 0 24px;
  max-width: 1320px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
}

/* 響應式內距 */
@media (min-width: 768px) {
  .page-container {
    padding: 0px;
  }
}
</style>