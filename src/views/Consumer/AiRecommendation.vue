<template>
  <div class="ai-recommendation">
    <!-- 添加API測試區塊  記得把最後div tag 刪除-->

    <div
      class="api-test-section"
      style="
        background: #f0f8ff;
        padding: 20px;
        margin: 20px;
        border-radius: 8px;
      "
    >
      <h3>🧪 API測試區</h3>
      <div style="display: flex; gap: 10px; margin-bottom: 10px">
        <button
          @click="testFindFoodData('F001')"
          style="
            padding: 8px 16px;
            background: #4caf50;
            color: white;
            border: none;
            border-radius: 4px;
          "
        >
          測試高麗菜 (F001)
        </button>
        <button
          @click="testFindFoodData('F002')"
          style="
            padding: 8px 16px;
            background: #2196f3;
            color: white;
            border: none;
            border-radius: 4px;
          "
        >
          測試紅蘿蔔 (F002)
        </button>
        <button
          @click="testGetSortEnums"
          style="
            padding: 8px 16px;
            background: #ff9800;
            color: white;
            border: none;
            border-radius: 4px;
          "
        >
          測試排序選項
        </button>
      </div>
      <div
        v-if="testResult"
        style="
          background: white;
          padding: 12px;
          border-radius: 4px;
          font-family: monospace;
          font-size: 12px;
          max-height: 200px;
          overflow-y: auto;
        "
      >
        <pre>{{ JSON.stringify(testResult, null, 2) }}</pre>
      </div>
      <!-- 主要容器 -->
      <div class="main-container">
        <!-- 左側篩選欄 -->
        <div class="sidebar-container">
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

        <!-- 右側內容區 -->
        <div class="main-content">
          <!-- 分類標籤 -->
          <CategoryTabs
            :categories="categories"
            :activeCategory="activeCategory"
            :sortOptions="sortOptions"
            :currentSort="currentSort"
            @set-category="setCategory"
            @sort-change="handleSortChange"
          />

          <!-- AI 市場洞察 -->
          <MarketInsight />

          <!-- 載入狀態 -->
          <div v-if="isLoading" class="loading-container">
            <p>載入中...</p>
          </div>

          <!-- 食譜卡片網格 - 調整為2x3布局 -->
          <div v-else class="recipe-grid">
            <div
              class="recipe-card"
              v-for="dish in paginatedDishes"
              :key="dish.id"
            >
              <!-- 圖片區域  -->
              <div class="image-container">
                <div class="image-placeholder">
                  <span class="placeholder-text">🖼️ {{ dish.name }} 🖼️</span>
                </div>
                <!-- 評分標籤 -->
                <div class="rating-badge">★★★</div>
                <!-- 追蹤狀態 -->
                <div class="track-status">
                  <span class="track-icon">📍</span>
                  <span>追蹤狀態</span>
                </div>
              </div>

              <!-- 卡片內容 -->
              <div class="card-content">
                <h3 class="dish-name">{{ dish.name }}</h3>

                <!-- 分類標籤 -->
                <div class="category-tag" :class="getCardClass(dish.type)">
                  {{ dish.type }}
                </div>

                <!-- 描述 -->
                <div class="dish-description">
                  {{ getDescription(dish) }}
                </div>

                <!-- 營養標籤 -->
                <div class="nutrition-tags">
                  <span
                    v-for="tag in dish.ingredients.slice(0, 2)"
                    :key="tag"
                    class="nutrition-tag"
                  >
                    {{ tag }}
                  </span>
                </div>

                <!-- 價格區域 -->
                <div class="price-section">
                  <div class="price-info">
                    <span class="price">NT${{ dish.price }}/台斤</span>
                    <span class="price-change" :class="getPriceChangeClass()">
                      {{ getPriceChangeText() }}
                    </span>
                  </div>
                  <button class="detail-btn">詳細資訊</button>
                </div>
              </div>
            </div>
          </div>

          <!-- 沒有資料時的顯示 -->
          <div
            v-if="!isLoading && paginatedDishes.length === 0"
            class="no-data"
          >
            <p>目前沒有符合條件的食譜</p>
          </div>

          <!-- 分頁控制 - 更新樣式 -->
          <div v-if="totalPages > 1" class="pagination">
            <button
              class="page-btn"
              :disabled="currentPage === 1"
              @click="prevPage"
            >
              上一頁
            </button>

            <div class="page-numbers">
              <button
                v-for="page in displayPages"
                :key="page"
                class="page-number"
                :class="{ active: currentPage === page }"
                @click="goToPage(page)"
              >
                {{ page }}
              </button>
            </div>

            <button
              class="page-btn"
              :disabled="currentPage === totalPages"
              @click="nextPage"
            >
              下一頁
            </button>
          </div>
        </div>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from "vue";
