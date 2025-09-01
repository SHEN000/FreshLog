<template>
  <div class="consumer-home-container">
    <div class="dashboard-grid">
      <!-- Row 1 -->
      <div class="grid-item span-4 h-1 card-brand  order-1">
        <BrandHeroCard />
      </div>
      <div class="grid-item span-8 h-1 card-trend  order-2">
        <MarketTrendCard />
      </div>
      <div class="grid-item span-4 h-1 card-news   order-4">
        <NewsCard />
      </div>

      <!-- Row 2 -->
      <div class="grid-item span-7 h-2 card-agri  order-3">
        <AgriCompositeIndexCard />
      </div>
      <div class="grid-item span-5 h-2 card-recipe order-5">
        <RecipeListCard />
      </div>
      <div class="grid-item span-4 h-2 card-nutri  order-6">
        <NutritionHelperCard />
      </div>
    </div>

    <Footer />
  </div>
</template>

<script setup>
import BrandHeroCard from "@/components/ConsumerHome/BrandHeroCard.vue";
import NutritionHelperCard from "@/components/ConsumerHome/NutritionHelperCard.vue";
import AgriCompositeIndexCard from "@/components/ConsumerHome/AgriCompositeIndexCard.vue";
import RecipeListCard from "@/components/ConsumerHome/RecipeListCard.vue";
import MarketTrendCard from "@/components/ConsumerHome/MarketTrendCard.vue";
import NewsCard from "@/components/ConsumerHome/NewsCard.vue";
</script>

<style scoped>
/* --- 共用：用變數控 gap 與 padding（桌機不動、手機縮小） --- */
.consumer-home-container {
  --page-max: 1440px;
  --pad-desktop: 24px;
  --gap-desktop: 24px;
  width: 100vw;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
}

/* 桌機：14 欄，維持你原本配置 */
.dashboard-grid {
  max-width: var(--page-max);
  margin-inline: auto;
  display: grid;
  grid-template-columns: repeat(16, minmax(0, 1fr));
  grid-auto-rows: 24px;
  gap: var(--gap-desktop);
  padding: 24px var(--pad-desktop);
  box-sizing: border-box;
}

/* 卡片外觀（要能套到子元件根節點 → 用 :deep） */
:deep(.bento-card) {
  background: #fff;
  border: 1px solid #eef1f4;
  border-radius: 16px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
  overflow: hidden;
  box-sizing: border-box;
  width: 100%;
  margin: 0;
}

/* 尺寸工具（同理用 :deep，避免 scoped 擋住） */
:deep(.span-8) {
  grid-column: span 8;
}

:deep(.span-7) {
  grid-column: span 7;
}

:deep(.span-6) {
  grid-column: span 6;
}

:deep(.span-5) {
  grid-column: span 5;
}

:deep(.span-4) {
  grid-column: span 4;
}

:deep(.span-3) {
  grid-column: span 3;
}

:deep(.h-1) {
  grid-row: span 8;
}

:deep(.h-2) {
  grid-row: span 10;
}

/* ========= 平板段：769–1000px 客製化 3 排 ========= */
@media (min-width: 769px) and (max-width: 1320px) {
  .dashboard-grid{
    /* 改 10 欄，方便 3/7、7/3、5/5 */
    grid-template-columns: repeat(10, minmax(0, 1fr));
    grid-auto-rows: 20px;   /* 每列單位高，下面用 span 10 讓同排等高（≈200px） */
    gap: 20px;
  }

  /* 先重置任何舊的 span 規則，避免衝突 */
  .dashboard-grid :deep(.bento-card),
  .dashboard-grid .grid-item{
    grid-column: auto !important;
    grid-row: auto !important;
  }

  /* === 第 1 排：Brand 3/10、Trend 7/10（同高） === */
  .dashboard-grid .card-brand{
    grid-column: 1 / span 3 !important;
    grid-row:    1 / span 10 !important;
  }
  .dashboard-grid .card-trend{
    grid-column: 4 / span 7 !important;
    grid-row:    1 / span 10 !important;
  }

  /* === 第 2 排：Agri 7/10、News 3/10（同高） === */
  .dashboard-grid .card-agri{
    grid-column: 1 / span 7 !important;
    grid-row:    11 / span 12 !important;   /* 接在第 1 排之後：1..10 → 下一排從 11 開始 */
  }
  .dashboard-grid .card-news{
    grid-column: 8 / span 3 !important;
    grid-row:    11 / span 12 !important;
  }

  /* === 第 3 排：Recipe 5/10、Nutri 5/10（同高） === */
  .dashboard-grid .card-recipe{
    grid-column: 1 / span 5 !important;
    grid-row:    23 / span 11 !important;   /* 第 2 排用到 20，下一排從 21 */
  }
  .dashboard-grid .card-nutri{
    grid-column: 6 / span 5 !important;
    grid-row:    23 / span 11 !important;
  }
}

/* ====== 手機 ≤768px：改用 Flex + order 排序 ====== */
@media (max-width: 768px) {
  .consumer-home-container {
    --pad-mobile: 20px;
    --gap-mobile: 15px;
    width: 100vw;
    left: 50%;
    transform: translateX(-50%);
    overflow-x: clip;
  }

  /* 改成單欄 Flex，直接用 order 控排序 */
  .dashboard-grid {
    max-width: 100vw;
    display: flex;
    /* ★ 切換成 Flex */
    flex-direction: column;
    gap: var(--gap-mobile);
    padding-left: max(var(--pad-mobile), env(safe-area-inset-left));
    padding-right: max(var(--pad-mobile), env(safe-area-inset-right));
    padding-top: 15px;
    padding-bottom: 16px;
  }

  /* 手機排序 */
  /* BrandHeroCard */
  .order-1 {
    order: 1;
  }

  /* MarketTrendCard */
  .order-2 {
    order: 2;
  }

  /* AgriCompositeIndexCard */
  .order-3 {
    order: 3;
  }

  /* NewsCard */
  .order-4 {
    order: 4;
  }

  /* RecipeListCard */
  .order-5 {
    order: 5;
  }

  /* NutritionHelperCard */
  .order-6 {
    order: 6;
  }

  /* 讓每個 item 滿版、忽略桌機的 grid span 設定 */
  .dashboard-grid .grid-item {
    width: 100%;
  }
}
</style>
