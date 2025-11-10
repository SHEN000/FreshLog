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
          :category-options="categoryOptions"
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
        <div v-if="totalPages >= 1" class="pagination-container">
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
                :disabled="page > totalPages"
                @click="goToPage(page)"
              >
                {{ page }}
              </button>
            </div>

            <button
              :disabled="currentPage >= totalPages"
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
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import {
  recipeListData,
  filterOptions,
  categoryTags,
} from "@/data/6424/RecipeListData/RecipeListData.js";
import { recipeApi } from "@/api/recipe";

// 🔧 修正：使用您設定的正確路徑
import RecipeFilterSidebar from "@/components/CCC/RecipeList/RecipeSideBar.vue";
import RecipeCategoryTags from "@/components/CCC/RecipeList/RecipeCategoryTags.vue";
import RecipeCard from "@/components/CCC/RecipeList/RecipeCard.vue";
import AIRecommendationSection from "@/components/CCC/RecipeList/Recommendation.vue";

// 響應式數據
const isLoading = ref(false);
const allRecipes = ref([]);
const filters = ref({ ...filterOptions });
const activeCategory = ref("all");
const currentSort = ref("newest"); // 改用 API 的預設值
const currentPage = ref(1);

// 響應式每頁顯示數量
const itemsPerPage = ref(21); // 預設21筆（桌面：3列×7排）
const apiPageSize = ref(35); // API 請求35筆，過濾後確保有足夠資料

// API 回傳的分頁資訊
const totalElements = ref(0);
const totalPages = ref(0);

// 根據螢幕寬度計算每頁應顯示的數量
const calculateItemsPerPage = () => {
  const width = window.innerWidth;

  if (width >= 1200) {
    // 桌面版：3列 × 7排 = 21個
    itemsPerPage.value = 21;
    apiPageSize.value = 35;
  } else if (width >= 992) {
    // 中等螢幕：2列 × 6排 = 12個
    itemsPerPage.value = 12;
    apiPageSize.value = 20;
  } else if (width >= 768) {
    // 平板：2列 × 5排 = 10個
    itemsPerPage.value = 10;
    apiPageSize.value = 15;
  } else {
    // 手機：1列 × 5排 = 5個
    itemsPerPage.value = 5;
    apiPageSize.value = 10;
  }
};

// 排序選項（從 API 載入）
const sortOptions = ref([]);

// 分類選項（從 API 載入）
const categoryOptions = ref([]);

// 計算屬性 - 現在改用 API 的資料，不需要前端篩選
const paginatedRecipes = computed(() => allRecipes.value);

