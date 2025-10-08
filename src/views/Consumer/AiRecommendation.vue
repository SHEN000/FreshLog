<template>
  <div class="ai-recommendation">
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
          <p>🔄 載入中...</p>
        </div>

        <!-- 食譜卡片網格 -->
        <div v-else class="recipe-grid">
          <div
            class="recipe-card"
            v-for="dish in paginatedDishes"
            :key="dish.id"
          >
            <!-- 圖片區域 -->
            <div class="image-container">
              <img
                :src="$img(dish.image)"
                :alt="dish.name"
                class="dish-image"
              />
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
                <button class="detail-btn" @click="viewRecipeDetails(dish.id)">
                  詳細資訊
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 沒有資料時的顯示 -->
        <div v-if="!isLoading && paginatedDishes.length === 0" class="no-data">
          <p>目前沒有符合條件的食譜</p>
        </div>

        <!-- 分頁控制 -->
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

    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from "vue";
import { useRouter } from "vue-router";
import { foodApi } from "@/api/food.js";

// 引入子元件
import FilterSidebar from "@/components/CCC/Sidebar.vue";
import CategoryTabs from "@/components/CCC/CategoryTag.vue";
import MarketInsight from "@/components/CCC/MarketSight.vue";

const router = useRouter();

// ==================== 基本狀態 ====================
const activeCategory = ref("all");
const currentPage = ref(1);
const itemsPerPage = 6;
const isLoading = ref(true);
const currentSort = ref("PRICE_DESC");

// ==================== 資料 ====================
const allDishes = ref([]);
const sortOptions = ref([]);

// ==================== 篩選條件 ====================
const filters = reactive({
  antioxidant: false,
  supplement: false,
  eyecare: false,
  energy: false,
  superFood: false,
});

const priceRange = ref([0, 200]);

const nutritionFilters = reactive({
  vitaminA: false,
  vitaminC: false,
  calcium: false,
  iron: false,
  antioxidant: false,
});

const activeNutritionTab = ref("");

// ==================== 分類選項 ====================
const categories = [
  { id: "all", name: "全部" },
  { id: "agricultural", name: "農產品" },
  { id: "vegetable", name: "蔬菜" },
  { id: "fruit", name: "水果" },
  { id: "leafy", name: "葉菜類" },
  { id: "root", name: "根莖類" },
  { id: "other", name: "其他" },
];

// ==================== 分類映射 ====================
const getCategoryMapping = (category) => {
  const mapping = {
    vegetable: "蔬菜",
    fruit: "水果",
    leafy: "葉菜類",
    root: "根莖類",
    other: "其他",
    agricultural: "農產品",
  };
  return mapping[category] || category;
};

