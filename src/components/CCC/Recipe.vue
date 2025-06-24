<template>
  <div class="ai-recommendation">
    <div class="page-container">
      <!-- 左側篩選面板 -->
      <div class="filter-sidebar">
        <!-- 特色篩選區塊 -->
        <div class="filter-section">
          <h3 class="filter-title">特色篩選</h3>
          <div class="filter-options">
            <label class="checkbox-item">
              <input type="checkbox" v-model="filters.antioxidant" />
              <span class="checkbox-label">抗氧化</span>
            </label>
            <label class="checkbox-item">
              <input type="checkbox" v-model="filters.supplement" />
              <span class="checkbox-label">補鈣佳品</span>
            </label>
            <label class="checkbox-item">
              <input type="checkbox" v-model="filters.eyecare" />
              <span class="checkbox-label">護眼明目</span>
            </label>
            <label class="checkbox-item">
              <input type="checkbox" v-model="filters.energy" />
              <span class="checkbox-label">運動能量</span>
            </label>
            <label class="checkbox-item">
              <input type="checkbox" v-model="filters.superFood" />
              <span class="checkbox-label">超級食物</span>
            </label>
          </div>
        </div>

        <!-- 價格區間滑桿 -->
        <div class="filter-section">
          <h3 class="filter-title">價格區間</h3>
          <div class="price-range">
            <div class="price-labels">
              <span>NT${{ priceRange[0] }}</span>
              <span>NT${{ priceRange[1] }}</span>
            </div>
            <div class="slider-container">
              <input
                type="range"
                min="0"
                max="200"
                v-model.number="priceRange[0]"
                @input="validatePriceRange"
              />
              <input
                type="range"
                min="0"
                max="200"
                v-model.number="priceRange[1]"
                @input="validatePriceRange"
              />
              <div class="slider-track"></div>
              <div class="slider-fill" :style="sliderFillStyle"></div>
            </div>
          </div>
          <button class="apply-btn">套用篩選</button>
        </div>

        <!-- 營養需求導航 -->
        <div class="filter-section nutrition-nav">
          <h3 class="filter-title">營養需求導航</h3>
          <div class="nutrition-tabs">
            <div
              v-for="tab in nutritionTabs"
              :key="tab.id"
              class="nutrition-tab"
              :class="{ active: activeNutritionTab === tab.id }"
              @click="activeNutritionTab = tab.id"
            >
              {{ tab.name }}
            </div>
          </div>
          <div class="nutrition-content">
            <div
              v-if="activeNutritionTab === 'vitaminA'"
              class="nutrition-items"
            >
              <div class="nutrition-item">
                <label class="checkbox-item">
                  <input type="checkbox" v-model="nutritionFilters.vitaminA" />
                  <span class="checkbox-label">維生素A</span>
                </label>
              </div>
            </div>
            <div
              v-if="activeNutritionTab === 'vitaminC'"
              class="nutrition-items"
            >
              <div class="nutrition-item">
                <label class="checkbox-item">
                  <input type="checkbox" v-model="nutritionFilters.vitaminC" />
                  <span class="checkbox-label">維生素C</span>
                </label>
              </div>
            </div>
            <div
              v-if="activeNutritionTab === 'minerals'"
              class="nutrition-items"
            >
              <div class="nutrition-item">
                <label class="checkbox-item">
                  <input type="checkbox" v-model="nutritionFilters.calcium" />
                  <span class="checkbox-label">鈣</span>
                </label>
              </div>
              <div class="nutrition-item">
                <label class="checkbox-item">
                  <input type="checkbox" v-model="nutritionFilters.iron" />
                  <span class="checkbox-label">鐵</span>
                </label>
              </div>
            </div>
            <div v-if="activeNutritionTab === 'others'" class="nutrition-items">
              <div class="nutrition-item">
                <label class="checkbox-item">
                  <input
                    type="checkbox"
                    v-model="nutritionFilters.antioxidant"
                  />
                  <span class="checkbox-label">抗氧化</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右側內容區 -->
      <div class="content-area">
        <!-- 頂部標題和搜尋欄 -->
        <div class="page-header">
          <h1>AI 智慧推薦</h1>
          <div class="search-bar">
            <input
              type="text"
              placeholder="AI推薦可查詢的料理>>"
              v-model="searchQuery"
            />
            <button class="search-btn" @click="searchRecipes">搜尋</button>
          </div>
        </div>

        <!-- 食物分類標籤列 -->
        <div class="food-category-section">
          <div class="category-left">食物分類</div>
          <div class="category-center">
            <button
              v-for="category in categories"
              :key="category.id"
              class="category-btn"
              :class="{ active: activeCategory === category.id }"
              @click="setCategory(category.id)"
            >
              {{ category.name }}
            </button>
          </div>
          <div class="category-right">
            更多分類 <span class="down-arrow">▼</span>
          </div>
        </div>

        <!-- AI 市場洞察區域 -->
        <div class="market-insight">
          <div class="insight-header">
            <span class="insight-icon">💡</span>
            <h3>AI 市場洞察</h3>
          </div>
          <p class="insight-content">
            根據最近市場趨勢，紅蘿蔔價格已連續三週下降，預計未來一週將回穩。建議現在是採購紅蘿蔔的好時機。
          </p>
        </div>

        <!-- 新的蔬菜卡片網格佈局 -->
        <div class="recipe-grid">
          <div
            class="recipe-card"
            v-for="dish in filteredDishes"
            :key="dish.id"
          >
            <!-- 圖片預留位置 -->
            <div class="image-placeholder">
              <span>🖼️ 圖片預留位置 🖼️</span>
            </div>

            <h3 class="recipe-title">{{ dish.name }}</h3>

            <div class="recipe-info">
              <span class="difficulty">{{ dish.difficulty }}</span>
              <span class="time">{{ dish.time }}</span>
            </div>

            <div class="recipe-tag" :class="dish.type">{{ dish.type }}</div>

            <div class="recipe-ingredients">
              食材: {{ dish.ingredients.slice(0, 3).join("、")
              }}{{ dish.ingredients.length > 3 ? "..." : "" }}
            </div>

            <a
              href="#"
              class="recipe-button"
              @click.prevent="viewRecipeDetails(dish.id)"
              >查看食譜</a
            >
          </div>
        </div>

        <!-- 分頁控制 -->
        <div class="pagination">
          <button
            class="pagination-btn prev"
            :disabled="currentPage === 1"
            @click="prevPage"
          >
            上一頁
          </button>
          <div class="page-numbers">
            <button
              v-for="page in totalPages"
              :key="page"
              class="page-number"
              :class="{ active: currentPage === page }"
              @click="goToPage(page)"
            >
              {{ page }}
            </button>
          </div>
          <button
            class="pagination-btn next"
            :disabled="currentPage === totalPages"
            @click="nextPage"
          >
            下一頁
          </button>
        </div>
      </div>
    </div>

    <!-- 頁腳區域 -->
    <footer class="site-footer">
      <div class="footer-container">
        <div class="footer-section">
          <h3>蔬果數據可視化平台</h3>
          <p>提供即時、準確的蔬果價格與資訊，讓消費者做出明智的購買決策。</p>
        </div>

        <div class="footer-section">
          <h3>快速連結</h3>
          <ul class="footer-links">
            <li><a href="#">關於我們</a></li>
            <li><a href="#">蔬果體驗活動</a></li>
            <li><a href="#">會員中心</a></li>
            <li><a href="#">聯絡我們</a></li>
          </ul>
        </div>

        <div class="footer-section">
          <h3>訂閱價格通知</h3>
          <div class="subscribe-form">
            <input type="email" placeholder="您的電子郵件" />
            <button type="submit">訂閱</button>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <p>© 2025 蔬果數據可視化平台. 保留所有權利。</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from "vue";
