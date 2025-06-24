<template>
  <div class="consumer-home-container">
    <!-- 主要內容區域 -->
    <div class="dashboard-grid">
      <RecipeListCard class="bento-card small" />
      <MarketTrendCard class="bento-card large" />
      <FeaturedIngredientCard class="bento-card tall" />
      <SafetyInfoCard class="bento-card tall2" />
      <NewsCard class="bento-card medium" />
      <CommunityContentCard class="bento-card wide" />
    </div>

    <Footer />
  </div>
</template>

<script setup>
import RecipeListCard from "@/components/ConsumerHome/RecipeListCard.vue";
import MarketTrendCard from "@/components/ConsumerHome/MarketTrendCard.vue";
import FeaturedIngredientCard from "@/components/ConsumerHome/FeaturedIngredientCard.vue";
import CommunityContentCard from "@/components/ConsumerHome/CommunityContentCard.vue";
import SafetyInfoCard from "@/components/ConsumerHome/SafetyInfoCard.vue";
import NewsCard from "@/components/ConsumerHome/NewsCard.vue";
</script>

<style scoped>
/* 整體容器 */
.consumer-home-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.dashboard-grid {
  flex: 1; /* 佔用剩餘空間 */
  display: grid;
  grid-template-columns: repeat(12, 1fr); /* 設定12欄 */
  grid-auto-rows: auto; /* 行高自動 */
  grid-auto-flow: row;
  gap: 24px; /* 卡片間距 */
  padding: 24px;
  box-sizing: border-box;
}

/* 尺寸設定 */
.bento-card.wide {
  grid-column: span 12;
}
.bento-card.large {
  grid-column: span 6;
  grid-row: span 2;
}
.bento-card.medium {
  grid-column: span 6;
}
.bento-card.small {
  grid-column: span 3;
}
.bento-card.tall {
  grid-column: span 3;
  grid-row: span 3;
}
.bento-card.tall2 {
  grid-column: span 3;
  grid-row: span 2;
}

/* 手機版調整間距與 padding */
@media (max-width: 768px) {
  .dashboard-grid {
    padding: 0px 0px 24px 0px;
    gap: 16px;
  }

  .bento-card {
    grid-column: span 12 !important; /* 每張卡片佔滿整行 */
    grid-row: span 1 !important; /* 卡片行高固定 */
  }
}
</style>
