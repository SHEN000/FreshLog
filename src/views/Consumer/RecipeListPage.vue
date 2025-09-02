<template>
  <div class="recipe-list-page">
    <div class="page-container">
      <!-- 左側篩選區域 -->
      <div class="sidebar-area">
        <RecipeFilterSidebar
          :filters="filters"
          @update-filters="updateFilters"
        />
      </div>

      <!-- 右側主要內容區域 -->
      <div class="main-content-area">
        <!-- 頂部標題和排序 -->
        <div class="content-header">
          <h2 class="page-title">食譜推薦</h2>
          <div class="sort-control">
            <label class="sort-label">排序方式：</label>
            <select
              v-model="currentSort"
              @change="handleSortChange"
              class="sort-select"
            >
              <option
                v-for="option in sortOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </div>
        </div>

        <!-- 分類標籤 -->
        <RecipeCategoryTags
          :category-tags="categoryTags"
          :active-category="activeCategory"
          @category-change="handleCategoryChange"
        />

        <!-- 載入狀態 -->
        <div v-if="isLoading" class="loading-state">
          <p>🔄 載入食譜資料中...</p>
        </div>

        <!-- 食譜網格 -->
        <div v-else-if="paginatedRecipes.length > 0" class="recipes-grid">
          <RecipeCard
            v-for="recipe in paginatedRecipes"
            :key="recipe.id"
            :recipe="recipe"
          />
        </div>

        <!-- 無資料狀態 -->
        <div v-else class="no-data-state">
          <p>😔 目前沒有符合條件的食譜</p>
          <button @click="resetFilters" class="reset-btn">重置篩選條件</button>
        </div>

        <!-- 分頁控制 -->
        <div v-if="totalPages > 1" class="pagination-container">
          <div class="pagination">
            <button
              :disabled="currentPage === 1"
              @click="goToPage(currentPage - 1)"
              class="page-btn prev-btn"
            >
              上一頁
            </button>

            <div class="page-numbers">
              <button
                v-for="page in displayPages"
                :key="page"
                :class="['page-number', { active: currentPage === page }]"
                @click="goToPage(page)"
              >
                {{ page }}
              </button>
            </div>

            <button
              :disabled="currentPage === totalPages"
              @click="goToPage(currentPage + 1)"
              class="page-btn next-btn"
            >
              下一頁
            </button>
          </div>
        </div>

        <!-- AI 智慧推薦區塊 -->
        <AIRecommendationSection :recommended-recipes="aiRecommendedRecipes" />
      </div>
    </div>

    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import {
  recipeListData,
  filterOptions,
  categoryTags,
  sortOptions,
} from "@/data/6424/RecipeListData/RecipeListData.js";

// 🔧 修正：使用您設定的正確路徑
import RecipeFilterSidebar from "@/components/CCC/RecipeList/RecipeSidebar.vue";
import RecipeCategoryTags from "@/components/CCC/RecipeList/RecipeCategoryTags.vue";
import RecipeCard from "@/components/CCC/RecipeList/RecipeCard.vue";
import AIRecommendationSection from "@/components/CCC/RecipeList/Recommendation.vue";

// 響應式數據
const isLoading = ref(false);
const allRecipes = ref([]);
const filters = ref({ ...filterOptions });
const activeCategory = ref("all");
const currentSort = ref("recommend");
const currentPage = ref(1);
const itemsPerPage = 6;

// 計算屬性
const filteredRecipes = computed(() => {
  let recipes = [...allRecipes.value];

  // 分類篩選
  if (activeCategory.value !== "all") {
    recipes = recipes.filter(
      (recipe) => recipe.category === getCategoryName(activeCategory.value)
    );
  }

  // 特色篩選
  const checkedFeatures = filters.value.features.filter(
    (f) => f.checked && f.id !== "all"
  );
  if (checkedFeatures.length > 0) {
    recipes = recipes.filter((recipe) => {
      return checkedFeatures.some((feature) => {
        switch (feature.id) {
          case "vegetarian":
            return recipe.tags.includes("素食");
          default:
            return true;
        }
      });
    });
  }

  // 料理時間篩選
  const checkedCookTimes = filters.value.cookTime.filter((t) => t.checked);
  if (checkedCookTimes.length > 0) {
    recipes = recipes.filter((recipe) => {
      const cookTimeNum = parseInt(recipe.cookTime);
      return checkedCookTimes.some((timeFilter) => {
        switch (timeFilter.id) {
          case "15min":
            return cookTimeNum <= 15;
          case "30min":
            return cookTimeNum <= 30;
          case "1hour":
            return cookTimeNum <= 60;
          default:
            return true;
        }
      });
    });
  }

  // 難易度篩選
  const checkedDifficulties = filters.value.difficulty.filter((d) => d.checked);
  if (checkedDifficulties.length > 0) {
    const difficultyNames = checkedDifficulties.map((d) => {
      switch (d.id) {
        case "easy":
          return "簡單";
        case "medium":
          return "中等";
        case "hard":
          return "困難";
        default:
          return d.id;
      }
    });
    recipes = recipes.filter((recipe) =>
      difficultyNames.includes(recipe.difficulty)
    );
  }

  // 排序
  switch (currentSort.value) {
    case "recommend":
      recipes.sort((a, b) => b.isRecommended - a.isRecommended);
      break;
    case "difficulty":
      const difficultyOrder = { 簡單: 1, 中等: 2, 困難: 3 };
      recipes.sort(
        (a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
      );
      break;
    case "time":
      recipes.sort((a, b) => parseInt(a.cookTime) - parseInt(b.cookTime));
      break;
    case "popular":
      recipes.sort(() => Math.random() - 0.5); // 隨機排序模擬熱門程度
      break;
  }

  return recipes;
});

const totalPages = computed(() =>
  Math.ceil(filteredRecipes.value.length / itemsPerPage)
);

const paginatedRecipes = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredRecipes.value.slice(start, end);
});

