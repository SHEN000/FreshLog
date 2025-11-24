<template>
  <div class="ai-recommendation">
    <!-- 主要容器 -->
    <div class="main-container">
      <!-- 左側篩選欄 -->
      <div class="sidebar-container">
        <FilterSidebar
          :filters="filters"
          :priceRange="priceRange"
          @update-filters="updateFilters"
          @update-price-range="updatePriceRange"
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
          :otherCategories="otherCategories"
          @set-category="setCategory"
          @set-subcategory="setSubCategory"
          @sort-change="handleSortChange"
        />

        <!-- 手機版條件篩選區域 -->
        <div class="mobile-filter-area">
          <!-- 條件篩選按鈕 -->
          <button class="mobile-filter-toggle" @click="toggleMobileFilter">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 4h12M4 8h8M6 12h4"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
            <span>條件篩選</span>
            <svg
              class="toggle-icon"
              :class="{ open: showMobileFilter }"
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 5l3 3 3-3"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>

          <!-- 篩選面板（可展開/收合）-->
          <div class="mobile-filter-panel" :class="{ show: showMobileFilter }">
            <FilterSidebar
              :filters="filters"
              :priceRange="priceRange"
              @update-filters="updateFilters"
              @update-price-range="updatePriceRange"
            />
          </div>
        </div>

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
                @error="handleImageError"
              />
              <!-- 評分標籤 -->
              <div class="rating-badge">★★★</div>
              <!-- 當季標籤 (只在 inSeason 為 true 時顯示) -->
              <div v-if="dish.inSeason" class="season-badge">
                <span class="season-icon">🌱</span>
                <span>當季</span>
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
                  v-for="tag in dish.ingredients"
                  :key="tag"
                  class="nutrition-tag"
                >
                  {{ tag }}
                </span>
              </div>

              <!-- AI 建議（顯示前兩條） -->
              <div
                class="ai-recommendations"
                v-if="dish.aiRecommendations && dish.aiRecommendations.length"
              >
                <ul>
                  <li
                    v-for="(rec, idx) in dish.aiRecommendations.slice(0, 2)"
                    :key="idx"
                    class="ai-reco"
                  >
                    {{ rec }}
                  </li>
                </ul>
              </div>

              <!-- 主要好處（以 pill 顯示，最多 3 個） -->
              <div
                class="benefits"
                v-if="dish.benefits && dish.benefits.length"
              >
                <ul class="benefits-list-inline">
                  <li
                    v-for="(b, idx) in dish.benefits.slice(0, 3)"
                    :key="idx"
                    class="benefit-item"
                  >
                    {{ b }}
                  </li>
                </ul>
              </div>

              <!-- 價格區域 -->
              <div class="price-section">
                <div class="price-info">
                  <span class="price">NT${{ dish.price }}/台斤</span>
                  <span
                    class="price-change"
                    :class="getPriceChangeClass(dish.priceChangePct)"
                    data-tooltip="相較上週價格變化"
                  >
                    {{ getPriceChangeText(dish.priceChangePct) }}
                  </span>
                </div>
                <div class="price-date" v-if="dish.priceDateDisplay">
                  <div class="price-date-label">價格日期：</div>
                  <div class="price-date-value">
                    {{ dish.priceDateDisplay }}
                  </div>
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
          <p>目前沒有符合條件的食材</p>
          <p class="no-data-hint">
            提示: 當前分類下的資料可能尚未補充，請嘗試選擇其他分類
          </p>
        </div>

        <!-- 分頁控制 -->
        <div v-if="totalPages > 1" class="pagination">
          <button
            class="page-btn prev-btn"
            :disabled="currentPage === 1"
            @click="prevPage"
          >
            上一頁
          </button>

          <button
            v-for="page in displayPages"
            :key="page"
            :class="['page-number', { active: currentPage === page }]"
            @click="goToPage(page)"
          >
            {{ page }}
          </button>

          <button
            class="page-btn next-btn"
            :disabled="currentPage === totalPages"
            @click="nextPage"
          >
            下一頁
          </button>
        </div>

        <!-- 頁數摘要 -->
        <div v-if="totalPages > 1" class="page-summary">
          第 {{ currentPage }} / {{ totalPages }} 頁
        </div>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, reactive, watch } from "vue";
import { useRouter } from "vue-router";
import { foodApi } from "@/api/food.js";
import { request } from "@/api/client.js";

// 引入子元件
import FilterSidebar from "@/components/CCC/Sidebar.vue";
import CategoryTabs from "@/components/CCC/CategoryTag.vue";
import MarketInsight from "@/components/CCC/MarketSight.vue";

// 引入預設圖片
import defaultVeggieImage from "@/assets/default-veggie.png";

const router = useRouter();

