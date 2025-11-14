<template>
  <div class="favorites-container">
    <!-- 分類標籤 - 仿照食譜列表樣式 -->
    <div class="category-tags-container">
      <div class="tags-wrapper">
        <!-- 固定的分類按鈕 -->
        <button
          v-for="tag in categoryTags"
          :key="tag.id"
          :class="['category-tag', { active: activeFilter === tag.id }]"
          @click="setActiveFilter(tag.id)"
        >
          {{ tag.label }}
        </button>

        <!-- 更多按鈕（帶下拉選單） -->
        <div
          class="custom-dropdown"
          @mouseenter="handleMouseEnter"
          @mouseleave="handleMouseLeave"
        >
          <button
            :class="[
              'category-tag',
              'custom-tag',
              { active: isCustomCategoryActive },
            ]"
          >
            更多 ▼
          </button>

          <!-- 下拉選單 -->
          <div
            v-if="showDropdown && filteredCategoryOptions.length > 0"
            class="dropdown-menu"
          >
            <button
              v-for="(category, index) in filteredCategoryOptions"
              :key="index"
              class="dropdown-item"
              @click="selectCustomCategory(category)"
            >
              {{ category }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 收藏食譜卡片 -->
    <div class="recipe-cards-grid" v-if="filteredCollectionRecipes.length > 0">
      <div
        v-for="recipe in filteredCollectionRecipes"
        :key="recipe.id"
        class="recipe-collection-card"
      >
        <!-- 食譜圖片 -->
        <div class="recipe-image-container">
          <img
            :src="$img(recipe.image)"
            :alt="recipe.name"
            class="recipe-image"
            @error="handleImageError"
          />
        </div>

        <!-- 食譜資訊 -->
        <div class="recipe-info">
          <h3 class="recipe-name">{{ recipe.name }}</h3>
          <div class="recipe-meta">
            <span class="cook-time">{{ recipe.cookTime }}</span>
            <span class="difficulty-tag" :class="recipe.difficulty">{{
              recipe.difficulty
            }}</span>
          </div>
        </div>

        <!-- 操作按鈕 -->
        <div class="recipe-actions">
          <button class="action-btn view-btn" @click="viewRecipe(recipe.id)">
            查看
          </button>
          <button
            class="action-btn remove-btn"
            @click="removeFromCollection(recipe.id)"
          >
            刪除
          </button>
        </div>
      </div>
    </div>

    <!-- 空狀態 -->
    <div v-else class="empty-state">
      <div class="empty-icon">📝</div>
      <h3>尚無收藏的食譜</h3>
      <p>開始探索並收藏您喜愛的食譜吧！</p>
      <RouterLink to="/ai-recommendation" class="browse-btn">
        瀏覽食譜
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
const showDropdown = ref(false);
let hideTimeout = null;

// 食譜分類標籤（對應食譜列表的主要分類）
const categoryTags = [
  { id: "all", label: "全部" },
  { id: "stir_fry", label: "熱炒" },
  { id: "cold_dish", label: "涼拌" },
  { id: "dessert", label: "甜點" },
  { id: "soup", label: "湯品" },
  { id: "stew", label: "燉煮" },
  { id: "frying", label: "煎炸" },
];

// 更多分類選項（下拉選單內容）
const categoryOptions = ["烘焙", "蒸煮", "飲品"];

// 收藏的食譜數據（從 API 載入）
const collectionRecipes = ref([]);

// 計算篩選後的收藏食譜
const filteredCollectionRecipes = computed(() => {
  console.log("🔍 當前篩選:", activeFilter.value);

  if (activeFilter.value === "all") {
    return collectionRecipes.value;
  }

  // 處理自選分類（custom:xxx）
  if (activeFilter.value.startsWith("custom:")) {
    const customCategory = activeFilter.value.replace("custom:", "");
    const mappedCustomId = mapCategory(customCategory);
    console.log(`🔍 自選分類: "${customCategory}", 映射 ID: "${mappedCustomId}"`);

    return collectionRecipes.value.filter(
      (recipe) => recipe.category === mappedCustomId
    );
  }

  // 一般分類篩選
  const filtered = collectionRecipes.value.filter(
    (recipe) => recipe.category === activeFilter.value
  );

  console.log(`🔍 篩選結果: ${filtered.length} 筆`);
  return filtered;
});

// 判斷是否選中了自選分類
const isCustomCategoryActive = computed(() => {
  return activeFilter.value.startsWith("custom:");
});

// 過濾掉已經在預設按鈕中的分類選項
const filteredCategoryOptions = computed(() => {
  const defaultCategoryLabels = categoryTags.map((tag) => tag.label);
  return categoryOptions.filter((category) => {
    return !defaultCategoryLabels.includes(category) && category !== "ALL";
  });
});

// 設定活動篩選器
const setActiveFilter = (filterId) => {
  activeFilter.value = filterId;
  showDropdown.value = false;
};

// 鼠標移入時顯示選單
const handleMouseEnter = () => {
  if (hideTimeout) {
    clearTimeout(hideTimeout);
    hideTimeout = null;
  }
  showDropdown.value = true;
};

// 鼠標移出時延遲隱藏選單
const handleMouseLeave = () => {
  hideTimeout = setTimeout(() => {
    showDropdown.value = false;
  }, 200);
};

// 選擇自選分類
const selectCustomCategory = (categoryName) => {
  if (hideTimeout) {
    clearTimeout(hideTimeout);
    hideTimeout = null;
  }
  activeFilter.value = `custom:${categoryName}`;
  showDropdown.value = false;
};

// 查看食譜
const viewRecipe = (recipeId) => {
  router.push(`/ai-recommendation/${recipeId}`);
};

// 從收藏中移除
const removeFromCollection = async (recipeId) => {
  if (!confirm("確定要從收藏中移除這個食譜嗎？")) {
    return;
  }

  try {
    isLoading.value = true;
    console.log("🗑️ 開始移除收藏:", recipeId);

    const response = await favoriteApi.removeRecipeFavorite(recipeId);
    console.log("📥 刪除 API 回應:", response);

    // 檢查 API 回應是否成功
    if (
      response.data &&
      (response.data.code === "0000" || response.data.message === "SUCCESS")
    ) {
      // 從本地數據中移除
      collectionRecipes.value = collectionRecipes.value.filter(
        (recipe) => recipe.id !== recipeId
      );

      console.log("✅ 已從收藏中移除");
      alert("已從收藏中移除");
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
  event.target.src = "/images/placeholder/recipe-placeholder.jpg";
};

// 載入收藏列表
const loadFavorites = async () => {
  try {
    isLoading.value = true;
    console.log("🍳 開始載入收藏食譜列表...");

    const response = await favoriteApi.getRecipeFavoriteList("ALL");
    console.log("📥 API 回應:", response);

    if (response.data && response.data.data) {
      // 將 API 資料格式轉換成元件需要的格式
      collectionRecipes.value = response.data.data.map((item) => {
        const mappedCategory = mapCategory(item.category);
        console.log(`🔍 食譜: ${item.name}, 原始分類: "${item.category}", 轉換後: "${mappedCategory}"`);

        return {
          id: item.recipeId,
          name: item.name,
          cookTime: `${item.cookTimeMinutes}分鐘`,
          difficulty: "簡單", // API 沒有提供難度，使用預設值
          category: mappedCategory, // 轉換分類
          image: item.image,
          tags: [item.category],
        };
      });

      console.log(
        "✅ 收藏列表載入成功，共",
        collectionRecipes.value.length,
        "筆"
      );
      console.log("📋 完整收藏列表:", collectionRecipes.value);
    } else {
      console.warn("⚠️ API 回應格式不符預期:", response.data);
      collectionRecipes.value = [];
    }
  } catch (error) {
    console.error("❌ 載入收藏失敗:", error);
    collectionRecipes.value = [];
  } finally {
    isLoading.value = false;
  }
};

// 將 API 的分類對應到本地分類
const mapCategory = (apiCategory) => {
  if (!apiCategory) return "all";

  const categoryMap = {
    // 中文對應
    熱炒: "stir_fry",
    涼拌: "cold_dish",
    甜點: "dessert",
    湯品: "soup",
    燉煮: "stew",
    煎炸: "frying",
    烘焙: "baking",
    蒸煮: "steaming",
    飲品: "drink",
    // 英文對應
    "stir_fry": "stir_fry",
    "cold_dish": "cold_dish",
    "dessert": "dessert",
    "soup": "soup",
    "stew": "stew",
    "frying": "frying",
    "baking": "baking",
    "steaming": "steaming",
    "drink": "drink",
  };
  return categoryMap[apiCategory] || "all";
};

// 初始化
onMounted(() => {
  loadFavorites();
});

// 暴露給父元件的方法（可選）
defineExpose({
  loadFavorites,
  removeFromCollection,
});
</script>

<style scoped>
.favorites-container {
  display: flex;
  flex-direction: column;
  overflow: visible;
}

/* 分類標籤 - 仿照食譜列表樣式 */
.category-tags-container {
  margin: 0 30px 24px 30px;
  overflow: visible;
}

.tags-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

.category-tag {
  padding: 10px 18px;
  border: 2px solid #2e7d32;
  border-radius: 25px;
  background: transparent;
  color: #2e7d32;
  cursor: pointer;
  font-size: 15px;
  font-weight: 500;
  transition: all 0.3s ease;
  white-space: nowrap;
  user-select: none;
}

.category-tag:hover {
  background-color: #1976d2 !important;
  border-color: #1976d2 !important;
  color: white !important;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.category-tag.active {
  background-color: #1976d2;
  border-color: #1976d2;
  color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

/* 自選按鈕下拉選單 */
.custom-dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 150px;
  max-height: 300px;
  overflow-y: auto;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
}

/* 用偽元素創建按鈕和選單之間的不可見橋接區域 */
.dropdown-menu::before {
  content: "";
  position: absolute;
  top: -8px;
  left: 0;
  right: 0;
  height: 8px;
  background: transparent;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dropdown-item {
  display: block;
  width: 100%;
  padding: 10px 16px;
  text-align: left;
  background: transparent;
  border: none;
  color: #333;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.dropdown-item:hover {
  background-color: #1976d2;
  color: white;
}

.dropdown-item:first-child {
  border-radius: 8px 8px 0 0;
}

.dropdown-item:last-child {
  border-radius: 0 0 8px 8px;
}

/* 食譜卡片網格 */
.recipe-cards-grid {
  padding: 0 30px 30px 30px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.recipe-collection-card {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
}

.recipe-collection-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 圖片區域 */
.recipe-image-container {
  height: 200px;
  overflow: hidden;
  background-color: #f5f5f5;
}

.recipe-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.recipe-collection-card:hover .recipe-image {
  transform: scale(1.05);
}

/* 食譜資訊 */
.recipe-info {
  padding: 15px;
  flex: 1;
}

.recipe-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
  line-height: 1.4;
}

.recipe-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
}

.cook-time {
  color: #666;
  font-weight: 500;
}

.difficulty-tag {
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 13px;
  font-weight: 500;
}

.difficulty-tag.簡單 {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.difficulty-tag.普通 {
  background-color: #fff3e0;
  color: #f57c00;
}

.difficulty-tag.困難 {
  background-color: #ffebee;
  color: #d32f2f;
}

/* 操作按鈕 */
.recipe-actions {
  padding: 12px;
  display: flex;
  gap: 10px;
  border-top: 1px solid #f0f0f0;
}

.action-btn {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
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
  .recipe-cards-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .category-tags-container {
    margin: 0 20px 20px 20px;
  }

  .tags-wrapper {
    gap: 6px;
  }

  .category-tag {
    padding: 6px 12px;
    font-size: 13px;
  }

  .recipe-cards-grid {
    padding: 0 20px 20px 20px;
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .empty-state {
    padding: 40px 20px;
  }
}

@media (max-width: 480px) {
  .tags-wrapper {
    justify-content: center;
  }

  .category-tag {
    padding: 6px 10px;
    font-size: 12px;
  }

  .recipe-actions {
    flex-direction: column;
    gap: 8px;
  }

  .action-btn {
    padding: 10px;
  }
}
</style>