// ==================== 載入資料（核心函數）====================
const loadData = async () => {
  isLoading.value = true;

  try {
    console.log("========================================");
    console.log("🔄 開始載入資料");
    console.log("📍 當前分類:", activeCategory.value);
    console.log("📍 當前排序:", currentSort.value);
    console.log("📍 價格區間:", priceRange.value);
    console.log("========================================");

    // ===== 1. 載入排序選項 =====
    try {
      const sortResponse = await foodApi.getFoodSortEnums();

      if (sortResponse.data?.code === "0000" && sortResponse.data?.data) {
        sortOptions.value = sortResponse.data.data;
        console.log("✅ 排序選項載入成功:", sortOptions.value.length, "個選項");
      }
    } catch (sortError) {
      console.warn("⚠️ 排序選項載入失敗,使用預設值");
      sortOptions.value = [
        { code: "PRICE_DESC", label: "價格高到低" },
        { code: "PRICE_ASC", label: "價格低到高" },
        { code: "SEASONAL", label: "產季由近到遠" },
      ];
    }

    // ===== 2. 準備查詢參數 =====
    // Request Body 參數
    const filterParams = {
      category:
        activeCategory.value !== "all"
          ? String(getCategoryMapping(activeCategory.value))
          : null,
      subCategory: null,
      name: null,
      nameEn: null,
      priceMin: Number(Math.min(priceRange.value[0], priceRange.value[1])) || 0,
      priceMax:
        Number(Math.max(priceRange.value[0], priceRange.value[1])) || 1000,
      tag: null,
      sort: String(currentSort.value || "PRICE_DESC").trim(), // Body 的 sort (enum)
    };

    // Query Parameters（分頁參數）
    const paginationParams = {
      pageNo: 0,
      pageSize: 20,
    };

    if (filterParams.category) {
      console.log("📂 指定分類查詢:", filterParams.category);
    } else {
      console.log("📂 查詢所有分類 (category: null)");
    }

    console.log("========================================");
    console.log("📤 Request Body (filterParams):");
    console.log(JSON.stringify(filterParams, null, 2));
    console.log("📤 Query Params (paginationParams):");
    console.log(JSON.stringify(paginationParams, null, 2));
    console.log("========================================");

    // ===== 3. 發送 API 請求 =====
    const foodResponse = await foodApi.findFoodsList(
      filterParams,
      paginationParams
    );

    // 🆕 超詳細的回應日誌
    console.log("========================================");
    console.log("📥 API Response 完整內容:");
    console.log("📍 Response Object:", foodResponse);
    console.log("📍 Response.data:", foodResponse.data);
    console.log("📍 Response.data type:", typeof foodResponse.data);
    console.log("📍 Response.data.code:", foodResponse.data?.code);
    console.log("📍 Response.data.message:", foodResponse.data?.message);
    console.log("📍 Response.data.data:", foodResponse.data?.data);
    console.log("📍 Response.data.data type:", typeof foodResponse.data?.data);

    // 🔍 檢查 data 的結構
    if (foodResponse.data?.data) {
      const dataObj = foodResponse.data.data;
      console.log("📊 Data 物件的所有 keys:", Object.keys(dataObj));
      console.log("📊 是否有 content?", "content" in dataObj);
      console.log("📊 content 的值:", dataObj.content);
      console.log("📊 content 的類型:", typeof dataObj.content);
      console.log("📊 content 是陣列?", Array.isArray(dataObj.content));
      console.log("📊 content 長度:", dataObj.content?.length);

      if (Array.isArray(dataObj.content) && dataObj.content.length > 0) {
        console.log("📊 第一筆資料範例:", dataObj.content[0]);
      }
    }
    console.log("========================================");

    // ===== 4. 處理回應 =====
    let foodList = null;
    let responseData = null;

    if (foodResponse.code === "0000" || foodResponse.data?.code === "0000") {
      // 格式 1: 直接是陣列 (Mock 資料常見)
      if (Array.isArray(foodResponse.data)) {
        foodList = foodResponse.data;
        responseData = {
          pageNo: 0,
          pageSize: foodResponse.data.length,
          totalElements: foodResponse.data.length,
          totalPages: 1,
        };
        console.log("✅ 使用格式 1: response.data 直接是陣列");
      }
      // 格式 2: 標準分頁格式 response.data.data.content
      else if (foodResponse.data?.data?.content) {
        foodList = foodResponse.data.data.content;
        responseData = foodResponse.data.data;
        console.log("✅ 使用格式 2: response.data.data.content (標準分頁)");
      }
      // 格式 3: response.data.content
      else if (foodResponse.data?.content) {
        foodList = foodResponse.data.content;
        responseData = foodResponse.data;
        console.log("✅ 使用格式 3: response.data.content");
      }
      // 格式 4: response.content
      else if (foodResponse.content) {
        foodList = foodResponse.content;
        responseData = foodResponse;
        console.log("✅ 使用格式 4: response.content");
      }
    }

    if (foodList && Array.isArray(foodList) && foodList.length > 0) {
      console.log("📊 分頁資訊:", {
        pageNo: responseData?.pageNo,
        pageSize: responseData?.pageSize,
        totalElements: responseData?.totalElements,
        totalPages: responseData?.totalPages,
      });

      if (Array.isArray(foodList) && foodList.length > 0) {
        allDishes.value = foodList.map((item) => ({
          id: item.foodId,
          name: item.name,
          price: item.price || 50,
          type: item.category,
          ingredients: item.tag
            ? item.tag.split("/").filter((t) => t.trim())
            : ["新鮮", "營養"],
          description: item.description || `新鮮的${item.name},營養豐富`,
          image: item.image,
          lastModifyDate: item.lastModifyDate,
          isRecommendation: item.inSeason || item.affordable,
          _raw: item, // 🆕 保留原始資料以便除錯
        }));

        console.log("✅ 食物列表載入成功:", allDishes.value.length, "個項目");

        // 統計分類分布
        const categoryStats = {};
        allDishes.value.forEach((dish) => {
          categoryStats[dish.type] = (categoryStats[dish.type] || 0) + 1;
        });
        console.log("📊 分類統計:", categoryStats);

        // 前 3 筆資料
        console.log("📋 前 3 筆資料預覽:");
        allDishes.value.slice(0, 3).forEach((dish, index) => {
          console.log(
            `  ${index + 1}. ${dish.name} - ${dish.type} - NT${dish.price}`
          );
        });
      } else {
        console.warn("⚠️ foodList 陣列為空");
        allDishes.value = [];
      }
    } else {
      console.error("❌ 無法找到 content 陣列");
      console.error("回應結構:", {
        hasFoodResponse: !!foodResponse,
        hasData: !!foodResponse.data,
        dataCode: foodResponse.data?.code,
        hasDataData: !!foodResponse.data?.data,
        hasContent:
          !!foodResponse.data?.data?.content ||
          !!foodResponse.data?.content ||
          !!foodResponse.content,
      });
      allDishes.value = [];
    }
  } catch (error) {
    console.error("========================================");
    console.error("❌ 載入資料失敗");
    console.error("錯誤類型:", error.name);
    console.error("錯誤訊息:", error.message);
    console.error("HTTP 狀態:", error.response?.status);
    console.error("回應資料:", error.response?.data);
    console.error("完整錯誤:", error);
    console.error("========================================");

    allDishes.value = [];

    // 錯誤提示
    if (!error.response) {
      console.error("💥 網絡連接錯誤");
    } else if (error.response.status === 500) {
      console.error("💥 伺服器內部錯誤 (500)");
    } else if (error.response.status === 400) {
      console.error("💥 請求參數錯誤 (400)");
    }
  } finally {
    isLoading.value = false;
    console.log("========================================");
    console.log("🏁 資料載入完成");
    console.log("📊 最終資料數量:", allDishes.value.length);
    console.log("========================================");
  }
};

