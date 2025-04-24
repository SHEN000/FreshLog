<template>
  <div class="carrot-home-page">
    <!-- 頂部導航欄 -->
    <TopNavbar />

    <div class="content-container">
      <!-- 左側邊欄區域 -->
      <div class="sidebar">
        <AiRecommendSection />
        <NutritionInfoSection />
        <ProductComparisonSection />
        <FarmerDirectSection />
      </div>

      <!-- 主要內容區域 -->
      <div class="main-content">
        <ProductHeaderSection />
        <PriceTrendSection />
        <MultiChannelSection />
        <RecipeSection />
        <StorageTipsSection />
      </div>
    </div>
  </div>
</template>

<script setup>
// 引入各個組件模塊
import TopNavbar from "@/components/NewConsumerComps/TopNavbar.vue";
import AiRecommendSection from "@/components/NewConsumerComps/AiRecommendSection.vue";
import NutritionInfoSection from "@/components/NewConsumerComps/NutritionInfoSection.vue";
import ProductComparisonSection from "@/components/NewConsumerComps/ProductComparisonSection.vue";
import FarmerDirectSection from "@/components/NewConsumerComps/FarmerDirectSection.vue";
import ProductHeaderSection from "@/components/NewConsumerComps/ProductHeaderSection.vue";
import PriceTrendSection from "@/components/NewConsumerComps/PriceTrendSection.vue";
import MultiChannelSection from "@/components/NewConsumerComps/MultiChannelSection.vue";
import RecipeSection from "@/components/NewConsumerComps/RecipeSection.vue";
import StorageTipsSection from "@/components/NewConsumerComps/StorageTipsSection.vue";
</script>

<style scoped>
.carrot-home-page {
  font-family: "Noto Sans TC", sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  color: #333;
}

/* 內容區佈局 */
.content-container {
  display: flex;
  padding: 20px;
}

.sidebar {
  width: 300px;
  margin-right: 20px;
}

.main-content {
  flex: 1;
}

/* 響應式設計 */
@media (max-width: 992px) {
  .content-container {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    margin-right: 0;
    margin-bottom: 20px;
  }
}
</style>