const displayPages = computed(() => {
  const total = totalPages.value;
  const current = currentPage.value;
  const pages = [];

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
  } else {
    const start = Math.max(1, current - 3);
    const end = Math.min(total, start + 6);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
  }

  return pages;
});

const aiRecommendedRecipes = computed(() => {
  return allRecipes.value.filter((recipe) => recipe.isRecommended).slice(0, 3);
});

// 方法
const loadRecipes = async () => {
  isLoading.value = true;
  try {
    // 模擬 API 調用
    await new Promise((resolve) => setTimeout(resolve, 500));
    allRecipes.value = recipeListData;
    console.log("✅ 食譜資料載入成功:", allRecipes.value.length, "筆");
  } catch (error) {
    console.error("❌ 載入食譜失敗:", error);
  } finally {
    isLoading.value = false;
  }
};

const updateFilters = (newFilters) => {
  filters.value = newFilters;
  currentPage.value = 1; // 重置頁碼
};

const handleCategoryChange = (categoryId) => {
  activeCategory.value = categoryId;
  currentPage.value = 1;
};

const handleSortChange = () => {
  currentPage.value = 1;
};

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    // 滾動到頁面頂部
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

const resetFilters = () => {
  filters.value = { ...filterOptions };
  activeCategory.value = "all";
  currentSort.value = "recommend";
  currentPage.value = 1;
};

const getCategoryName = (categoryId) => {
  const categoryMap = {
    soup: "湯品",
    vegetable: "蔬菜",
    dessert: "甜點",
    salad: "沙拉",
    meat: "肉類",
    rice: "飯類",
  };
  return categoryMap[categoryId] || categoryId;
};

// 生命週期
onMounted(() => {
  loadRecipes();
});
</script>

<style scoped>
.recipe-list-page {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.page-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  gap: 32px;
  align-items: flex-start;
}

.sidebar-area {
  flex: 0 0 320px;
  position: sticky;
  top: 20px;
  margin-right: 40px;
}

.main-content-area {
  flex: 1;
  min-width: 0;
  width: 100%;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 16px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin: 0;
}

.sort-control {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sort-label {
  font-size: 14px;
  color: #666;
  white-space: nowrap;
}

.sort-select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  cursor: pointer;
  min-width: 120px;
}

.sort-select:focus {
  outline: none;
  border-color: #4caf50;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.1);
}

/* 🔧 修正：食譜網格重疊問題 */
.recipes-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 32px;
  /* 確保網格項目不重疊 */
  grid-auto-rows: max-content;
}

.loading-state,
.no-data-state {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.loading-state p,
.no-data-state p {
  font-size: 18px;
  margin-bottom: 16px;
}

.reset-btn {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.reset-btn:hover {
  background-color: #45a049;
}

.pagination-container {
  margin: 32px 0;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
}

.page-btn {
  padding: 8px 16px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  color: #666;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.page-btn:hover:not(:disabled) {
  background-color: #4caf50;
  color: white;
  border-color: #4caf50;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 4px;
}

.page-number {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  color: #666;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.page-number:hover {
  background-color: #4caf50;
  color: white;
  border-color: #4caf50;
}

.page-number.active {
  background-color: #4caf50;
  color: white;
  border-color: #4caf50;
  font-weight: 600;
}

/* 響應式設計 */
@media (max-width: 1400px) {
  .page-container {
    gap: 28px;
  }

  .sidebar-area {
    flex: 0 0 300px;
  }
}

@media (max-width: 1200px) {
  .page-container {
    gap: 24px;
  }

  .sidebar-area {
    flex: 0 0 280px;
  }

  .recipes-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
}

@media (max-width: 992px) {
  .recipes-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 18px;
  }
}

@media (max-width: 768px) {
  .page-container {
    flex-direction: column;
    padding: 16px;
    gap: 16px;
  }

  .sidebar-area {
    order: 2;
    position: static;
    flex: none;
    width: 100%;
  }

  .main-content-area {
    order: 1;
    width: 100%;
  }

  .content-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .page-title {
    font-size: 24px;
  }

  .recipes-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .pagination {
    flex-wrap: wrap;
    gap: 6px;
  }

  .page-numbers {
    gap: 2px;
  }

  .page-number {
    width: 36px;
    height: 36px;
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .page-container {
    padding: 12px;
  }

  .content-header {
    gap: 12px;
  }

  .sort-control {
    width: 100%;
    justify-content: space-between;
  }

  .sort-select {
    min-width: 140px;
  }
}
</style>
