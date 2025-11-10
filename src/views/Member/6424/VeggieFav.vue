<template>
  <div class="veggie-favorites-container">
    <!-- 分類標籤 - 仿照蔬果列表樣式 -->
    <div class="food-category-section">
      <div class="category-left">食材分類</div>
      <div class="category-center">
        <!-- 主要分類按鈕 -->
        <button
          v-for="filter in mainFilters"
          :key="filter.id"
          type="button"
          :class="['category-btn', { active: activeFilter === filter.id }]"
          @click="setActiveFilter(filter.id)"
        >
          {{ filter.label }}
        </button>

        <!-- 其他分類按鈕 + 下拉選單 -->
        <div
          class="other-container"
          @mouseenter="handleMouseEnter"
          @mouseleave="handleMouseLeave"
        >
          <button
            type="button"
            class="category-btn other-btn"
            :class="{ active: isOtherCategoryActive }"
            @click="toggleOtherDropdown"
          >
            其他 <span class="dropdown-arrow">▼</span>
          </button>

          <!-- 下拉選單 -->
          <div
            v-show="showOtherDropdown"
            class="other-dropdown"
          >
            <button
              type="button"
              v-for="filter in otherFilters"
              :key="filter.id"
              class="other-dropdown-item"
              @click="handleOtherCategoryClick(filter.id)"
            >
              {{ filter.label }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 收藏蔬菜卡片 -->
    <div class="veggie-cards-grid" v-if="filteredVeggieCollection.length > 0">
      <div
        v-for="veggie in filteredVeggieCollection"
        :key="veggie.id"
        class="veggie-collection-card"
      >
        <!-- 蔬菜圖片 -->
        <div class="veggie-image-container">
          <img
            :src="$img(veggie.image)"
            :alt="veggie.name"
            class="veggie-image"
            @error="handleImageError"
          />
        </div>

        <!-- 蔬菜資訊 -->
        <div class="veggie-info">
          <h3 class="veggie-name">{{ veggie.name }}</h3>
          <div class="veggie-meta">
            <span class="veggie-category-tag">{{
              veggie.categoryLabel
            }}</span>
          </div>
        </div>

        <!-- 操作按鈕 -->
        <div class="veggie-actions">
          <button class="action-btn view-btn" @click="viewVeggie(veggie.id)">
            查看
          </button>
          <button
            class="action-btn remove-btn"
            @click="removeFromCollection(veggie.id)"
          >
            刪除
          </button>
        </div>
      </div>
    </div>

    <!-- 空狀態 -->
    <div v-else class="empty-state">
      <div class="empty-icon">🥕</div>
      <h3>尚無收藏的蔬菜</h3>
      <p>開始探索並收藏您喜愛的蔬菜吧！</p>
      <RouterLink to="/ai-recommendation" class="browse-btn">
        瀏覽蔬菜
      </RouterLink>
    </div>

    <!-- 載入狀態 -->
    <div v-if="isLoading" class="loading-state">
      <p>載入中...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { favoriteApi } from "@/api/favorite";

const router = useRouter();

// 響應式狀態
const isLoading = ref(false);
const activeFilter = ref("all");
const showOtherDropdown = ref(false);
let hideTimeout = null;

// 主要分類按鈕（對應蔬果列表的主要分類）
const mainFilters = [
  { id: "all", label: "全部" },
  { id: "leafy", label: "葉菜類" },
  { id: "root", label: "根莖類" },
  { id: "grain", label: "雜糧類" },
];

// 其他分類（下拉選單內容）
const otherFilters = [
  { id: "edible-flower", label: "可食花卉" },
  { id: "nut", label: "堅果類" },
  { id: "wood-melon", label: "木瓜類" },
  { id: "plum", label: "李子類" },
  { id: "loquat", label: "枇杷類" },
  { id: "treasure", label: "果實類" },
  { id: "fruit-veggie", label: "果菜類" },
  { id: "orange", label: "柑橘類" },
  { id: "citrus", label: "柚子類" },
  { id: "persimmon", label: "柿子類" },
  { id: "walnut", label: "核果類" },
  { id: "peach", label: "桃子類" },
  { id: "pear", label: "梨子類" },
  { id: "kiwi", label: "楊桃類" },
  { id: "aquatic", label: "水生蔬菜" },
  { id: "ocean-melon", label: "洋香瓜類" },
  { id: "seaweed", label: "海菜類" },
  { id: "berry", label: "漿果類" },
  { id: "tropical", label: "熱帶水果" },
  { id: "special-fruit", label: "特殊水果" },
  { id: "special-veggie", label: "特殊蔬菜" },
  { id: "ball-root", label: "球根類" },
  { id: "melon", label: "甜瓜類" },
  { id: "sweet-stone", label: "番石榴類" },
  { id: "bamboo", label: "筍菜類" },
  { id: "combine-fruit", label: "綜合水果" },
  { id: "mango", label: "芒果類" },
  { id: "bud", label: "芽菜類" },
  { id: "taro", label: "芋菜類" },
  { id: "lychee", label: "荔枝類" },
  { id: "mushroom", label: "菇蕈類" },
  { id: "grape", label: "葡萄類" },
  { id: "melon-veggie", label: "蔓菜類" },
  { id: "lotus", label: "蓮霧類" },
  { id: "garlic-ginger", label: "蒜薑蔥類" },
  { id: "apple", label: "蘋果類" },
  { id: "banana", label: "蕉用蔬菜" },
  { id: "longan", label: "龍眼類" },
  { id: "melon-fruit", label: "瓜果類" },
  { id: "pineapple", label: "鳳梨類" },
  { id: "import", label: "進口水果" },
];

// 收藏的蔬菜數據（從 API 載入）
const veggieCollection = ref([]);

// 計算篩選後的收藏蔬菜
const filteredVeggieCollection = computed(() => {
  if (activeFilter.value === "all") {
    return veggieCollection.value;
  }
  return veggieCollection.value.filter(
    (veggie) => veggie.category === activeFilter.value
  );
});

// 計算是否有「其他」分類被選中
const isOtherCategoryActive = computed(() => {
  return otherFilters.some(filter => filter.id === activeFilter.value);
});

// 設定活動篩選器
const setActiveFilter = (filterId) => {
  activeFilter.value = filterId;
  showOtherDropdown.value = false;
};

// 切換「其他」下拉選單
const toggleOtherDropdown = () => {
  showOtherDropdown.value = !showOtherDropdown.value;
};

// 滑鼠移入「其他」按鈕
const handleMouseEnter = () => {
  if (hideTimeout) clearTimeout(hideTimeout);
  showOtherDropdown.value = true;
};

// 滑鼠移出「其他」按鈕
const handleMouseLeave = () => {
  hideTimeout = setTimeout(() => {
    showOtherDropdown.value = false;
  }, 200);
};

// 點擊其他分類項目
const handleOtherCategoryClick = (filterId) => {
  if (hideTimeout) clearTimeout(hideTimeout);
  activeFilter.value = filterId;
  showOtherDropdown.value = false;
};

// 查看蔬菜詳情
const viewVeggie = (veggieId) => {
  router.push(`/veggie/${veggieId}`);
};

// 從收藏中移除
const removeFromCollection = async (veggieId) => {
  if (!confirm("確定要從收藏中移除這個蔬菜嗎？")) {
    return;
  }

  try {
    isLoading.value = true;
    console.log("🗑️ 開始移除收藏:", veggieId);

    const response = await favoriteApi.removeFoodFavorite(veggieId);
    console.log("📥 刪除 API 回應:", response);

    // 檢查 API 回應是否成功
    if (response.data && (response.data.code === "0000" || response.data.message === "SUCCESS")) {
      // 從本地數據中移除
      veggieCollection.value = veggieCollection.value.filter(
        (veggie) => veggie.id !== veggieId
      );

      console.log("✅ 已從收藏中移除");
      alert("✅ 已從收藏中移除");
    } else {
      console.warn("⚠️ API 回應異常:", response.data);
      alert("移除失敗，請稍後再試");
    }
  } catch (error) {
    console.error("❌ 移除收藏失敗:", error);
    alert("移除失敗，請稍後再試");
  } finally {
    isLoading.value = false;
  }
};

// 處理圖片載入錯誤
const handleImageError = (event) => {
  event.target.src = "/images/placeholder/veggie-placeholder.jpg";
};

// 將 API 的分類對應到本地分類
const mapCategory = (apiCategory) => {
  if (!apiCategory) return "all";

  const categoryMap = {
    根莖類: "root",
    葉菜類: "leafy",
    果菜類: "fruit",
    瓜果類: "bean",
    菇類: "mushroom",
    豆類: "bean-pod",
    根莖: "root",
    葉菜: "leafy",
    果菜: "fruit",
    瓜果: "bean",
    菇: "mushroom",
    豆: "bean-pod",
    // 英文對應
    root: "root",
    leafy: "leafy",
    fruit: "fruit",
    bean: "bean",
    mushroom: "mushroom",
    "bean-pod": "bean-pod",
  };
  return categoryMap[apiCategory] || "all";
};

// 根據分類 ID 取得標籤文字 - 直接用 API 回傳的 type 欄位
const getCategoryLabel = (apiItem) => {
  // 優先使用 type 欄位
  if (apiItem && typeof apiItem === 'object' && apiItem.type) {
    return apiItem.type;
  }

  // 如果傳入的是字串（舊版相容）
  if (typeof apiItem === 'string') {
    if (!apiItem) return "蔬菜類";

    const labelMap = {
      根莖類: "根莖類",
      葉菜類: "葉菜類",
      果菜類: "果菜類",
      瓜果類: "瓜果類",
      菇類: "菇類",
      豆類: "豆類",
      根莖: "根莖類",
      葉菜: "葉菜類",
      果菜: "果菜類",
      瓜果: "瓜果類",
      菇: "菇類",
      豆: "豆類",
    };
    return labelMap[apiItem] || apiItem;
  }

  return "蔬菜類";
};

// 載入收藏列表
const loadVeggieFavorites = async () => {
  try {
    isLoading.value = true;
    console.log("🥬 開始載入收藏蔬菜列表...");

    const response = await favoriteApi.getFoodFavoriteList("ALL");
    console.log("📥 API 回應:", response);

    if (response.data && response.data.data) {
      // 將 API 資料格式轉換成元件需要的格式
      veggieCollection.value = response.data.data.map((item) => {
        console.log("🔍 處理項目:", item);
        console.log("  → name:", item.name);
        console.log("  → category:", item.category);
        console.log("  → subCategory:", item.subCategory);
        console.log("  → type:", item.type);

        // 使用 subCategory 作為顯示的類別標籤（葉菜類、根莖類等）
        const displayType = item.subCategory || item.type || "蔬菜類";
        const mappedCategory = mapCategory(item.subCategory || item.category);

        console.log("  → 最終顯示標籤:", displayType);

        return {
          id: item.recipeId || item.foodId || item.id,
          name: item.name,
          category: mappedCategory,
          categoryLabel: displayType,
          image: item.image,
          tags: [item.subCategory],
        };
      });

      console.log("✅ 收藏列表載入成功，共", veggieCollection.value.length, "筆");
      console.log("📋 完整資料:", veggieCollection.value);
    } else {
      console.warn("⚠️ API 回應格式不符預期:", response.data);
      veggieCollection.value = [];
    }
  } catch (error) {
    console.error("❌ 載入收藏失敗:", error);
    veggieCollection.value = [];
  } finally {
    isLoading.value = false;
  }
};

// 初始化
onMounted(() => {
  loadVeggieFavorites();
});

// 暴露給父元件的方法（可選）
defineExpose({
  loadVeggieFavorites,
  removeFromCollection,
});
</script>

<style scoped>
.veggie-favorites-container {
  display: flex;
  flex-direction: column;
  overflow: visible;
}

/* 分類篩選標籤 - 仿照蔬果列表樣式 */
.food-category-section {
  display: flex;
  padding: 15px;
  margin-bottom: 20px;
  align-items: center;
  background-color: #f9f9f9;
  border-radius: 4px;
  margin: 0 30px 20px 30px;
  overflow: visible;
}

.category-left {
  font-weight: bold;
  margin-right: 20px;
  padding: 8px 0;
  min-width: 80px;
  color: #555;
}

.category-center {
  display: flex;
  gap: 10px;
  flex: 1;
  overflow-x: visible;
  overflow-y: visible;
  -ms-overflow-style: none;
  scrollbar-width: none;
  position: relative;
}

.category-center::-webkit-scrollbar {
  display: none;
}

.category-btn {
  background: white;
  border: 1px solid #ddd;
  padding: 8px 16px;
  cursor: pointer;
  border-radius: 4px;
  white-space: nowrap;
  transition: all 0.2s ease;
  color: #333;
  font-size: 14px;
}

.category-btn:hover {
  background-color: #2e7d32;
  color: white;
  border-color: #2e7d32;
}

.category-btn.active {
  background-color: #1976d2;
  color: white;
  border-color: #1976d2;
}

/* 其他按鈕的容器 */
.other-container {
  position: relative;
  display: flex;
  flex-direction: column;
}

.category-btn.other-btn {
  position: relative;
}

.dropdown-arrow {
  margin-left: 4px;
  font-size: 10px;
}

/* 其他分類下拉選單樣式 */
.other-dropdown {
  position: absolute;
  top: calc(100% + 5px);
  left: 0;
  right: auto;
  background: white;
  border: 2px solid #4caf50;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  max-height: 500px;
  overflow-y: auto;
  z-index: 99999;
  min-width: 500px;
  max-width: 700px;
  width: max-content;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  padding: 20px;
}

.other-dropdown-item {
  background: white;
  border: 1px solid #e0e0e0;
  padding: 10px 14px;
  text-align: center;
  cursor: pointer;
  border-radius: 6px;
  font-size: 14px;
  color: #333;
  white-space: nowrap;
  transition: all 0.2s ease;
  overflow: hidden;
  text-overflow: ellipsis;
}

.other-dropdown-item:hover {
  background-color: #e8f5e9;
  border-color: #2e7d32;
  color: #2e7d32;
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(46, 125, 50, 0.2);
}

/* 蔬菜卡片網格 */
.veggie-cards-grid {
  padding: 0 30px 50px 30px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  align-content: start;
}

.veggie-collection-card {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  height: auto;
  min-height: 280px;
}

.veggie-collection-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 圖片區域 */
.veggie-image-container {
  height: 200px;
  overflow: hidden;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.veggie-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.veggie-collection-card:hover .veggie-image {
  transform: scale(1.05);
}

/* 蔬菜資訊 */
.veggie-info {
  padding: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 60px;
}

.veggie-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
  line-height: 1.4;
  text-align: center;
}

.veggie-meta {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
}

.veggie-category-tag {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  background-color: #e8f5e9;
  color: #2e7d32;
  width: fit-content;
  max-width: max-content;
}

/* 操作按鈕 */
.veggie-actions {
  padding: 12px;
  display: flex;
  gap: 10px;
  border-top: 1px solid #f0f0f0;
  flex-shrink: 0;
  margin-top: auto;
}

.action-btn {
  flex: 1;
  padding: 8px 6px;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.view-btn {
  background-color: #2e7d32;
  color: white;
}

.view-btn:hover {
  background-color: #27682b;
}

.remove-btn {
  background-color: #f44336;
  color: white;
}

.remove-btn:hover {
  background-color: #d32f2f;
}

/* 空狀態 */
.empty-state {
  padding: 60px 30px;
  text-align: center;
  color: #666;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-state h3 {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 18px;
}

.empty-state p {
  margin: 0 0 20px 0;
  color: #666;
  font-size: 14px;
}

.browse-btn {
  background-color: #2e7d32;
  color: white;
  padding: 10px 20px;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.3s ease;
}

.browse-btn:hover {
  background-color: #27682b;
}

/* 載入狀態 */
.loading-state {
  padding: 40px;
  text-align: center;
  color: #666;
}

/* 響應式設計 */
@media (max-width: 1200px) {
  .veggie-cards-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
}

/* 平板尺寸 */
@media (max-width: 1024px) {
  .other-dropdown {
    min-width: 350px;
    max-width: 500px;
    grid-template-columns: repeat(3, 1fr);
  }
}

/* 手機尺寸 */
@media (max-width: 768px) {
  .food-category-section {
    flex-wrap: wrap;
    margin: 0 20px 20px 20px;
  }

  .category-left {
    width: 100%;
    margin-bottom: 10px;
  }

  .category-center {
    width: 100%;
    overflow-x: auto;
    padding-bottom: 8px;
  }

  .other-dropdown {
    min-width: 280px;
    max-width: 90vw;
    grid-template-columns: repeat(2, 1fr);
    left: 50%;
    transform: translateX(-50%);
  }

  .veggie-cards-grid {
    padding: 0 20px 40px 20px;
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .veggie-collection-card {
    min-height: 260px;
  }

  .veggie-image-container {
    height: 180px;
  }

  .empty-state {
    padding: 40px 20px;
  }
}

@media (max-width: 480px) {
  .other-dropdown {
    min-width: 250px;
    max-width: 95vw;
    grid-template-columns: 1fr;
  }

  .veggie-cards-grid {
    padding: 0 16px 30px 16px;
  }

  .veggie-actions {
    flex-direction: column;
    gap: 8px;
    padding: 12px;
  }

  .action-btn {
    padding: 10px;
  }
}
</style>