import { useRouter } from "vue-router";
import { recommendedDishes } from "@/data/AiRecommendation.js";

const router = useRouter();
const searchQuery = ref("");
const activeCategory = ref("all");
const currentPage = ref(1);
const itemsPerPage = 6; // 每頁顯示6個食譜
const totalPages = computed(() =>
  Math.ceil(filteredDishes.value.length / itemsPerPage)
);

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
  antioxidant: true, // 抗氧化
  supplement: true, // 補鈣佳品
  eyecare: false, // 護眼明目
  energy: false, // 運動能量
  superFood: false, // 超級食物
});

// 價格區間
const priceRange = ref([0, 200]);
const sliderFillStyle = computed(() => {
  const min = 0;
  const max = 200;
  const left = ((priceRange.value[0] - min) / (max - min)) * 100;
  const right = ((max - priceRange.value[1]) / (max - min)) * 100;
  return {
    left: left + "%",
    right: right + "%",
  };
});

// 確保最小值不大於最大值
const validatePriceRange = () => {
  if (priceRange.value[0] > priceRange.value[1]) {
    priceRange.value[0] = priceRange.value[1];
  }
};

// 營養需求選項卡
const activeNutritionTab = ref("vitaminA");
const nutritionTabs = [
  { id: "vitaminA", name: "維生素A" },
  { id: "vitaminC", name: "維生素C" },
  { id: "minerals", name: "礦食維他" },
  { id: "others", name: "鉀" },
];