// ==================== 計算屬性 ====================
const filteredDishes = computed(() => {
  let filtered = [...allDishes.value];

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

  // 營養篩選
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

// ==================== 輔助函數 ====================
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
    水果: "fruit",
  };
  return typeMap[type] || "vegetable";
};

const getPriceChangeClass = () => {
  return Math.random() > 0.5 ? "price-up" : "price-down";
};

const getPriceChangeText = () => {
  return Math.random() > 0.5 ? "▲1.5%" : "▼0.2%";
};

// ==================== 事件處理 ====================
const setCategory = async (categoryId) => {
  console.log("📂 切換分類:", categoryId);
  activeCategory.value = categoryId;
  currentPage.value = 1;
  await loadData();
};

const handleSortChange = async (newSort) => {
  console.log("🔄 變更排序:", newSort);
  currentSort.value = String(newSort || "PRICE_DESC").trim();
  currentPage.value = 1;
  await loadData();
};

const updateFilters = (newFilters) => {
  Object.assign(filters, newFilters);
  currentPage.value = 1;
};

const updatePriceRange = async (newRange) => {
  priceRange.value = newRange;
  currentPage.value = 1;
  await loadData();
};

const updateNutritionFilters = (newFilters) => {
  Object.assign(nutritionFilters, newFilters);
  currentPage.value = 1;
};

const updateNutritionTab = (tab) => {
  activeNutritionTab.value = tab;
};

const viewRecipeDetails = async (recipeId) => {
  try {
    const response = await foodApi.findFoodData(recipeId);
    if (response && response.code === "8000" && response.data) {
      localStorage.setItem(`recipe_${recipeId}`, JSON.stringify(response.data));
    }
  } catch (error) {
    console.error("載入食譜詳情失敗:", error);
  }

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

// ==================== 初始化 ====================
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

.main-container {
  display: flex;
  gap: 20px;
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  background-color: white;
}

.sidebar-container {
  flex: 0 0 280px;
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  height: fit-content;
  position: sticky;
  top: 20px;
}

.main-content {
  flex: 1;
  min-width: 0;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  font-size: 18px;
}

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

.image-container {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.dish-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
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

.category-tag.fruit {
  background-color: #fce4ec;
  color: #c2185b;
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

.no-data {
  text-align: center;
  padding: 60px 20px;
  color: #999;
  font-size: 16px;
}

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
}
</style>
