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
          :otherCategories="otherCategories"
          @set-category="setCategory"
          @set-subcategory="setSubCategory"
          @sort-change="handleSortChange"
        />

        <!-- AI 市場洞察 -->
        <MarketInsight />

        <!-- 名稱搜尋：顯示中文/英文同一輸入欄位（輸入後自動判斷並查詢） -->
        <div class="name-search">
          <div class="name-inputs">
            <div class="input-group">
              <label class="sr-label">名稱（中文或英文）</label>
              <input
                type="text"
                v-model="inputRaw"
                @input="onRawNameInput"
                class="name-input"
                placeholder="輸入中文或英文名稱，系統會自動判斷"
              />
            </div>
            <div class="input-note">系統會自動判斷輸入內容為中文或英文並送出對應欄位</div>
          </div>
        </div>

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
              <div class="benefits" v-if="dish.benefits && dish.benefits.length">
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
                  >
                    {{ getPriceChangeText(dish.priceChangePct) }}
                  </span>
                </div>
                <div class="price-date" v-if="dish.priceDateDisplay">
                  價格日期：{{ dish.priceDateDisplay }}
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

          <div class="page-summary">
            第 {{ currentPage }} / {{ totalPages }} 頁
          </div>
        </div>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, reactive } from "vue";
import { useRouter } from "vue-router";
import { foodApi } from "@/api/food.js";

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
  antioxidant: false,
  supplement: false,
  eyecare: false,
  energy: false,
  superFood: false,
});

const priceRange = ref([0, 200]);

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

const nutritionFilters = reactive({
  vitaminA: false,
  vitaminC: false,
  calcium: false,
  iron: false,
  antioxidant: false,
});

const activeNutritionTab = ref("");

// ==================== 子分類選項 ====================
const allSubCategories = ref([]);