import { useRouter } from "vue-router";
import { foodApi } from "@/data/6424/FoodApi.js";

// 在 AiRecommendation.vue 中加入這個測試函數

const testPostAPIDirectly = async () => {
  try {
    console.log("🧪 直接測試 POST API...");

    const testData = {
      category: "蔬菜類",
      subCategory: "水果",
      name: "蘋果",
      nameEn: "Apple",
      priceMin: 1,
      priceMax: 100,
      tag: "當季含鈣",
      sort: "price_desc",
    };

    // 方法 1: 使用 axios 直接測試
    console.log("📤 測試資料:", testData);

    const response = await axios.post("/api/food/findFoodsList", testData, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    console.log("✅ 直接 POST 測試成功:", response.data);
    testResult.value = {
      success: true,
      method: "POST",
      data: response.data,
      timestamp: new Date().toLocaleTimeString(),
    };
  } catch (error) {
    console.error("❌ 直接 POST 測試失敗:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
    });

    testResult.value = {
      success: false,
      method: "POST",
      error: {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
        fullError: error.response?.data,
      },
      timestamp: new Date().toLocaleTimeString(),
    };

    // 如果是 403，嘗試檢查是否是 CORS 問題
    if (error.response?.status === 403) {
      console.log("🔍 403 錯誤可能原因:");
      console.log("1. 後端 CORS 設定不允許 POST 請求");
      console.log("2. 後端需要特殊的 Authentication headers");
      console.log("3. 後端對 POST 請求有額外的驗證規則");
      console.log("4. Content-Type 不正確");
    }
  }
};

// 添加測試相關的 ref
const testResult = ref(null);

// 測試 findFoodData API
const testFindFoodData = async (foodId) => {
  try {
    console.log("🧪 測試 findFoodData API:", foodId);
    testResult.value = { loading: true, api: "findFoodData", foodId };

    const result = await foodApi.findFoodData(foodId);

    testResult.value = {
      success: true,
      api: "findFoodData",
      foodId,
      result,
      timestamp: new Date().toLocaleTimeString(),
    };

    console.log("✅ findFoodData 測試成功:", result);
  } catch (error) {
    testResult.value = {
      success: false,
      api: "findFoodData",
      foodId,
      error: error.message,
      timestamp: new Date().toLocaleTimeString(),
    };

    console.error("❌ findFoodData 測試失敗:", error);
  }
};

// 測試 getFoodSortEnums API
const testGetSortEnums = async () => {
  try {
    console.log("🧪 測試 getFoodSortEnums API");
    testResult.value = { loading: true, api: "getFoodSortEnums" };

    const result = await foodApi.getFoodSortEnums();

    testResult.value = {
      success: true,
      api: "getFoodSortEnums",
      result,
      timestamp: new Date().toLocaleTimeString(),
    };

    console.log("✅ getFoodSortEnums 測試成功:", result);
  } catch (error) {
    testResult.value = {
      success: false,
      api: "getFoodSortEnums",
      error: error.message,
      timestamp: new Date().toLocaleTimeString(),
    };

    console.error("❌ getFoodSortEnums 測試失敗:", error);
  }
};

// 引入子元件
import FilterSidebar from "@/components/CCC/Sidebar.vue";
import CategoryTabs from "@/components/CCC/CategoryTag.vue";
import MarketInsight from "@/components/CCC/MarketSight.vue";

const router = useRouter();

// 基本狀態
const activeCategory = ref("all");
const currentPage = ref(1);
const itemsPerPage = 6; // 2x3 網格
const isLoading = ref(true);
const currentSort = ref("seasonal");

// 資料
const allDishes = ref([]);
const sortOptions = ref([]);

// 篩選條件 - 與 FilterSidebar 同步
const filters = reactive({
  antioxidant: false,
  supplement: false,
  eyecare: false,
  energy: false,
  superFood: false,
});

// 價格區間 - 與 FilterSidebar 同步
const priceRange = ref([0, 200]);

// 營養需求篩選條件 - 與 FilterSidebar 同步
const nutritionFilters = reactive({
  vitaminA: false,
  vitaminC: false,
  calcium: false,
  iron: false,
  antioxidant: false,
});

// 營養標籤 - 與 FilterSidebar 同步，空字串表示未選取
const activeNutritionTab = ref("");

// 分類選項
const categories = [
  { id: "all", name: "全部" },
  { id: "vegetable", name: "蔬菜" },
  { id: "fruit", name: "水果" },
  { id: "leafy", name: "葉菜類" },
  { id: "root", name: "根莖類" },
  { id: "other", name: "其他" },
];

