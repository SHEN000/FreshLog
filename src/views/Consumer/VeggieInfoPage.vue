<template>
  <div class="veggie-page">
    <div class="content-wrapper" v-if="veggieData">

      <!-- PC版 -->
      <div class="desktop-layout">
        <div class="left-panel">
          <AiSuggestionCard :aiSuggestion="veggieData.aiSuggestion" />
          <NutritionInfoCard :nutrition="veggieData.nutrition" />
          <SimilarVeggieCompareCard :similarVeggies="veggieData.similarVeggies" />
          <FarmerInfoCard :farmer="veggieData.farmer" />
        </div>

        <div class="right-panel">
          <VeggieMainInfoCard :veggie="veggieData" />
          <AveragePriceTrendChart :priceTrend="veggieData.priceTrend" />
          <!-- 這裡從 marketCompare 傳資料 -->
          <MultiMarketPriceCompareCard
            :marketCompare="veggieData.marketCompare"
            :veggieName="veggieData.name"
          />
          <RecipeRecommendCard :recipes="veggieData.recipes" />
          <StorageTipsCard :storageTips="veggieData.storageTips" />
        </div>
      </div>

      <!-- 手機版 -->
      <div class="mobile-layout">
        <VeggieMainInfoCard :veggie="veggieData" />
        <AiSuggestionCard :aiSuggestion="veggieData.aiSuggestion" />
        <AveragePriceTrendChart :priceTrend="veggieData.priceTrend" />
        <MultiMarketPriceCompareCard
          :marketCompare="veggieData.marketCompare"
          :veggieName="veggieData.name"
        />
        <RecipeRecommendCard :recipes="veggieData.recipes" />
        <NutritionInfoCard :nutrition="veggieData.nutrition" />
        <SimilarVeggieCompareCard :similarVeggies="veggieData.similarVeggies" />
        <StorageTipsCard :storageTips="veggieData.storageTips" />
        <FarmerInfoCard :farmer="veggieData.farmer" />
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";

import { veggieMockData } from "@/data/mockVeggieData.js";

// 引入子元件
import VeggieMainInfoCard from "@/components/Veggie/VeggieMainInfoCard.vue";
import AveragePriceTrendChart from "@/components/Veggie/AveragePriceTrendChart.vue";
import NutritionInfoCard from "@/components/Veggie/NutritionInfoCard.vue";
import MultiMarketPriceCompareCard from "@/components/Veggie/MultiMarketPriceCompareCard.vue";
import StorageTipsCard from "@/components/Veggie/StorageTipsCard.vue";
import SimilarVeggieCompareCard from "@/components/Veggie/SimilarVeggieCompareCard.vue";
import RecipeRecommendCard from "@/components/Veggie/RecipeRecommendCard.vue";
import FarmerInfoCard from "@/components/Veggie/FarmerInfoCard.vue";
import AiSuggestionCard from "@/components/Veggie/AiSuggestionCard.vue";

// 取得路由物件，用以讀取路由參數
const route = useRoute();

// 使用 reactive 變數存放當前蔬菜資料
const veggieData = ref(null);

// 模擬：根據 ID 取得資料
const veggieList = { "001": veggieMockData };

// 將指定 ID 的資料載入 veggieData
const loadVeggieData = (id) => {
  veggieData.value = veggieList[id] || null;
};

// 元件掛載後載入一次（使用 route.params.id 或預設 "001"）
onMounted(() => {
  loadVeggieData(route.params.id || "001");
});

// 監聽路由參數 id 改變時，重新載入資料
watch(
  () => route.params.id,
  (newId) => {
    loadVeggieData(newId || "001");
  }
);
</script>

<style scoped>
.veggie-page {
  padding: 30px 0px;
}

.content-wrapper {
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 24px;
}

/* 桌機版結構 */
.desktop-layout {
  display: flex;
  gap: 20px;
}

/* 左側欄 */
.left-panel {
  flex: 0 0 30%;
  /* 左欄預設30 % */
  min-width: 0;
  /* 左欄最小寬度 */
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 右側欄 */
.right-panel {
  flex: 1;
  /* 右欄剩餘空間 */
  min-width: 0;
  /* 右欄最小寬度 */
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 手機版結構（直排） */
.mobile-layout {
  display: none;
  flex-direction: column;
  gap: 20px;
}

/* 響應式切換 */
@media (max-width: 768px) {
  .desktop-layout {
    display: none;
  }

  .mobile-layout {
    display: flex;
  }

  .content-wrapper {
    padding: 0 6px;
  }
}
</style>
