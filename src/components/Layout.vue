<template>
    <div class="layout-wrapper">
      <!-- ✅ 把 Header 包在 page-container 裡，讓它也被內縮 -->
      <div class="page-container">
        <Header />
      </div>
  
      <!-- ✅ 主內容也放在 page-container 中 -->
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
    background-color: #f9f9f1;
    min-height: 100vh;
  }
  
  /* 📦 內縮設定：兩邊保留空間，畫面置中 */
  .page-container {
    padding: 0 24px;
    max-width: 1440px;
    margin: 0 auto;
  }
  
  @media (min-width: 768px) {
    .page-container {
      padding: 0 32px;
    }
  }
  @media (min-width: 1024px) {
    .page-container {
      padding: 0 48px;
    }
  }
  </style>
  