// 營養需求篩選條件
const nutritionFilters = reactive({
  vitaminA: false,
  vitaminC: false,
  calcium: false,
  iron: false,
  antioxidant: false,
});

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

  // TODO: 加入特色篩選、價格篩選和營養篩選的邏輯
  // 這裡可以根據 filters, priceRange 和 nutritionFilters 的值進行篩選
  // 例如：
  // if (filters.antioxidant) {
  //   dishes = dishes.filter(dish => dish.features.includes('antioxidant'));
  // }

  return dishes;
});

// 當前頁面的菜餚
const filteredDishes = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return allFilteredDishes.value.slice(start, end);
});

// 設定分類
const setCategory = (categoryId) => {
  activeCategory.value = categoryId;
  // 切換分類時重置頁碼
  currentPage.value = 1;
};

// 搜尋功能
const searchRecipes = () => {
  // 搜尋時重置頁碼
  currentPage.value = 1;
};

// 查看食譜詳情
const viewRecipeDetails = (recipeId) => {
  router.push(`/recipes/${recipeId}`);
};

// 分頁功能
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

// 初始化時從URL參數獲取分類
onMounted(() => {
  const categoryParam = router.currentRoute.value.query.category;
  if (categoryParam && categories.some((c) => c.id === categoryParam)) {
    activeCategory.value = categoryParam;
  } else {
    // 預設選中"全部"
    activeCategory.value = "all";
  }
});
</script>

<style scoped>
.ai-recommendation {
  padding: 20px 0;
}

