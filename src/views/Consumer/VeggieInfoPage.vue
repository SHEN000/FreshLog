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
import TopNavbar from "@/components/VeggieInfoPage/TopNavbar.vue";
import AiRecommendSection from "@/components/VeggieInfoPage/AiRecommendSection.vue";
import NutritionInfoSection from "@/components/VeggieInfoPage/NutritionInfoSection.vue";
import ProductComparisonSection from "@/components/VeggieInfoPage/ProductComparisonSection.vue";
import FarmerDirectSection from "@/components/VeggieInfoPage/FarmerDirectSection.vue";
import ProductHeaderSection from "@/components/VeggieInfoPage/ProductHeaderSection.vue";
import PriceTrendSection from "@/components/VeggieInfoPage/PriceTrendSection.vue";
import MultiChannelSection from "@/components/VeggieInfoPage/MultiChannelSection.vue";
import RecipeSection from "@/components/VeggieInfoPage/RecipeSection.vue";
import StorageTipsSection from "@/components/VeggieInfoPage/StorageTipsSection.vue";
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
