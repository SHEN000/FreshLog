<template>
  <div v-if="recipe">
    <!-- breadcrumb -->
    <div class="breadcrumb">
      <RouterLink to="/" class="crumb">首頁</RouterLink>
      <span class="sep">›</span>
      <RouterLink to="/ai-recommendation" class="crumb">食譜推薦</RouterLink>
      <span class="sep">›</span>
      <span class="current">{{ recipe.title }}</span>
    </div>

    <div class="recipe-detail">
      <!-- Banner/Header -->
      <div class="block header">
        <RecipeDetailHeader :title="recipe.title" :desc="recipe.desc" :image="recipe.image" :cookTime="recipe.cookTime"
          :servings="recipe.servings" :difficulty="recipe.difficulty"  :gradientColors="recipe.gradientColors" />
      </div>

      <!-- 左側主欄 -->
      <div class="left-col">
        <div class="block steps">
          <RecipeSteps :steps="recipe.steps" :times="recipe.times" :tags="recipe.tags" />
        </div>
        <div class="block season">
          <SeasonalRecommend :items="recipe.seasonalItems" :month="`${new Date().getMonth() + 1}月`" />
        </div>
        <div class="block subs">
          <SubstituteRecommendations :subs="recipe.substitutes" />
        </div>
      </div>

      <!-- 右側主欄 -->
      <div class="right-col">
        <div class="block price">
          <MainIngredientPrice :items="recipe.mainPrices" :cost="recipe.mainPriceCost" />
        </div>
        <div class="block ing">
          <IngredientsList :ingredients="recipe.ingredients" />
        </div>
        <div class="block nut">
          <MainNutritionCard :data="recipe.nutrition" />
        </div>
        <div class="block trend">
          <MarketTrends :trends="recipe.marketTrends" :tip="recipe.marketTip" />
        </div>
      </div>

      <!-- 最下方相關推薦 -->
      <div class="block related">
        <RecipeRecommendCard :recipes="recipe.recipes" />
      </div>
    </div>
  </div>

  <div v-else>
    <p>找不到這個食譜！</p>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import RecipeData from '@/data/RecipeData.js' // 單一測試食譜

import RecipeDetailHeader from '@/components/Recipe/RecipeDetailHeader.vue'
import MainIngredientPrice from '@/components/Recipe/MainIngredientPrice.vue'
import IngredientsList from '@/components/Recipe/IngredientsList.vue'
import MainNutritionCard from '@/components/Recipe/MainNutritionCard.vue'
import RecipeSteps from '@/components/Recipe/RecipeSteps.vue'
import SeasonalRecommend from '@/components/Recipe/SeasonalRecommend.vue'
import SubstituteRecommendations from '@/components/Recipe/SubstituteRecommendations.vue'
import MarketTrends from '@/components/Recipe/MarketTrends.vue'
import RecipeRecommendCard from "@/components/Veggie/RecipeRecommendCard.vue";

const recipe = ref(null)
const route = useRoute()

function loadRecipe(id) {
  if (RecipeData.id === id) {
    recipe.value = RecipeData
  } else {
    recipe.value = null
  }
}

onMounted(() => {
  loadRecipe(route.params.id || RecipeData.id)
})

watch(
  () => route.params.id,
  (newId) => {
    loadRecipe(newId)
  }
)

</script>

<style scoped>
/* Breadcrumb 樣式 */
.breadcrumb {
  /* 讓整個區塊置中，設定最大寬度 */
  width: 100%;
  max-width: 960px;
  margin: 24px auto 16px;
  /* 上 24，下 16 */

  /* 與 Header 左側文字保持一致的內邊距 */
  padding-left: 2px;

  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
}

.breadcrumb .crumb {
  color: #22a135;
  text-decoration: none;
}

.breadcrumb .crumb:hover {
  text-decoration: underline;
}

.breadcrumb .sep,
.breadcrumb .current {
  color: #999;
}

.breadcrumb .current {
  font-weight: 500;
}

/* 先把整個內容區域水平置中，並設定最大寬度 */
.recipe-detail {
  width: 100%;
  max-width: 960px;
  margin: 0 auto;
}

/* 手機版：以 Flex 排成單列 */
@media (max-width: 768px) {
  .recipe-detail {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  /* 讓左右子欄直接攤平，不影響排序 */
  .left-col,
  .right-col {
    display: contents;
  }

  /* 手機版重新指定區塊順序 */
  .block.header {
    order: 1;
  }

  .block.price {
    order: 2;
  }

  .block.ing {
    order: 3;
  }

  .block.nut {
    order: 4;
  }

  .block.steps {
    order: 5;
  }

  .block.season {
    order: 6;
  }

  .block.subs {
    order: 7;
  }

  .block.trend {
    order: 8;
  }

  .block.related {
    order: 9;
  }
}


/* PC版：Grid 兩欄 + Header、食譜推薦 橫跨兩欄 */
@media (min-width: 769px) {
  .recipe-detail {
    display: grid;
    grid-template-columns: 2fr 1fr;
    grid-template-rows: auto 1fr auto;
    grid-gap: 24px;
    /* 讓內容不會互相影響高度 */
    align-items: start;
  }

  /* Header 區橫跨兩欄 */
  .block.header {
    grid-column: 1 / span 2;
    grid-row: 1;
  }

  /* 左側主欄：步驟、當季推薦、替代推薦 */
  .left-col {
    grid-column: 1;
    grid-row: 2;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  /* 右側主欄：價格、清單、營養、行情 */
  .right-col {
    grid-column: 2;
    grid-row: 2;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  /* 食譜推薦 橫跨兩欄 */
  .block.related {
    grid-column: 1 / span 2;
    grid-row: 3;
  }
}
</style>
