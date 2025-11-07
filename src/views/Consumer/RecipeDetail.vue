<template>
  <div v-if="isLoading">載入中…</div>
  <div v-else-if="errorMsg">{{ errorMsg }}</div>
  <div v-else-if="recipe">
    <!-- breadcrumb -->
    <div class="breadcrumb">
      <RouterLink to="/" class="crumb">首頁</RouterLink>
      <span class="sep">›</span>
      <RouterLink to="/recipes" class="crumb">食譜推薦</RouterLink>
      <span class="sep">›</span>
      <span class="current">{{ recipe.name }}</span>
    </div>

    <div class="recipe-detail">
      <!-- Banner/Header -->
      <div class="block header" v-if="showHeader">
        <RecipeDetailHeader :title="recipe.name" :desc="recipe.description" :image="recipe.image"
          :cook-time-minutes="recipe.cookTimeMinutes" :servings="recipe.servings" :difficulty="recipe.difficulty"
          :gradientColors="recipe.gradientColors || []" />
      </div>

      <!-- 左側主欄 -->
      <div class="left-col">
        <div class="block steps" v-if="showSteps">
          <RecipeSteps :steps="recipe.instruction || []" :times="recipe.times || []" :tags="recipe.tag || []" />
        </div>

        <div class="block season" v-if="showSeasonal">
          <SeasonalRecommend :items="recipe.seasonalItems" :month="`${new Date().getMonth() + 1}月`" />
        </div>

        <div class="block subs" v-if="showSubs">
          <SubstituteRecommendations :subs="recipe.substitutes" />
        </div>
      </div>

      <!-- 右側主欄 -->
      <div class="right-col">
        <div class="block price" v-if="showPrice">
          <MainIngredientPrice :items="recipe.mainIngredient" :cost="recipe.mainPriceCost" />
        </div>

        <div class="block ing" v-if="showIngredients">
          <IngredientsList :ingredients="recipe.ingredients" />
        </div>

        <div class="block nut" v-if="showNutrition">
          <MainNutritionCard :data="recipe.nutrition" />
        </div>

        <div class="block trend" v-if="showTrends">
          <MarketTrends :trends="recipe.marketTrends" :tip="recipe.marketTip" />
        </div>
      </div>

      <!-- 最下方相關推薦 -->
      <div class="block related" v-if="showRelated">
        <RecipeRecommendCard :recipes="recipe.recipeSuggestions" />
      </div>
    </div>

    <Footer />
  </div>

  <div v-else>
    <p>找不到這個食譜！</p>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { useRoute } from "vue-router";
//import RecipeData from '@/data/RecipeData.js' // 單一測試食譜
import axios from "axios";

import RecipeDetailHeader from "@/components/Recipe/RecipeDetailHeader.vue";
import MainIngredientPrice from "@/components/Recipe/MainIngredientPrice.vue";
import IngredientsList from "@/components/Recipe/IngredientsList.vue";
import MainNutritionCard from "@/components/Recipe/MainNutritionCard.vue";
import RecipeSteps from "@/components/Recipe/RecipeSteps.vue";
import SeasonalRecommend from "@/components/Recipe/SeasonalRecommend.vue";
import SubstituteRecommendations from "@/components/Recipe/SubstituteRecommendations.vue";
import MarketTrends from "@/components/Recipe/MarketTrends.vue";
import RecipeRecommendCard from "@/components/Veggie/RecipeRecommendCard.vue";

const recipe = ref(null);
const route = useRoute();
const isLoading = ref(false);
const errorMsg = ref(null);

/* 通用檢查：有值且不是空集合/空字串 */
function has(val) {
  if (val == null) return false
  if (Array.isArray(val)) return val.length > 0
  if (typeof val === 'object') return Object.keys(val).length > 0
  if (typeof val === 'string') return val.trim() !== ''
  return !!val
}

/* 各區塊顯示條件（依 recipe 動態更新） */
const showHeader = computed(() => {
  const r = recipe.value
  return !!r && (has(r.name) || has(r.description) || has(r.image))
})

const showSteps = computed(() => {
  const r = recipe.value
  return !!r && (has(r.instruction) || has(r.times) || has(r.tag))
})

const showSeasonal = computed(() => has(recipe.value?.seasonalItems))

const showSubs = computed(() => has(recipe.value?.substitutes))

const showPrice = computed(() => {
  const r = recipe.value
  return !!r && (has(r.mainIngredient) || has(r.mainPriceCost))
})

const showIngredients = computed(() => has(recipe.value?.ingredients))

const showNutrition = computed(() => {
  const n = recipe.value?.nutrition
  // 若營養卡有多欄位，可挑重要欄位任一存在就顯示
  return !!(n && (has(n.cal) || has(n.carb) || has(n.fat) || has(n.protein) || has(n.vitaminC)))
})

const showTrends = computed(() => {
  const r = recipe.value
  return !!r && (has(r.marketTrends) || has(r.marketTip))
})

const showRelated = computed(() => has(recipe.value?.recipeSuggestions))

const loadRecipeData = async (id) => {
  if (!id) {
    recipe.value = null;
    return;
  }
  isLoading.value = true;
  errorMsg.value = null;

  try {
    const res = await axios.get("/api/recipe/findRecipeData", {
      params: { recipeId: id }, // ← Swagger 裡參數名稱「RecipesId」
    });
    // 將 data.data 結構賦值給 recipe
    recipe.value = res.data.data;
  } catch (err) {
    console.error("載入食譜失敗：", err);
    errorMsg.value = "載入食譜失敗";
    recipe.value = null;
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  loadRecipeData(route.params.id);
});

watch(
  () => route.params.id,
  (newId) => {
    loadRecipeData(newId);
  }
);
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