// ==================== 基本狀態 ====================
const activeCategory = ref("all");
const currentPage = ref(1);
const itemsPerPage = 6;
const isLoading = ref(true);
const currentSort = ref("SEASONAL"); // 🔧 改為 SEASONAL（產季由近到遠）

// ==================== 資料 ====================
const allDishes = ref([]);
const sortOptions = ref([]);

// ==================== 篩選條件 ====================
const filters = reactive({
  heatClearing: false,
  nutritious: false,
  antioxidant: false,
  eyecare: false,
  sweet: false,
  vitaminC: false,
  highProtein: false,
  aromatic: false,
  lowCalorie: false,
  coolingSummer: false,
  calcium: false,
  healthy: false,
  highFiber: false,
  thirstQuenching: false,
  beauty: false,
  summer: false,
  allSeason: false,
});

const priceRange = ref([0, 200]);

// 手機版篩選面板顯示狀態
const showMobileFilter = ref(false);

// 切換手機版篩選面板
const toggleMobileFilter = () => {
  showMobileFilter.value = !showMobileFilter.value;
};

// 新增：名稱搜尋欄位狀態與處理
const inputRaw = ref("");
const name = ref(null);
const nameEn = ref(null);
let nameDebounce = null;
const NAME_DEBOUNCE_MS = 400;

const isLikelyEnglish = (s) => {
  if (!s) return false;
  const hasLatin = /[A-Za-z]/.test(s);
  const hasCJK = /[\u4e00-\u9fff\u3400-\u4dbf\u3000-\u303f]/.test(s);
  return hasLatin && !hasCJK;
};

const onRawNameInput = () => {
  if (nameDebounce) clearTimeout(nameDebounce);
  nameDebounce = setTimeout(async () => {
    const v = (inputRaw.value || "").trim();
    if (!v) {
      name.value = null;
      nameEn.value = null;
    } else if (isLikelyEnglish(v)) {
      nameEn.value = v;
      name.value = null;
    } else {
      name.value = v;
      nameEn.value = null;
    }
    currentPage.value = 1;
    await loadData();
    nameDebounce = null;
  }, NAME_DEBOUNCE_MS);
};

onUnmounted(() => {
  if (nameDebounce) clearTimeout(nameDebounce);
});

// ==================== 子分類選項 ====================
const allSubCategories = ref([]);

// 注意：這些 subCategory 必須與後端 API 回傳的子分類名稱完全一致
const mainCategories = [
  { id: "all", name: "未分類", subCategory: "未分類" }, // 🔧 使用"未分類"（從"其他"下拉選單驗證可用）
  { id: "leafy", name: "葉菜類", subCategory: "葉菜類" },
  { id: "root", name: "根莖類", subCategory: "根莖類" },
  { id: "grain", name: "雜糧類", subCategory: "雜糧類" },
  { id: "other", name: "其他", subCategory: "other" },
];

const categories = ref(mainCategories);

// 🔧 其他分類（不在主按鈕列的）
const otherCategories = ref([]);

// 🔧 是否顯示「其他」下拉選單
const showOtherDropdown = ref(false);