.page-container {
  display: flex;
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 左側篩選面板 */
.filter-sidebar {
  width: 280px;
  flex-shrink: 0;
}

.filter-section {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 16px;
  margin-bottom: 20px;
}

.filter-title {
  color: #2e7d32;
  font-size: 18px;
  margin-top: 0;
  margin-bottom: 16px;
  font-weight: 500;
}

.filter-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* 多選框樣式 */
.checkbox-item {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.checkbox-item input[type="checkbox"] {
  margin-right: 8px;
  width: 18px;
  height: 18px;
  accent-color: #2196f3;
}

.checkbox-label {
  font-size: 14px;
}

/* 價格滑桿樣式 */
.price-range {
  margin-bottom: 16px;
}

.price-labels {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
}

.slider-container {
  position: relative;
  height: 40px;
}

.slider-container input[type="range"] {
  position: absolute;
  width: 100%;
  height: 5px;
  background: none;
  pointer-events: none;
  -webkit-appearance: none;
  appearance: none;
}

.slider-container input[type="range"]::-webkit-slider-thumb {
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #2196f3;
  cursor: pointer;
  pointer-events: auto;
  -webkit-appearance: none;
  margin-top: -8px;
}

.slider-track {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  height: 4px;
  width: 100%;
  background: #ddd;
  border-radius: 4px;
}

.slider-fill {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  height: 4px;
  background: #2196f3;
  border-radius: 4px;
}

.apply-btn {
  width: 100%;
  background-color: #2e7d32;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 0;
  font-size: 16px;
  cursor: pointer;
}

/* 營養需求導航 */
.nutrition-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.nutrition-tab {
  padding: 8px 16px;
  background: #f5f5f5;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

.nutrition-tab.active {
  background: #2196f3;
  color: white;
}

.nutrition-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* 右側內容區 */
.content-area {
  flex: 1;
}

/* 頁面標題和搜尋區 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

h1 {
  font-size: 24px;
  margin: 0;
  color: #333;
}

.search-bar {
  display: flex;
  align-items: center;
}

.search-bar input {
  height: 36px;
  padding: 0 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 10px;
  min-width: 300px;
}

.search-btn {
  background-color: #59c2b9;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
}

/* 分類選項樣式 */
.food-category-section {
  display: flex;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

.category-left {
  font-weight: bold;
  margin-right: 20px;
  padding: 8px 0;
  min-width: 80px;
}

.category-center {
  display: flex;
  gap: 10px;
  flex: 1;
}

.category-btn {
  background: none;
  border: none;
  padding: 8px 16px;
  cursor: pointer;
  border-radius: 4px;
}

.category-btn.active {
  background-color: #59c2b9;
  color: white;
}

.category-right {
  color: #59c2b9;
  display: flex;
  align-items: center;
  padding: 8px 16px;
  cursor: pointer;
}

.down-arrow {
  font-size: 12px;
  margin-left: 5px;
}

/* AI 市場洞察區域 */
.market-insight {
  background-color: #f1f8e9;
  border-left: 4px solid #4caf50;
  padding: 16px;
  margin-bottom: 24px;
  border-radius: 0 4px 4px 0;
}

.insight-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.insight-icon {
  font-size: 20px;
  margin-right: 8px;
}

.insight-header h3 {
  margin: 0;
  font-size: 18px;
  color: #2e7d32;
}

.insight-content {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  color: #444;
}

/* 食譜卡片網格 */
.recipe-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.recipe-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
  padding: 0 0 20px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.recipe-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
}

/* 圖片預留位置 */
.image-placeholder {
  height: 180px;
  background-color: #e8f5e9; /* 使用淺綠色背景突出顯示 */
  border: 2px dashed #59c2b9; /* 添加虛線邊框 */
  display: flex;
  justify-content: center;
  align-items: center;
  color: #2e7d32; /* 更改文字顏色為綠色 */
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 15px;
}

.recipe-title {
  font-size: 18px;
  font-weight: bold;
  margin: 0 0 10px;
  padding: 0 20px;
  color: #333;
}

.recipe-info {
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
  margin-bottom: 10px;
  color: #666;
  font-size: 14px;
}

.recipe-tag {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 15px;
  color: white;
  font-size: 13px;
  margin: 0 20px 10px;
}

.dish1 {
  background-color: #4caf50;
}

.dish2 {
  background-color: #ff9800;
}

.dish3 {
  background-color: #f44336;
}

.recipe-ingredients {
  padding: 0 20px;
  margin-bottom: 15px;
  color: #555;
  font-size: 14px;
}

.recipe-button {
  display: block;
  width: calc(100% - 40px);
  margin: 0 20px;
  padding: 8px 0;
  text-align: center;
  background: none;
  border: 1px solid #4caf50;
  color: #4caf50;
  border-radius: 4px;
  text-decoration: none;
  font-size: 14px;
  transition: all 0.3s;
}

.recipe-button:hover {
  background: #4caf50;
  color: white;
}

/* 分頁控制 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 30px 0;
}

.pagination-btn {
  padding: 8px 16px;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  color: #333;
  cursor: pointer;
  border-radius: 4px;
}

.pagination-btn:disabled {
  color: #ccc;
  cursor: not-allowed;
}

.pagination-btn.prev {
  margin-right: 10px;
}

.pagination-btn.next {
  margin-left: 10px;
}

.page-numbers {
  display: flex;
  gap: 5px;
}

.page-number {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: none;
  cursor: pointer;
}

.page-number.active {
  background-color: #59c2b9;
  color: white;
  border-color: #59c2b9;
}

/* 頁腳樣式 */
.site-footer {
  background-color: #222;
  color: #fff;
  padding: 40px 0 20px;
  margin-top: 50px;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
  padding: 0 20px;
}

.footer-section h3 {
  font-size: 18px;
  margin-top: 0;
  margin-bottom: 20px;
  font-weight: 500;
}

.footer-section p {
  font-size: 14px;
  line-height: 1.6;
  color: #aaa;
  margin: 0;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 10px;
}

.footer-links a {
  color: #aaa;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s;
}

.footer-links a:hover {
  color: #fff;
}

.subscribe-form {
  display: flex;
  margin-top: 10px;
}

.subscribe-form input {
  flex-grow: 1;
  padding: 10px;
  border: none;
  border-radius: 4px 0 0 4px;
  outline: none;
}

.subscribe-form button {
  background-color: #2e7d32;
  color: white;
  border: none;
  border-radius: 0 4px 4px 0;
  padding: 10px 15px;
  cursor: pointer;
}

.footer-bottom {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
  padding-top: 20px;
  margin-top: 30px;
  border-top: 1px solid #444;
  font-size: 12px;
  color: #888;
}

/* 手機版適配 */
@media (max-width: 992px) {
  .recipe-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .page-container {
    flex-direction: column;
  }

  .filter-sidebar {
    width: 100%;
    order: 2;
  }

  .content-area {
    order: 1;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .search-bar {
    width: 100%;
    margin-top: 10px;
  }

  .search-bar input {
    flex-grow: 1;
    min-width: unset;
  }

  .food-category-section {
    flex-direction: column;
  }

  .category-center {
    overflow-x: auto;
    margin: 10px 0;
    padding-bottom: 5px;
  }

  .category-right {
    align-self: flex-end;
  }

  .recipe-grid {
    grid-template-columns: 1fr;
  }

  .footer-container {
    grid-template-columns: 1fr;
    gap: 30px;
  }
}

@media (max-width: 576px) {
  .recipe-grid {
    grid-template-columns: 1fr;
  }

  .pagination {
    flex-wrap: wrap;
  }

  .page-numbers {
    margin: 10px 0;
  }
}
</style>