// 注意：這些 subCategory 必須與後端 API 回傳的子分類名稱完全一致
const mainCategories = [
  { id: "all", name: "全部", subCategory: null },
  { id: "vegetable", name: "蔬菜", subCategory: "蔬菜" },
  { id: "fruit", name: "水果", subCategory: "水果" },
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
        { code: "SEASONAL", label: "產季由近到遠" },
        { code: "PRICE_DESC", label: "價格高到低" },
        { code: "PRICE_ASC", label: "價格低到高" },
      ];
    }

    if (allSubCategories.value.length === 0) {
      try {
        console.log("🔍 載入所有子分類...");
        const subCatResponse = await foodApi.getFoodSubCategories("");

        console.log("📂 getFoodSubCategories API 完整回應:", subCatResponse);
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
        else if (subCatResponse?.data?.code === "0000" && Array.isArray(subCatResponse.data.data)) {
          subCats = subCatResponse.data.data;
        }

        // fallback: if data.payload is an object map, extract keys or values
        else if (subCatResponse?.data && typeof subCatResponse.data === "object") {
          // try to extract arrays from properties
          const candidates = Object.values(subCatResponse.data).filter((v) => Array.isArray(v));
          if (candidates.length > 0) subCats = candidates[0];
        }

        // ensure array of strings
        if (!Array.isArray(subCats)) subCats = [];
        // flatten and filter
        subCats = subCats.flat().map((s) => (s && s.name ? s.name : s)).filter(Boolean);

        allSubCategories.value = subCats;
        console.log("✅ 子分類載入成功:", allSubCategories.value.length, "個");
        console.log("📋 完整子分類列表:", allSubCategories.value);

          const hasVegetable = allSubCategories.value.includes("蔬菜");
          console.log("🔍 是否有「蔬菜」子分類:", hasVegetable);

          if (!hasVegetable) {
            const vegetableRelated = allSubCategories.value.filter(
              (s) => s.includes("菜") || s.includes("蔬")
            );
            console.log("🔍 相關的子分類:", vegetableRelated);
          }

          // 計算「其他」分類（排除已在主按鈕列的）
          const mainSubCategories = mainCategories
            .map((c) => c.subCategory)
            .filter(Boolean);
          otherCategories.value = allSubCategories.value.filter(
            (subCat) =>
              !mainSubCategories.includes(subCat) && subCat !== "其他作物"
          );
          console.log(
            "📂 其他分類 (" + otherCategories.value.length + "個):",
            otherCategories.value
          );
      } catch (subCatError) {
        console.error("⚠️ 子分類查詢失敗:", subCatError.message);
        console.error("⚠️ 完整錯誤:", subCatError);
      }
    } else {
      // 已經載入過，只輸出當前狀態
      console.log("📂 子分類已載入 (" + allSubCategories.value.length + "個)");
      console.log(
        "📂 其他分類 (" + otherCategories.value.length + "個):",
        otherCategories.value
      );
    }

    // ===== 2. 準備查詢參數 =====
    // Request Body 參數
    // 🔧 價格範圍：如果滑桿在預設位置 [0, 200]，就不限制價格
    const isDefaultPriceRange =
      priceRange.value[0] === 0 && priceRange.value[1] === 200;

    // 🔧 根據當前分類取得對應的 subCategory
    let querySubCategory = null;
    if (activeCategory.value !== "all") {
      // 檢查是否是從「其他」選單選的子分類
      if (activeCategory.value.startsWith("other-")) {
        querySubCategory = activeCategory.value.replace("other-", "");
        console.log("📂 使用其他分類:", querySubCategory);
      } else {
        const currentCategory = mainCategories.find(
          (c) => c.id === activeCategory.value
        );
        querySubCategory =
          currentCategory?.subCategory === "other"
            ? null
            : currentCategory?.subCategory || null;
      }
    }

    const filterParams = {
      category: null, // 🔧 改用 subCategory 查詢，不使用 category
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
      sort: currentSort.value || "SEASONAL", // 🔧 確保預設值
    };

    // Query Parameters（分頁參數）
    // 🔧 改用較大的 pageSize 確保能取得所有資料
    const paginationParams = {
      pageNo: 0,
      pageSize: 200, // 🔧 從 20 改為 200，確保能取得更多資料
    };

    if (filterParams.subCategory) {
      console.log("📂 指定分類查詢:", filterParams.subCategory);
    } else {
      console.log("📂 查詢所有分類 (subCategory: null)");
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
      else if (
        foodResponse.data?.data?.content !== undefined &&
        Array.isArray(foodResponse.data.data.content)
      ) {
        foodList = foodResponse.data.data.content;
        responseData = foodResponse.data.data;
        console.log("✅ 使用格式 2: response.data.data.content (標準分頁)");
        console.log("📊 content 長度:", foodList.length);
      }
      // 格式 3: response.data.content
      else if (
        foodResponse.data?.content !== undefined &&
        Array.isArray(foodResponse.data.content)
      ) {
        foodList = foodResponse.data.content;
        responseData = foodResponse.data;
        console.log("✅ 使用格式 3: response.data.content");
        console.log("📊 content 長度:", foodList.length);
      }
      // 格式 4: response.content
      else if (
        foodResponse.content !== undefined &&
        Array.isArray(foodResponse.content)
      ) {
        foodList = foodResponse.content;
        responseData = foodResponse;
        console.log("✅ 使用格式 4: response.content");
        console.log("📊 content 長度:", foodList.length);
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
        console.log("✅ 使用格式 5: response.data.data 直接是陣列");
      } else {
        console.error("❌ 無法識別的回應格式");
        console.error("完整回應:", foodResponse);
        console.error("foodResponse.data:", foodResponse.data);
        console.error("foodResponse.data.data:", foodResponse.data?.data);
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
      console.log("📊 分頁資訊:", {
        pageNo: responseData?.pageNo,
        pageSize: responseData?.pageSize,
        totalElements: responseData?.totalElements,
        totalPages: responseData?.totalPages,
      });

      if (Array.isArray(foodList) && foodList.length > 0) {
        // � 不做去重，直接使用後端回傳的 foodList
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
          const priceNum = Number(item.price ?? 0);
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
              ? item.tag.split("/").filter((t) => t.trim())
              : ["新鮮", "營養"],
            description: item.description || `新鮮的${item.name},營養豐富`,
            image: item.image || defaultVeggieImage,
            lastModifyDate: item.lastModifyDate,
            // preserve server-provided recommendation if present, otherwise derive
            isRecommendation:
              item.isRecommendation ?? (item.inSeason || item.affordable),
            // keep season and pricing metadata
            seasonStart: item.seasonStart || null,
            seasonEnd: item.seasonEnd || null,
            priceDate: priceDateStr,
            priceDateTs,
            priceDateDisplay: formatDateStr(priceDateStr),
            // parse aiRecommendations and benefits into arrays when possible
            aiRecommendations: safeParse(item.aiRecommendations),
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

        byFood.forEach((arr) => {
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
            `  ${index + 1}. ${dish.name} - ${dish.type} - NT${
              dish.price
            } - 圖片: ${dish.image ? "有" : "無"}`
          );
        });

  // 🔧 統計圖片狀況
        const withImage = allDishes.value.filter((d) => d._raw.image).length;
        const withoutImage = allDishes.value.length - withImage;
        console.log(
          `🖼️ 圖片統計: 有圖片 ${withImage} 筆, 無圖片 ${withoutImage} 筆`
        );

        // 列出沒有圖片的項目
        if (withoutImage > 0) {
          console.log("📝 沒有圖片的項目:");
          allDishes.value
            .filter((d) => !d._raw.image)
            .slice(0, 10)
            .forEach((dish, index) => {
              console.log(
                `  ${index + 1}. ${dish.name} (${dish.type}) - foodId: ${
                  dish.id
                }`
              );
            });
          if (withoutImage > 10) {
            console.log(`  ... 還有 ${withoutImage - 10} 筆`);
          }
        }

        // 🔧 列出有圖片的項目（檢查圖片格式）
        if (withImage > 0) {
          console.log("🖼️ 有圖片的項目 (前5筆):");
          allDishes.value
            .filter((d) => d._raw.image)
            .slice(0, 5)
            .forEach((dish, index) => {
              const img = dish._raw.image;
              const imgType = img.startsWith("http")
                ? "URL"
                : img.startsWith("data:")
                ? "Base64"
                : img.startsWith("/")
                ? "相對路徑"
                : "未知";
              console.log(`  ${index + 1}. ${dish.name} - 類型: ${imgType}`);
              console.log(`     圖片: ${img.substring(0, 100)}...`);
            });
        }
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

const getPriceChangeClass = (pct) => {
  if (typeof pct !== "number" || isNaN(pct)) return "price-flat";
  return pct > 0 ? "price-up" : pct < 0 ? "price-down" : "price-flat";
};

const getPriceChangeText = (pct) => {
  if (typeof pct !== "number" || isNaN(pct)) return "—";
  const abs = Math.abs(pct).toFixed(1);
  return pct > 0 ? `▲${abs}%` : pct < 0 ? `▼${abs}%` : "0.0%";
};

// ==================== 事件處理 ====================
const setCategory = async (categoryId) => {
  console.log("📂 切換分類:", categoryId);
  activeCategory.value = categoryId;
  currentPage.value = 1;
  await loadData();
};

const setSubCategory = async (subCategory) => {
  console.log("📂 選擇子分類:", subCategory);
  // 設定為特殊的 ID，用來標記這是從「其他」選單選的
  activeCategory.value = `other-${subCategory}`;
  currentPage.value = 1;
  await loadData();
};

const handleSortChange = async (newSort) => {
  console.log("🔄 變更排序:", newSort);
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

const updateNutritionFilters = (newFilters) => {
  Object.assign(nutritionFilters, newFilters);
  currentPage.value = 1;
};

const updateNutritionTab = (tab) => {
  activeNutritionTab.value = tab;
};

const viewRecipeDetails = async (foodId) => {
  console.log("🔍 點擊查看蔬果詳情，ID:", foodId);

  try {
    const response = await foodApi.findFoodData(foodId);
    console.log("📥 蔬果詳情 API 回應:", response);

    if (response && response.data && response.data.data) {
      // 可選：將資料暫存到 localStorage 供內頁使用（如果內頁有需要）
      localStorage.setItem(`food_${foodId}`, JSON.stringify(response.data.data));
      console.log("✅ 蔬果資料已暫存");
    }
  } catch (error) {
    console.error("❌ 載入蔬果詳情失敗:", error);
  }

  // 跳轉到蔬果內頁 (VeggieInfoPage.vue 的路由是 /veggie/:id)
  router.push(`/veggie/${foodId}`);
  console.log("🚀 跳轉到蔬果內頁: /veggie/" + foodId);
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
  console.warn("🖼️ 圖片載入失敗:", event.target.src);
  // 避免無限迴圈：如果已經是預設圖片就不再重設
  if (event.target.src !== defaultVeggieImage) {
    event.target.src = defaultVeggieImage;
  }
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
  font-size: 15px;
  color: #222; /* 更深的字色，使描述更醒目 */
  font-weight: 600; /* 加粗 */
  line-height: 1.45;
  margin-bottom: 12px;
  background: linear-gradient(90deg, rgba(255,250,240,0.9), rgba(255,255,255,0));
  padding: 6px 8px;
  border-radius: 6px;
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
.price-date {
  font-size: 12px;
  color: #666;
}

.page-summary {
  margin-left: 12px;
  font-size: 12px;
  color: #666;
}

/* 名稱搜尋區塊 */
.name-search {
  margin: 12px 0 18px 0;
}
.name-inputs {
  display: flex;
  gap: 12px;
  align-items: center;
}
.input-group {
  display: flex;
  flex-direction: column;
}
.name-input {
  padding: 8px 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  min-width: 260px;
}
.input-note {
  font-size: 12px;
  color: #888;
}
</style>