// ==================== 載入資料（核心函數）====================
const loadData = async () => {
  isLoading.value = true;

  try {
    // ===== 1. 載入排序選項 =====
    try {
      const sortResponse = await foodApi.getFoodSortEnums();

      if (sortResponse.data?.code === "0000" && sortResponse.data?.data) {
        sortOptions.value = sortResponse.data.data;
      }
    } catch (sortError) {
      sortOptions.value = [
        { code: "SEASONAL", label: "產季由近到遠" },
        { code: "PRICE_DESC", label: "價格高到低" },
        { code: "PRICE_ASC", label: "價格低到高" },
      ];
    }

    if (allSubCategories.value.length === 0) {
      try {
        const subCatResponse = await foodApi.getFoodSubCategories("");
        // normalize various possible response shapes into an array of strings
        let subCats = [];

        // case A: response.data is array
        if (Array.isArray(subCatResponse?.data)) {
          subCats = subCatResponse.data;
        }

        // case B: response.data.data is array (standard paged wrapper)
        else if (Array.isArray(subCatResponse?.data?.data)) {
          subCats = subCatResponse.data.data;
        }

        // case C: response.data.content is array
        else if (Array.isArray(subCatResponse?.data?.content)) {
          subCats = subCatResponse.data.content;
        }

        // case D: response.data?.data?.content is array (nested)
        else if (Array.isArray(subCatResponse?.data?.data?.content)) {
          subCats = subCatResponse.data.data.content;
        }

        // case E: sometimes backend returns { code, data: ['a','b'] }
        else if (
          subCatResponse?.data?.code === "0000" &&
          Array.isArray(subCatResponse.data.data)
        ) {
          subCats = subCatResponse.data.data;
        }

        // fallback: if data.payload is an object map, extract keys or values
        else if (
          subCatResponse?.data &&
          typeof subCatResponse.data === "object"
        ) {
          // try to extract arrays from properties
          const candidates = Object.values(subCatResponse.data).filter((v) =>
            Array.isArray(v)
          );
          if (candidates.length > 0) subCats = candidates[0];
        }

        // ensure array of strings
        if (!Array.isArray(subCats)) subCats = [];
        // flatten and filter
        subCats = subCats
          .flat()
          .map((s) => (s && s.name ? s.name : s))
          .filter(Boolean);

        allSubCategories.value = subCats;

        // 計算「其他」分類（排除已在主按鈕列的）
        const mainSubCategories = mainCategories
          .map((c) => c.subCategory)
          .filter(Boolean);
        otherCategories.value = allSubCategories.value.filter(
          (subCat) =>
            !mainSubCategories.includes(subCat) && subCat !== "其他作物"
        );
      } catch (subCatError) {
        console.error("⚠️ 子分類查詢失敗:", subCatError.message);
      }
    }

    // ===== 2. 準備查詢參數 =====
    // Request Body 參數
    // 🔧 價格範圍：如果滑桿在預設位置 [0, 200]，就不限制價格
    const isDefaultPriceRange =
      priceRange.value[0] === 0 && priceRange.value[1] === 200;

    // 🔧 根據當前分類取得對應的 subCategory
    let querySubCategory = null;

    // 檢查是否是從「其他」選單選的子分類
    if (activeCategory.value.startsWith("other-")) {
      querySubCategory = activeCategory.value.replace("other-", "");
    } else {
      // 從 mainCategories 中查找對應的分類配置
      const currentCategory = mainCategories.find(
        (c) => c.id === activeCategory.value
      );

      if (currentCategory) {
        querySubCategory =
          currentCategory.subCategory === "other"
            ? null
            : currentCategory.subCategory || null;
      }
    }

    const filterParams = {
      category: null,
      subCategory: querySubCategory,
      name: name.value || null,
      nameEn: nameEn.value || null,
      priceMin: isDefaultPriceRange
        ? 0
        : Number(Math.min(priceRange.value[0], priceRange.value[1])),
      priceMax: isDefaultPriceRange
        ? 999999
        : Number(Math.max(priceRange.value[0], priceRange.value[1])),
      tag: null,
      sort: currentSort.value || "SEASONAL", // 預設值
    };

    // Query Parameters（分頁參數）
    const paginationParams = {
      pageNo: 0,
      pageSize: 200, // 統一使用 200
    };

    // ===== 3. 發送 API 請求 =====
    const foodResponse = await foodApi.findFoodsList(
      filterParams,
      paginationParams
    );

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
      }
      // 格式 2: 標準分頁格式 response.data.data.content
      else if (
        foodResponse.data?.data?.content !== undefined &&
        Array.isArray(foodResponse.data.data.content)
      ) {
        foodList = foodResponse.data.data.content;
        responseData = foodResponse.data.data;
      }
      // 格式 3: response.data.content
      else if (
        foodResponse.data?.content !== undefined &&
        Array.isArray(foodResponse.data.content)
      ) {
        foodList = foodResponse.data.content;
        responseData = foodResponse.data;
      }
      // 格式 4: response.content
      else if (
        foodResponse.content !== undefined &&
        Array.isArray(foodResponse.content)
      ) {
        foodList = foodResponse.content;
        responseData = foodResponse;
      }
      // 格式 5: response.data.data 本身就是陣列
      else if (Array.isArray(foodResponse.data?.data)) {
        foodList = foodResponse.data.data;
        responseData = {
          pageNo: 0,
          pageSize: foodResponse.data.data.length,
          totalElements: foodResponse.data.data.length,
          totalPages: 1,
        };
      } else {
        console.error("❌ 無法識別的回應格式");
        // 🔧 即使無法識別格式，也初始化為空陣列避免錯誤
        foodList = [];
        responseData = {
          pageNo: 0,
          pageSize: 0,
          totalElements: 0,
          totalPages: 0,
        };
      }
    }

    if (foodList && Array.isArray(foodList) && foodList.length > 0) {
      if (Array.isArray(foodList) && foodList.length > 0) {
        // 🔧 過濾假資料 (F 開頭的 foodId)
        const originalCount = foodList.length;
        const fakeDataItems = foodList.filter((item) => {
          const foodId = item.foodId || "";
          return /^F\d+$/i.test(foodId); // F 後面接數字的是假資料
        });

        foodList = foodList.filter((item) => {
          const foodId = item.foodId || "";
          const isFakeData = /^F\d+$/i.test(foodId);
          return !isFakeData;
        });

        const filteredCount = foodList.length;

        // 不做去重，直接使用後端回傳的 foodList
        // 並在前端依 priceDate 由新到舊排序，及計算同 foodId 前一次價格的百分比差異

        // safe JSON parse helper for fields that may be strings or arrays
        const safeParse = (v) => {
          if (!v && v !== 0) return [];
          if (Array.isArray(v)) return v.filter(Boolean);
          if (typeof v === "string") {
            try {
              const parsed = JSON.parse(v);
              if (Array.isArray(parsed)) return parsed.filter(Boolean);
            } catch (e) {
              // fallback: split by common separators
              return v
                .replace(/^\s*\[|\]\s*$/g, "")
                .replace(/^"|"$|^'|'$/g, "")
                .split(/","|','|,|;|\n|\uff1b|\|/g)
                .map((s) => s.replace(/^"|"$|^'|'$/g, "").trim())
                .filter(Boolean);
            }
          }
          return [];
        };

        const parseDateTs = (d) => {
          if (!d) return 0;
          const ts = Date.parse(d);
          return isNaN(ts) ? 0 : ts;
        };

        const formatDateStr = (d) => {
          if (!d) return "";
          const dt = new Date(d);
          if (isNaN(dt)) return String(d);
          const y = dt.getFullYear();
          const m = String(dt.getMonth() + 1).padStart(2, "0");
          const dd = String(dt.getDate()).padStart(2, "0");
          return `${y}/${m}/${dd}`;
        };

        // 先做基本映射
        const mappedList = foodList.map((item) => {
          // 🔧 先解析 aiRecommendations
          const aiRecommendationsArray = safeParse(item.aiRecommendations);

          // 🔧 嘗試多個可能的價格欄位
          let priceNum = Number(
            item.price ??
              item.avgPrice ??
              item.averagePrice ??
              item.currentPrice ??
              item.latestPrice ??
              item.marketPrice ??
              0
          );

          // 🔧 不在初始載入時提取 AI 價格，保持為 0
          // 讓 fetchPricesForDishes 去處理價格獲取

          const priceDateStr = item.priceDate || null;
          const priceDateTs = parseDateTs(priceDateStr);
          // safe JSON parse helper for fields that may be strings or arrays
          const base = {
            id: item.foodId,
            name: item.name,
            nameEn: item.nameEn || null,
            price: isNaN(priceNum) ? 0 : priceNum,
            type: item.category,
            subCategory: item.subCategory || null,
            ingredients: item.tag
              ? item.tag
                  .split(",")
                  .map((t) => t.trim().replace(/[\[\]"']/g, ""))
                  .filter((t) => t)
              : ["新鮮", "營養"],
            description: item.description || `新鮮的${item.name},營養豐富`,
            image: item.image || defaultVeggieImage,
            lastModifyDate: item.lastModifyDate,
            // preserve server-provided recommendation if present, otherwise derive
            isRecommendation:
              item.isRecommendation ?? (item.inSeason || item.affordable),
            // keep season and pricing metadata
            inSeason: item.inSeason || false, // 是否當季
            seasonStart: item.seasonStart || null,
            seasonEnd: item.seasonEnd || null,
            priceDate: priceDateStr,
            priceDateTs,
            priceDateDisplay: formatDateStr(priceDateStr),
            // parse aiRecommendations and benefits into arrays when possible
            aiRecommendations: aiRecommendationsArray,
            benefits: safeParse(item.benefits),
            eatingSuggestions: item.eatingSuggestions || null,
            // keep original payload for debugging
            _raw: item,
          };
          return base;
        });

        // 針對相同 foodId，依日期由新到舊排序，並計算與前一次的百分比變化
        const byFood = new Map();
        mappedList.forEach((d) => {
          const key = d.id || d._raw?.foodId || d.name;
          if (!byFood.has(key)) byFood.set(key, []);
          byFood.get(key).push(d);
        });

        byFood.forEach((arr, foodId) => {
          arr.sort((a, b) => (b.priceDateTs || 0) - (a.priceDateTs || 0));

          for (let i = 0; i < arr.length; i++) {
            const cur = arr[i];
            const prev = arr[i + 1]; // 下一筆是較舊日期

            if (prev && typeof prev.price === "number" && prev.price > 0) {
              const diff = cur.price - prev.price;
              cur.priceChangePct = (diff / prev.price) * 100;
            } else {
              cur.priceChangePct = null;
            }
          }
        });

        // 全部資料依日期新到舊排序後顯示
        const sortedList = [...mappedList].sort(
          (a, b) => (b.priceDateTs || 0) - (a.priceDateTs || 0)
        );
        allDishes.value = sortedList;
      } else {
        allDishes.value = [];
      }
    } else {
      allDishes.value = [];
    }
  } catch (error) {
    console.error("❌ 載入資料失敗:", error.message);
    allDishes.value = [];
  } finally {
    isLoading.value = false;
  }
};

// ==================== 計算屬性 ====================
const filteredDishes = computed(() => {
  let filtered = [...allDishes.value];

  // 特色篩選 - 清熱
  if (filters.heatClearing) {
    filtered = filtered.filter((dish) =>
      dish.ingredients.some((ing) => ing.includes("清熱"))
    );
  }

  // 特色篩選 - 營養
  if (filters.nutritious) {
    filtered = filtered.filter((dish) =>
      dish.ingredients.some((ing) => ing.includes("營養"))
    );
  }

  // 特色篩選 - 抗氧化
  if (filters.antioxidant) {
    filtered = filtered.filter((dish) =>
      dish.ingredients.some((ing) => ing.includes("抗氧化"))
    );
  }

  // 特色篩選 - 護眼
  if (filters.eyecare) {
    filtered = filtered.filter((dish) =>
      dish.ingredients.some(
        (ing) => ing.includes("護眼") || ing.includes("維生素A")
      )
    );
  }

  // 特色篩選 - 香甜
  if (filters.sweet) {
    filtered = filtered.filter((dish) =>
      dish.ingredients.some((ing) => ing.includes("香甜") || ing.includes("甜"))
    );
  }

  // 特色篩選 - 維生素C
  if (filters.vitaminC) {
    filtered = filtered.filter((dish) =>
      dish.ingredients.some(
        (ing) => ing.includes("維生素C") || ing.includes("維C")
      )
    );
  }

  // 特色篩選 - 高蛋白
  if (filters.highProtein) {
    filtered = filtered.filter((dish) =>
      dish.ingredients.some(
        (ing) => ing.includes("高蛋白") || ing.includes("蛋白")
      )
    );
  }

  // 特色篩選 - 香氣
  if (filters.aromatic) {
    filtered = filtered.filter((dish) =>
      dish.ingredients.some((ing) => ing.includes("香氣") || ing.includes("香"))
    );
  }

  // 特色篩選 - 低熱量
  if (filters.lowCalorie) {
    filtered = filtered.filter((dish) =>
      dish.ingredients.some(
        (ing) => ing.includes("低熱量") || ing.includes("低卡")
      )
    );
  }

  // 特色篩選 - 消暑
  if (filters.coolingSummer) {
    filtered = filtered.filter((dish) =>
      dish.ingredients.some(
        (ing) => ing.includes("消暑") || ing.includes("清涼")
      )
    );
  }

  // 特色篩選 - 補鈣
  if (filters.calcium) {
    filtered = filtered.filter((dish) =>
      dish.ingredients.some((ing) => ing.includes("補鈣") || ing.includes("鈣"))
    );
  }

  // 特色篩選 - 健康
  if (filters.healthy) {
    filtered = filtered.filter((dish) =>
      dish.ingredients.some((ing) => ing.includes("健康"))
    );
  }

  // 特色篩選 - 高纖維
  if (filters.highFiber) {
    filtered = filtered.filter((dish) =>
      dish.ingredients.some(
        (ing) => ing.includes("高纖維") || ing.includes("纖維")
      )
    );
  }

  // 特色篩選 - 解渴
  if (filters.thirstQuenching) {
    filtered = filtered.filter((dish) =>
      dish.ingredients.some((ing) => ing.includes("解渴"))
    );
  }

  // 特色篩選 - 美容
  if (filters.beauty) {
    filtered = filtered.filter((dish) =>
      dish.ingredients.some((ing) => ing.includes("美容"))
    );
  }

  // 特色篩選 - 夏季
  if (filters.summer) {
    filtered = filtered.filter((dish) =>
      dish.ingredients.some((ing) => ing.includes("夏季"))
    );
  }

  // 特色篩選 - 四季
  if (filters.allSeason) {
    filtered = filtered.filter((dish) =>
      dish.ingredients.some((ing) => ing.includes("四季"))
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

  if (total <= 3) {
    // 總頁數 <= 3，顯示所有頁碼
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
  } else {
    // 總頁數 > 3，顯示當前頁碼及其前後各 1 頁（最多 3 頁）
    let start = Math.max(1, current - 1);
    let end = Math.min(total, start + 2);

    // 調整起始位置，確保總是顯示 3 頁
    if (end - start < 2) {
      start = Math.max(1, end - 2);
    }

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

const getPriceChangeClass = (pct) => {
  if (typeof pct !== "number" || isNaN(pct)) return "price-flat";
  const abs = Math.abs(pct);

  // 漲跌幅 <= 10% 使用 stable 樣式
  if (abs <= 10) return "price-stable";

  return pct > 0 ? "price-up" : "price-down";
};

const getPriceChangeText = (pct) => {
  if (typeof pct !== "number" || isNaN(pct)) return "—";
  const abs = Math.abs(pct);

  // 漲跌幅 <= 10% 顯示"穩定"
  if (abs <= 10) return "穩定";

  const absStr = abs.toFixed(1);
  return pct > 0 ? `▲${absStr}%` : `▼${absStr}%`;
};

// ==================== 事件處理 ====================
const setCategory = async (categoryId) => {
  activeCategory.value = categoryId;
  currentPage.value = 1;
  await loadData();
};

const setSubCategory = async (subCategory) => {
  // 設定為特殊的 ID，用來標記這是從「其他」選單選的
  activeCategory.value = `other-${subCategory}`;
  currentPage.value = 1;
  await loadData();
};

const handleSortChange = async (newSort) => {
  currentSort.value = String(newSort || "SEASONAL").trim();
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

const viewRecipeDetails = async (foodId) => {
  try {
    const response = await foodApi.findFoodData(foodId);

    if (response && response.data && response.data.data) {
      // 可選：將資料暫存到 localStorage 供內頁使用（如果內頁有需要）
      localStorage.setItem(
        `food_${foodId}`,
        JSON.stringify(response.data.data)
      );
    }
  } catch (error) {
    console.error("❌ 載入蔬果詳情失敗:", error);
  }

  // 跳轉到蔬果內頁 (VeggieInfoPage.vue 的路由是 /veggie/:id)
  router.push(`/veggie/${foodId}`);
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

// 🔧 處理圖片載入失敗
const handleImageError = (event) => {
  // 避免無限迴圈：如果已經是預設圖片就不再重設
  if (event.target.src !== defaultVeggieImage) {
    event.target.src = defaultVeggieImage;
  }
};

// ==================== 價格獲取 ====================
const loadingPrices = ref(false);
const priceCache = new Map(); // 快取已獲取的價格，避免重複請求

// 🔧 從 aiRecommendations 中提取價格（作為最後備選方案）
const extractPriceFromAI = (aiRecommendations) => {
  if (!aiRecommendations || aiRecommendations.length === 0) {
    return null;
  }

  // 轉成字串
  const text = Array.isArray(aiRecommendations)
    ? aiRecommendations.join(" ")
    : String(aiRecommendations);

  // 模式1: XX元/公斤 或 XX元/kg
  let match = text.match(/(\d+(?:\.\d+)?)\s*元\s*[/／]\s*(?:公斤|kg)/i);
  if (match && match[1]) {
    const pricePerKg = parseFloat(match[1]);
    if (!isNaN(pricePerKg) && pricePerKg > 0) {
      const pricePerTaiJin = Math.round(pricePerKg / 1.67);
      console.log(`💰 從 AI 提取價格: ${pricePerKg}元/公斤 → ${pricePerTaiJin}元/台斤`);
      return pricePerTaiJin;
    }
  }

  // 模式2: 每公斤XX元 或 公斤XX元
  match = text.match(/(?:每\s*)?公斤\s*(\d+(?:\.\d+)?)\s*元/i);
  if (match && match[1]) {
    const pricePerKg = parseFloat(match[1]);
    if (!isNaN(pricePerKg) && pricePerKg > 0) {
      const pricePerTaiJin = Math.round(pricePerKg / 1.67);
      console.log(`💰 從 AI 提取價格: ${pricePerKg}元/公斤 → ${pricePerTaiJin}元/台斤`);
      return pricePerTaiJin;
    }
  }

  return null;
};

// 為指定的食品列表獲取價格
const fetchPricesForDishes = async (dishes) => {
  if (!dishes || dishes.length === 0) return;

  loadingPrices.value = true;

  const promises = dishes.map(async (dish) => {
    // 如果已經有價格且不為0，跳過
    if (dish.price && dish.price > 0) {
      return;
    }

    // 檢查快取
    if (priceCache.has(dish.id)) {
      const cached = priceCache.get(dish.id);
      dish.price = cached.price;
      dish.priceDate = cached.priceDate;
      dish.priceDateDisplay = cached.priceDateDisplay;
      return;
    }

    try {
      const response = await request.get(
        "/api/food/average-price-trends?days=DAY_30&foodId=" + dish.id
      );

      const payload = response.data?.data || {};
      const trend =
        payload.trend30 ?? payload.trendHalfYear ?? payload.trendYear ?? [];

      let priceFound = false; // 追蹤是否找到有效價格

      if (Array.isArray(trend) && trend.length > 0) {
        // 找最新的有效價格
        const latestData = trend
          .filter((t) => t && t.avgPrice != null && t.avgPrice > 0)
          .sort((a, b) => new Date(b.intervalEnd) - new Date(a.intervalEnd))[0];

        if (latestData) {
          const price = Number(latestData.avgPrice);
          const priceDate = latestData.intervalEnd;

          // 格式化日期
          const formatDate = (d) => {
            if (!d) return "";
            const dt = new Date(d);
            if (isNaN(dt)) return String(d);
            const y = dt.getFullYear();
            const m = String(dt.getMonth() + 1).padStart(2, "0");
            const dd = String(dt.getDate()).padStart(2, "0");
            return `${y}/${m}/${dd}`;
          };

          const priceDateDisplay = formatDate(priceDate);

          // 更新食品價格
          dish.price = price;
          dish.priceDate = priceDate;
          dish.priceDateDisplay = priceDateDisplay;
          priceFound = true; // 標記已找到價格

          // 🔧 計算價格變化：找出「約一週前」的資料來比較
          if (trend.length >= 2) {
            const sortedTrend = trend
              .filter((t) => t && t.avgPrice != null && t.avgPrice > 0)
              .sort(
                (a, b) => new Date(b.intervalEnd) - new Date(a.intervalEnd)
              );

            const latestDate = new Date(priceDate);

            // 嘗試找出約7天前的資料（允許 ±2 天的誤差）
            let weekAgoData = null;
            const targetDaysAgo = 7;
            const tolerance = 2; // 允許 5-9 天前的資料

            for (let data of sortedTrend.slice(1)) {
              // 跳過第一筆（最新的）
              const dataDate = new Date(data.intervalEnd);
              const daysDiff = Math.floor(
                (latestDate - dataDate) / (1000 * 60 * 60 * 24)
              );

              if (
                daysDiff >= targetDaysAgo - tolerance &&
                daysDiff <= targetDaysAgo + tolerance
              ) {
                weekAgoData = data;
                break;
              }
            }

            // 如果找不到約一週前的,就用第二新的
            if (!weekAgoData && sortedTrend.length >= 2) {
              weekAgoData = sortedTrend[1];
            }

            if (weekAgoData && weekAgoData.avgPrice > 0) {
              const prevPrice = Number(weekAgoData.avgPrice);
              const diff = price - prevPrice;
              dish.priceChangePct = (diff / prevPrice) * 100;
            } else {
              dish.priceChangePct = null;
            }
          } else {
            dish.priceChangePct = null;
          }

          // 存入快取
          priceCache.set(dish.id, { price, priceDate, priceDateDisplay });
        }
      }

      // 🔧 如果 API 正常但沒有找到有效價格，嘗試從 AI 建議中提取價格
      if (!priceFound && dish.aiRecommendations) {
        const extractedPrice = extractPriceFromAI(dish.aiRecommendations);
        if (extractedPrice && extractedPrice > 0) {
          console.log(`💡 ${dish.name} API 無價格數據，從 AI 提取: ${extractedPrice}元/台斤`);
          dish.price = extractedPrice;
          // 存入快取
          priceCache.set(dish.id, {
            price: extractedPrice,
            priceDate: null,
            priceDateDisplay: null
          });
        }
      }
    } catch (error) {
      // 🔧 如果價格趨勢 API 失敗，嘗試從 AI 建議中提取價格（最後備選方案）
      if (dish.aiRecommendations) {
        const extractedPrice = extractPriceFromAI(dish.aiRecommendations);
        if (extractedPrice && extractedPrice > 0) {
          console.log(`⚠️ ${dish.name} API 失敗，從 AI 提取: ${extractedPrice}元/台斤`);
          dish.price = extractedPrice;
          // 存入快取
          priceCache.set(dish.id, {
            price: extractedPrice,
            priceDate: null,
            priceDateDisplay: null
          });
        }
      }
    }
  });

  await Promise.all(promises);
  loadingPrices.value = false;
};

// 監聽當前頁數據變化，自動獲取價格
watch(
  paginatedDishes,
  (newDishes) => {
    if (newDishes && newDishes.length > 0) {
      fetchPricesForDishes(newDishes);
    }
  },
  { immediate: false }
); // 不立即執行，等數據載入後再執行

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

/* 手機版篩選區域：預設隱藏 */
.mobile-filter-area {
  display: none;
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
  gap: 20px;
  margin-bottom: 40px;
  align-items: stretch;
}

.recipe-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  display: flex;
  flex-direction: column;
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

.season-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(76, 175, 80, 0.95);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
}

.season-icon {
  font-size: 14px;
}

.card-content {
  padding: 16px;
  display: flex;
  flex-direction: column;
  flex: 1;
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
  width: fit-content;
  max-width: max-content;
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
  font-size: 15px;
  color: #222; /* 更深的字色，使描述更醒目 */
  font-weight: 600; /* 加粗 */
  line-height: 1.45;
  margin-bottom: 12px;
  background: linear-gradient(
    90deg,
    rgba(255, 250, 240, 0.9),
    rgba(255, 255, 255, 0)
  );
  padding: 6px 8px;
  border-radius: 6px;
}

.nutrition-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
  min-height: 24px;
}

.nutrition-tag {
  background-color: #e8e8e8;
  color: #555;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  transition: all 0.2s ease;
}

.nutrition-tag:hover {
  background-color: #d4edda;
  color: #2e7d32;
}

.price-section {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
  margin-top: auto;
  gap: 12px;
}

.price-info {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  flex: 0 0 auto;
}

.price {
  font-size: 16px;
  font-weight: bold;
  color: white;
  background-color: #ff7043;
  padding: 4px 12px;
  border-radius: 6px;
  display: inline-block;
}

.price-change {
  font-size: 12px;
  font-weight: 500;
  position: relative;
  cursor: help;
}

/* Tooltip 樣式 */
.price-change::after {
  content: attr(data-tooltip);
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(-8px);
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0.3s ease;
  pointer-events: none;
  z-index: 1000;
}

/* Tooltip 箭頭 */
.price-change::before {
  content: "";
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(-2px);
  border: 5px solid transparent;
  border-top-color: rgba(0, 0, 0, 0.8);
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0.3s ease;
  pointer-events: none;
  z-index: 1000;
}

/* Hover 時顯示 */
.price-change:hover::after,
.price-change:hover::before {
  opacity: 1;
  visibility: visible;
  transition-delay: 0.2s;
}

.price-change.price-up {
  color: #f44336;
}

.price-change.price-down {
  color: #4caf50;
}

.price-change.price-stable {
  color: #666;
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
  margin: 0;
  flex-shrink: 0;
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

.no-data-hint {
  font-size: 14px;
  color: #666;
  margin-top: 10px;
  background-color: #fff3cd;
  border: 1px solid #ffc107;
  border-radius: 6px;
  padding: 12px 20px;
  display: inline-block;
}

/* AI recommendations and benefits */
.ai-recommendations {
  margin-top: 10px;
}
.ai-recommendations ul {
  margin: 0;
  padding: 0;
  list-style: none;
}
.ai-recommendations .ai-reco {
  font-size: 12px;
  color: #555;
  margin-bottom: 6px;
  line-height: 1.3;
  max-height: 2.6em;
  overflow: hidden;
}

.benefits-list-inline {
  display: flex;
  gap: 8px;
  margin: 8px 0 0 0;
  padding: 0;
  list-style: none;
}
.benefit-item {
  background: #eef6f1;
  color: #2e7d32;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0;
  margin: 40px auto 20px;
  max-width: 100%;
  flex-wrap: nowrap;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  width: fit-content;
}

.page-btn {
  min-width: 80px;
  height: 45px;
  padding: 0 16px;
  background-color: #fff;
  border: none;
  border-right: 2px solid #e0e0e0;
  color: #666;
  cursor: pointer;
  border-radius: 0;
  font-size: 15px;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-btn:hover:not(:disabled) {
  background-color: #f5f5f5;
  color: #4caf50;
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  background-color: #f9f9f9;
  color: #999;
}

.page-btn:last-child {
  border-right: none;
}

.page-number {
  min-width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-right: 2px solid #e0e0e0;
  border-radius: 0;
  background: white;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s ease;
  color: #555;
}

.page-number:hover {
  background-color: #f5f5f5;
  color: #4caf50;
}

.page-number.active {
  background-color: #4caf50;
  color: white;
  font-weight: 600;
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

  /* 隱藏桌面版的左側篩選欄 */
  .sidebar-container {
    display: none;
  }

  /* 顯示手機版篩選區域 */
  .mobile-filter-area {
    display: block;
    margin: 15px 0;
  }

  /* 條件篩選按鈕 */
  .mobile-filter-toggle {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px 20px;
    background-color: #fff;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 500;
    color: #333;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .mobile-filter-toggle:hover {
    background-color: #f5f5f5;
    border-color: #4caf50;
  }

  .mobile-filter-toggle:active {
    background-color: #e8f5e9;
  }

  /* 切換圖標動畫 */
  .toggle-icon {
    transition: transform 0.3s ease;
  }

  .toggle-icon.open {
    transform: rotate(180deg);
  }

  /* 篩選面板 */
  .mobile-filter-panel {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.4s ease-out;
    background-color: #f8f9fa;
    border-radius: 8px;
    margin-top: 10px;
  }

  .mobile-filter-panel.show {
    max-height: 2000px;
    transition: max-height 0.5s ease-in;
    padding: 15px;
  }

  .main-content {
    order: 1;
  }

  /* 手機版分頁樣式調整 */
  .pagination {
    gap: 0;
    margin: 30px auto 15px;
  }

  .page-btn {
    min-width: 70px;
    height: 40px;
    font-size: 14px;
    padding: 0 12px;
  }

  .page-number {
    min-width: 40px;
    height: 40px;
    font-size: 15px;
  }

  .page-summary {
    font-size: 13px;
    margin: 8px auto 15px;
  }
}
.price-date {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  margin: 4px 0;
  padding: 0;
  flex: 1 1 auto;
  text-align: center;
}

.price-date-label {
  font-size: 11px;
  color: #888;
  line-height: 1.2;
  font-weight: 500;
}

.price-date-value {
  font-size: 12px;
  color: #555;
  line-height: 1.2;
  font-weight: 600;
}

.page-summary {
  text-align: center;
  font-size: 14px;
  color: #888;
  margin: 10px auto 20px;
  font-weight: 500;
}
</style>