// 載入資料
const loadData = async () => {
  isLoading.value = true;
  try {
    console.log("開始載入資料...");

    // 載入排序選項
    const sortResponse = await foodApi.getFoodSortEnums();
    if (sortResponse && sortResponse.data) {
      sortOptions.value = sortResponse.data;
    }

    // 載入食物列表
    const foodResponse = await foodApi.findFoodsList({
      category:
        activeCategory.value === "all"
          ? ""
          : getCategoryMapping(activeCategory.value),
      name: "",
      sort: currentSort.value,
    });

    if (foodResponse && foodResponse.data) {
      allDishes.value = foodResponse.data.map((item) => ({
        id: item.foodId,
        name: item.name,
        price: item.price,
        type: item.category,
        ingredients: item.tag
          ? item.tag.split("/").filter((t) => t.trim())
          : ["新鮮", "營養"],
        description: item.description,
      }));
    }

    console.log("載入完成，共", allDishes.value.length, "個項目");
  } catch (error) {
    console.error("載入資料失敗:", error);
  } finally {
    isLoading.value = false;
  }
};

// 應用篩選邏輯
const applyFilters = () => {
  // 這個函數會被 computed 取代，但保留以備不時之需
  console.log("篩選條件更新");
};

// 分類對應函數
const getCategoryMapping = (category) => {
  const mapping = {
    vegetable: "蔬菜",
    fruit: "水果",
    leafy: "葉菜類",
    root: "根莖類",
    other: "其他",
  };
  return mapping[category] || category;
};

// 計算篩選後的資料
const filteredDishes = computed(() => {
  let filtered = [...allDishes.value];

  // 價格篩選
  filtered = filtered.filter(
    (dish) =>
      dish.price >= priceRange.value[0] && dish.price <= priceRange.value[1]
  );

  // 特色篩選
  if (filters.antioxidant) {
    filtered = filtered.filter((dish) =>
      dish.ingredients.some((ing) => ing.includes("抗氧化"))
    );
  }

  if (filters.supplement) {
    filtered = filtered.filter((dish) =>
      dish.ingredients.some((ing) => ing.includes("補鈣") || ing.includes("鈣"))
    );
  }

  if (filters.eyecare) {
    filtered = filtered.filter((dish) =>
      dish.ingredients.some(
        (ing) => ing.includes("護眼") || ing.includes("維生素A")
      )
    );
  }

  if (filters.energy) {
    filtered = filtered.filter((dish) =>
      dish.ingredients.some(
        (ing) => ing.includes("能量") || ing.includes("營養")
      )
    );
  }

  if (filters.superFood) {
    filtered = filtered.filter((dish) =>
      dish.ingredients.some((ing) => ing.includes("超級"))
    );
  }

  // 營養篩選 - 只有在有選取營養標籤時才進行篩選
  if (nutritionFilters.vitaminA) {
    filtered = filtered.filter((dish) =>
      dish.ingredients.some((ing) => ing.includes("維生素A"))
    );
  }

  if (nutritionFilters.vitaminC) {
    filtered = filtered.filter((dish) =>
      dish.ingredients.some((ing) => ing.includes("維生素C"))
    );
  }

  if (nutritionFilters.calcium) {
    filtered = filtered.filter((dish) =>
      dish.ingredients.some((ing) => ing.includes("鈣"))
    );
  }

  if (nutritionFilters.iron) {
    filtered = filtered.filter((dish) =>
      dish.ingredients.some((ing) => ing.includes("鐵"))
    );
  }

  if (nutritionFilters.antioxidant) {
    filtered = filtered.filter((dish) =>
      dish.ingredients.some((ing) => ing.includes("抗氧化"))
    );
  }

  return filtered;
});

// 計算分頁
const totalPages = computed(() => {
  return Math.ceil(filteredDishes.value.length / itemsPerPage);
});

const paginatedDishes = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredDishes.value.slice(start, end);
});

const displayPages = computed(() => {
  const total = totalPages.value;
  const current = currentPage.value;
  const pages = [];

  if (total <= 5) {
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
  } else {
    const start = Math.max(1, current - 2);
    const end = Math.min(total, start + 4);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
  }

  return pages;
});

const getDescription = (dish) => {
  return (
    dish.description ||
    `產自台灣/當季/富含營養的${dish.name}，新鮮美味，營養豐富。`
  );
};

const getCardClass = (type) => {
  const typeMap = {
    蔬菜: "vegetable",
    葉菜類: "leafy",
    醃菜品: "pickled",
    根莖類: "root",
  };
  return typeMap[type] || "vegetable";
};

