<template>
  <div>
    <div class="ai-recommendation">
      <div class="content-wrapper">
        <!-- 桌機版佈局 -->
        <div class="desktop-layout">
          <div class="left-panel">
            <FilterSidebar
              :filters="filters"
              :priceRange="priceRange"
              :nutritionFilters="nutritionFilters"
              :activeNutritionTab="activeNutritionTab"
              @update-filters="updateFilters"
              @update-price-range="updatePriceRange"
              @update-nutrition-filters="updateNutritionFilters"
              @update-nutrition-tab="updateNutritionTab"
            />
          </div>

          <div class="right-panel">
            <PageHeader
              :searchQuery="searchQuery"
              @update-search="updateSearchQuery"
              @search="searchRecipes"
            />
            <CategoryTabs
              :categories="categories"
              :activeCategory="activeCategory"
              @set-category="setCategory"
            />
            <MarketInsight />
            <RecipeGrid
              :recipes="filteredDishes"
              @view-recipe="viewRecipeDetails"
            />
            <PaginationControls
              :currentPage="currentPage"
              :totalPages="totalPages"
              @prev-page="prevPage"
              @next-page="nextPage"
              @go-to-page="goToPage"
            />
          </div>
        </div>

        <!-- 手機版佈局 - 移除重複的 FilterSidebar -->
        <div class="mobile-layout">
          <PageHeader
            :searchQuery="searchQuery"
            @update-search="updateSearchQuery"
            @search="searchRecipes"
          />
          <CategoryTabs
            :categories="categories"
            :activeCategory="activeCategory"
            @set-category="setCategory"
          />
          <MarketInsight />
          <!-- 移除手機版的重複 FilterSidebar -->
          <RecipeGrid
            :recipes="filteredDishes"
            @view-recipe="viewRecipeDetails"
          />Sidebar :filters="filters" :priceRange="priceRange"
          :nutritionFilters="nutritionFilters"
          :activeNutritionTab="activeNutritionTab"
          @update-filters="updateFilters" @update-price-range="updatePriceRange"
          @update-nutrition-filters="updateNutritionFilters"
          @update-nutrition-tab="updateNutritionTab" />
          <RecipeGrid
            :recipes="filteredDishes"
            @view-recipe="viewRecipeDetails"
          />
          <PaginationControls
            :currentPage="currentPage"
            :totalPages="totalPages"
            @prev-page="prevPage"
            @next-page="nextPage"
            @go-to-page="goToPage"
          />
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from "vue";
import { useRouter } from "vue-router";
import { recommendedDishes } from "@/data/AiRecommendation.js";

// 引入子元件
import FilterSidebar from "@/components/CCC/Sidebar.vue";
import PageHeader from "@/components/CCC/PageHeader.vue";
import CategoryTabs from "@/components/CCC/CategoryTag.vue";
import MarketInsight from "@/components/CCC/Marketsight.vue";
import RecipeGrid from "@/components/CCC/Recipe.vue";
import PaginationControls from "@/components/CCC/PageControls.vue";
// 不引入任何 Footer 元件，讓 Layout 處理

const router = useRouter();
const searchQuery = ref("");
const activeCategory = ref("all");
const currentPage = ref(1);
const itemsPerPage = 6;

// 分類選項
const categories = [
  { id: "all", name: "全部" },
  { id: "breakfast", name: "早餐" },
  { id: "main", name: "主食" },
  { id: "soup", name: "湯品" },
  { id: "leftover", name: "剩菜飯" },
  { id: "international", name: "異國料理" },
];

// 篩選條件
const filters = reactive({
  antioxidant: true,
  supplement: true,
  eyecare: false,
  energy: false,
  superFood: false,
});

// 價格區間
const priceRange = ref([0, 200]);

// 營養需求篩選條件
const nutritionFilters = reactive({
  vitaminA: false,
  vitaminC: false,
  calcium: false,
  iron: false,
  antioxidant: false,
});

// 營養標籤
const activeNutritionTab = ref("vitaminA");

// 計算總頁數
const totalPages = computed(() =>
  Math.ceil(allFilteredDishes.value.length / itemsPerPage)
);

// 所有篩選後的菜餚
const allFilteredDishes = computed(() => {
  let dishes = [...recommendedDishes];

  // 搜尋篩選
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    dishes = dishes.filter(
      (dish) =>
        dish.name.toLowerCase().includes(query) ||
        dish.ingredients.some((i) => i.toLowerCase().includes(query))
    );
  }

  // 分類篩選
  if (activeCategory.value !== "all") {
    dishes = dishes.filter((dish) => dish.type === activeCategory.value);
  }

  return dishes;
});

// 當前頁面的菜餚
const filteredDishes = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return allFilteredDishes.value.slice(start, end);
});

// 事件處理函數
const updateFilters = (newFilters) => {
  Object.assign(filters, newFilters);
  currentPage.value = 1;
};

const updatePriceRange = (newRange) => {
  priceRange.value = newRange;
  currentPage.value = 1;
};

const updateNutritionFilters = (newFilters) => {
  Object.assign(nutritionFilters, newFilters);
  currentPage.value = 1;
};

const updateNutritionTab = (tab) => {
  activeNutritionTab.value = tab;
};

const updateSearchQuery = (query) => {
  searchQuery.value = query;
};

const setCategory = (categoryId) => {
  activeCategory.value = categoryId;
  currentPage.value = 1;
};

const searchRecipes = () => {
  currentPage.value = 1;
};

const viewRecipeDetails = (recipeId) => {
  router.push(`/recipes/${recipeId}`);
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const goToPage = (page) => {
  currentPage.value = page;
};

// 初始化
onMounted(() => {
  const categoryParam = router.currentRoute.value.query.category;
  if (categoryParam && categories.some((c) => c.id === categoryParam)) {
    activeCategory.value = categoryParam;
  } else {
    activeCategory.value = "all";
  }
});
</script>

<style scoped>
.ai-recommendation {
  padding: 20px 0;
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
  flex: 0 0 280px;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 右側欄 */
.right-panel {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 手機版結構 */
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