const displayPages = computed(() => {
  const total = totalPages.value;
  const current = currentPage.value;
  const pages = [];

  // 根據實際頁數顯示頁碼按鈕
  if (total <= 7) {
    // 如果總頁數 <= 7，顯示所有頁碼
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
  } else {
    // 如果總頁數 > 7，顯示部分頁碼
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

// 將分類 ID 轉換為中文名稱（給 API 用）
const getCategoryName = (categoryId) => {
  // 如果是自選分類（格式：custom:分類名稱）
  if (categoryId.startsWith("custom:")) {
    return categoryId.replace("custom:", "");
  }

  // 固定分類對應
  const categoryMap = {
    all: "",
    stir_fry: "熱炒",
    cold_dish: "涼拌",
    dessert: "甜點",
    soup: "湯品",
    stew: "燉煮",
    frying: "煎炸",
    other: "其他",
    beverage: "飲品",
    steam: "蒸煮",
    baking: "烘焙",
  };
  return categoryMap[categoryId] || "";
};

// 載入排序選項
const loadSortOptions = async () => {
  try {
    const response = await recipeApi.getRecipeSortEnums();

    console.log("📥 排序選項 API 回傳:", response.data);

    if (response.data && response.data.code === "0000") {
      // 轉換 API 格式 {code, label} 為前端格式 {value, label}
      sortOptions.value = response.data.data.map((option) => ({
        value: option.code,
        label: option.label,
      }));

      console.log("✅ 排序選項載入成功:", sortOptions.value);
    } else {
      console.error("❌ 排序選項 API 回傳格式錯誤:", response.data);
      // 使用預設選項
      sortOptions.value = [
        { value: "newest", label: "最新上架" },
        { value: "cooktime_asc", label: "烹調時間由短到長" },
        { value: "cooktime_desc", label: "烹調時間由長到短" },
        { value: "difficulty_asc", label: "難易度由易到難" },
        { value: "difficulty_desc", label: "難易度由難到易" },
      ];
    }
  } catch (error) {
    console.error("❌ 載入排序選項失敗:", error);
    // 使用預設選項
    sortOptions.value = [
      { value: "newest", label: "最新上架" },
      { value: "cooktime_asc", label: "烹調時間由短到長" },
      { value: "cooktime_desc", label: "烹調時間由長到短" },
      { value: "difficulty_asc", label: "難易度由易到難" },
      { value: "difficulty_desc", label: "難易度由難到易" },
    ];
  }
};

// 載入分類選項
const loadCategoryOptions = async () => {
  try {
    const response = await recipeApi.getRecipeCategories();

    console.log("📥 分類選項 API 回傳:", response.data);

    if (response.data && response.data.code === "0000") {
      // API 回傳的是字串陣列，例如：["湯品", "熱炒", "涼拌", ...]
      categoryOptions.value = response.data.data;

      console.log("✅ 分類選項載入成功:", categoryOptions.value);
    } else {
      console.error("❌ 分類選項 API 回傳格式錯誤:", response.data);
      categoryOptions.value = [];
    }
  } catch (error) {
    console.error("❌ 載入分類選項失敗:", error);
    categoryOptions.value = [];
  }
};

// 取得料理時間上限
const getMaxCookMinutes = () => {
  const checkedCookTimes = filters.value.cookTime.filter((t) => t.checked);
  if (checkedCookTimes.length === 0) return null;

  // 找出最大的時間限制
  const maxTimes = checkedCookTimes.map((timeFilter) => {
    switch (timeFilter.id) {
      case "15min":
        return 15;
      case "30min":
        return 30;
      case "1hour":
        return 60;
      default:
        return null;
    }
  });

  return Math.max(...maxTimes.filter((t) => t !== null));
};

// 取得難易度篩選
const getDifficultyParam = () => {
  const checkedDifficulties = filters.value.difficulty.filter((d) => d.checked);
  if (checkedDifficulties.length === 0) return "";

  // 目前只支援單一難易度，如果有多個就取第一個
  const firstDifficulty = checkedDifficulties[0];
  const difficultyMap = {
    easy: "新手",
    medium: "普通",
    hard: "進階",
  };
  return difficultyMap[firstDifficulty.id] || "";
};

// 取得標籤篩選
const getTagParam = () => {
  const checkedFeatures = filters.value.features.filter(
    (f) => f.checked && f.id !== "all"
  );
  if (checkedFeatures.length === 0) return "";

  // 將特色轉換為標籤
  const tagMap = {
    vegetarian: "素食",
  };

  return checkedFeatures
    .map((f) => tagMap[f.id])
    .filter((t) => t)
    .join(",");
};

// 方法 - 從 API 載入食譜
const loadRecipes = async () => {
  isLoading.value = true;
  try {
    // 準備 Request Body 參數
    const bodyParams = {
      category: getCategoryName(activeCategory.value),
      name: "", // 可以之後加搜尋功能
      maxCookMinutes: getMaxCookMinutes(),
      servings: "",
      difficulty: getDifficultyParam(),
      tag: getTagParam(),
      sort: currentSort.value, // 直接使用 API 的排序代碼
    };

    // 準備 Query String 參數（分頁）
    const queryParams = {
      pageNo: currentPage.value - 1, // API 是 0-based，前端顯示是 1-based
      pageSize: apiPageSize.value, // 請求更多資料以應對過濾
    };

    console.log("🔍 API 請求參數:", { bodyParams, queryParams });

    // 呼叫 API
    const response = await recipeApi.findRecipesList(bodyParams, queryParams);

    console.log("📥 API 回傳:", response.data);

    // 處理回傳資料 (API 的 code 是字串 '0000' 代表成功)
    if (response.data && response.data.code === "0000") {
      const pageData = response.data.data;

      // 轉換 API 資料格式為前端格式，並過濾掉 F 開頭的資料（已棄用）
      const filteredContent = pageData.content.filter((recipe) => {
        // 檢查 recipeId 或 title 是否以 F 開頭
        const isDeprecatedById = recipe.recipeId && recipe.recipeId.startsWith("F");
        const isDeprecatedByTitle = recipe.title && recipe.title.startsWith("F");
        const isDeprecated = isDeprecatedById || isDeprecatedByTitle;

        if (isDeprecated) {
          console.log("🚫 過濾掉已棄用的食譜:", {
            recipeId: recipe.recipeId,
            title: recipe.title,
            deprecatedReason: isDeprecatedById ? "recipeId 以 F 開頭" : "title 以 F 開頭"
          });
        }
        return !isDeprecated;
      });

      console.log(
        `📊 過濾結果: 原始 ${pageData.content.length} 筆，過濾後 ${filteredContent.length} 筆`
      );

      // 只取前 itemsPerPage 筆資料顯示
      const limitedContent = filteredContent.slice(0, itemsPerPage.value);

      allRecipes.value = limitedContent.map((recipe) => ({
        id: recipe.recipeId,
        name: recipe.title,
        image: recipe.image,
        description: recipe.description,
        tags: recipe.tag ? recipe.tag.split(",") : [],
        cookTime: `${recipe.cookTimeMinutes}分鐘`,
        servings: recipe.servings,
        difficulty: recipe.difficulty,
        category: bodyParams.category,
        isRecommended: false, // API 沒有這個欄位，先設為 false
        createdAt: recipe.createdAt,
      }));

      // Debug: 檢查第一筆食譜的圖片資訊
      if (allRecipes.value.length > 0) {
        const firstRecipe = allRecipes.value[0];
        const assetBase = import.meta.env.VITE_ASSET_BASE;
        const fullImageUrl = assetBase
          ? new URL(firstRecipe.image, assetBase).href
          : firstRecipe.image;

        console.log("🖼️ 第一筆食譜圖片:", {
          title: firstRecipe.name,
          image: firstRecipe.image,
          assetBase: assetBase,
          fullImageUrl: fullImageUrl,
          imageEmpty: !firstRecipe.image,
        });

        // 測試圖片是否可以載入
        console.log("🧪 開始測試圖片載入...");
        const testImg = new Image();
        testImg.onload = () => {
          console.log("✅ 圖片載入成功:", fullImageUrl);
        };
        testImg.onerror = (error) => {
          console.error("❌ 圖片載入失敗:", fullImageUrl, error);
        };
        testImg.src = fullImageUrl;
        console.log("🧪 圖片測試已觸發，URL:", testImg.src);
      }

      // 更新分頁資訊（基於過濾後的實際資料）
      // 判斷邏輯：
      // 1. API 回傳的資料量 < apiPageSize：表示 API 已經沒有更多資料了
      // 2. 過濾後的資料 < itemsPerPage：表示這頁顯示不滿，是最後一頁
      // 3. 過濾後的資料 >= itemsPerPage 且 API 資料 == apiPageSize：可能還有下一頁

      const apiReturnedCount = pageData.content.length; // API 實際回傳的筆數
      const filteredCount = filteredContent.length; // 過濾後的筆數
      const displayCount = allRecipes.value.length; // 實際顯示的筆數

      // 檢查 API 是否還有更多資料
      const apiHasMore = apiReturnedCount === apiPageSize.value;

      // 檢查過濾後是否還有足夠資料
      const filteredHasMore = filteredCount > itemsPerPage.value;

      if (apiHasMore && filteredHasMore) {
        // API 還有資料，且過濾後也還有多餘資料，表示確定有下一頁
        totalElements.value = pageData.totalElements;
        totalPages.value = pageData.totalPages;
      } else {
        // 否則這是最後一頁
        totalPages.value = currentPage.value;
        totalElements.value = (currentPage.value - 1) * itemsPerPage.value + displayCount;
      }

      console.log("✅ 食譜資料載入成功:", {
        顯示筆數: allRecipes.value.length,
        API回傳筆數: apiReturnedCount,
        過濾後筆數: filteredCount,
        當前頁: currentPage.value,
        總頁數: totalPages.value,
        API還有資料: apiHasMore,
        過濾後還有資料: filteredHasMore,
      });
    } else {
      console.error("❌ API 回傳格式錯誤:", response.data);
      allRecipes.value = [];
      totalElements.value = 0;
      totalPages.value = 0;
    }
  } catch (error) {
    console.error("❌ 載入食譜失敗:", error);
    allRecipes.value = [];
    totalElements.value = 0;
    totalPages.value = 0;
  } finally {
    isLoading.value = false;
  }
};

const updateFilters = (newFilters) => {
  filters.value = newFilters;
  currentPage.value = 1; // 重置頁碼
  loadRecipes(); // 重新載入資料
};

const handleCategoryChange = (categoryId) => {
  activeCategory.value = categoryId;
  currentPage.value = 1;
  loadRecipes(); // 重新載入資料
};

const handleSortChange = () => {
  currentPage.value = 1;
  loadRecipes(); // 重新載入資料
};

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    loadRecipes(); // 載入該頁資料
    // 滾動到頁面頂部
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

const resetFilters = () => {
  filters.value = { ...filterOptions };
  activeCategory.value = "all";
  currentSort.value = "newest"; // 改用 API 的預設值
  currentPage.value = 1;
  loadRecipes(); // 重新載入資料
};

// 生命週期
onMounted(async () => {
  // 計算初始的每頁顯示數量
  calculateItemsPerPage();

  // 監聽視窗大小變化
  window.addEventListener("resize", handleResize);

  // 先載入選項，再載入食譜
  await Promise.all([loadSortOptions(), loadCategoryOptions()]);
  loadRecipes();
});

// 清理監聽器
onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});

// 處理視窗大小變化
let resizeTimeout = null;
const handleResize = () => {
  // 使用防抖，避免頻繁觸發
  if (resizeTimeout) clearTimeout(resizeTimeout);

  resizeTimeout = setTimeout(() => {
    const oldItemsPerPage = itemsPerPage.value;
    calculateItemsPerPage();

    // 如果每頁顯示數量改變了，重新載入資料
    if (oldItemsPerPage !== itemsPerPage.value) {
      currentPage.value = 1;
      loadRecipes();
    }
  }, 300);
};
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