const getPriceChangeClass = () => {
  // 模擬價格變動
  return Math.random() > 0.5 ? "price-up" : "price-down";
};

const getPriceChangeText = () => {
  return Math.random() > 0.5 ? "▲1.5%" : "▼0.2%";
};

// 事件處理 - 恢復完整的篩選邏輯
const setCategory = (categoryId) => {
  activeCategory.value = categoryId;
  currentPage.value = 1;
  loadData();
};

const handleSortChange = (newSort) => {
  currentSort.value = newSort;
  currentPage.value = 1;
  loadData();
};

// FilterSidebar 事件處理
const updateFilters = (newFilters) => {
  Object.assign(filters, newFilters);
  currentPage.value = 1; // 重置到第一頁
};

const updatePriceRange = (newRange) => {
  priceRange.value = newRange;
  currentPage.value = 1; // 重置到第一頁
};

const updateNutritionFilters = (newFilters) => {
  Object.assign(nutritionFilters, newFilters);
  currentPage.value = 1; // 重置到第一頁
};

const updateNutritionTab = (tab) => {
  activeNutritionTab.value = tab;
};

const viewRecipeDetails = async (recipeId) => {
  try {
    // 預載食品詳細資料
    const response = await foodApi.findFoodData(recipeId);
    if (response && response.code === "8000" && response.data) {
      // 可以將資料存到 localStorage 或 store
      localStorage.setItem(`recipe_${recipeId}`, JSON.stringify(response.data));
    }
  } catch (error) {
    console.error("載入食譜詳情失敗:", error);
  }

  // 無論成功與否都導向詳情頁
  router.push(`/ai-recommendation/${recipeId}`);
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

onMounted(() => {
  loadData();
});
</script>

<style scoped>
.ai-recommendation {
  padding: 0;
  max-width: 1400px;
  margin: 0 auto;
  background-color: #f8f9fa;
}

/* 主要容器 */
.main-container {
  display: flex;
  gap: 20px;
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  background-color: white;
}

/* 左側篩選欄 - 固定在左側 */
.sidebar-container {
  flex: 0 0 280px;
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  height: fit-content;
  position: sticky;
  top: 20px;
}

/* 右側主要內容 */
.main-content {
  flex: 1;
  min-width: 0; /* 防止溢出 */
}

/* 載入狀態 */
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  font-size: 18px;
}

/* 食譜卡片網格 - 2x3 布局 */
.recipe-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(3, auto);
  gap: 20px;
  margin-bottom: 40px;
}

.recipe-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
}

.recipe-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

/* 圖片容器 */
.image-container {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
  border: 2px dashed #81c784;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease;
}

.placeholder-text {
  color: #2e7d32;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
}

.recipe-card:hover .image-placeholder {
  background: linear-gradient(135deg, #c8e6c9 0%, #a5d6a7 100%);
  border-color: #66bb6a;
}

.rating-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(255, 255, 255, 0.9);
  color: #ff9800;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
}

.track-status {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(76, 175, 80, 0.9);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 卡片內容 */
.card-content {
  padding: 16px;
}

.dish-name {
  font-size: 18px;
  font-weight: bold;
  margin: 0 0 8px 0;
  color: #333;
}

.category-tag {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 8px;
}

.category-tag.vegetable {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.category-tag.leafy {
  background-color: #e3f2fd;
  color: #1976d2;
}

.category-tag.root {
  background-color: #fff3e0;
  color: #f57c00;
}

.dish-description {
  font-size: 14px;
  color: #666;
  line-height: 1.4;
  margin-bottom: 12px;
}

.nutrition-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
}

.nutrition-tag {
  background-color: #f0f0f0;
  color: #666;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
}

/* 價格區域 */
.price-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.price-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.price {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.price-change {
  font-size: 12px;
  font-weight: 500;
}

.price-change.price-up {
  color: #f44336;
}

.price-change.price-down {
  color: #4caf50;
}

.detail-btn {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.detail-btn:hover {
  background-color: #45a049;
}

/* 沒有資料 */
.no-data {
  text-align: center;
  padding: 60px 20px;
  color: #999;
  font-size: 16px;
}

/* 分頁控制 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin: 40px 0;
}

.page-btn {
  padding: 8px 16px;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  color: #666;
  cursor: pointer;
  border-radius: 6px;
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
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
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
  font-weight: bold;
}

/* 響應式調整 */
@media (max-width: 1200px) {
  .recipe-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .main-container {
    flex-direction: column;
    padding: 10px;
  }

  .sidebar-container {
    order: 2;
    margin-top: 20px;
    position: static;
  }

  .main-content {
    order: 1;
  }

  .category-sort-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}
</style>
