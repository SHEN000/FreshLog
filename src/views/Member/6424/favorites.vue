<template>
  <div class="favorites-container">
    <!-- 分類標籤 -->
    <div class="collection-filters">
      <button
        v-for="filter in collectionFilters"
        :key="filter.id"
        :class="['filter-tag', { active: activeFilter === filter.id }]"
        @click="setActiveFilter(filter.id)"
      >
        {{ filter.label }}
      </button>
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

const router = useRouter();

// 響應式狀態
const isLoading = ref(false);
const activeFilter = ref("all");

// 分類篩選選項
const collectionFilters = [
  { id: "all", label: "全部" },
  { id: "vegetarian", label: "素食" },
  { id: "hot", label: "熱門" },
  { id: "quick", label: "快炒" },
];

// 收藏的食譜數據（假資料）
const collectionRecipes = ref([
  {
    id: "R001",
    name: "蕃茄炒蛋",
    cookTime: "15分鐘",
    difficulty: "簡單",
    category: "quick",
    image: "/images/recipes/tomato-egg.jpg",
    tags: ["家常菜", "簡單"],
  },
  {
    id: "R002",
    name: "蔬菜湯",
    cookTime: "30分鐘",
    difficulty: "簡單",
    category: "vegetarian",
    image: "/images/recipes/vegetable-soup.jpg",
    tags: ["素食", "湯品"],
  },
  {
    id: "R003",
    name: "涼拌小黃瓜",
    cookTime: "20分鐘",
    difficulty: "普通",
    category: "vegetarian",
    image: "/images/recipes/cucumber-salad.jpg",
    tags: ["涼拌", "素食"],
  },
  {
    id: "R004",
    name: "宮保雞丁",
    cookTime: "25分鐘",
    difficulty: "普通",
    category: "hot",
    image: "/images/recipes/kung-pao-chicken.jpg",
    tags: ["熱門", "川菜"],
  },
  {
    id: "R005",
    name: "青椒肉絲",
    cookTime: "18分鐘",
    difficulty: "簡單",
    category: "quick",
    image: "/images/recipes/pepper-pork.jpg",
    tags: ["快炒", "家常菜"],
  },
  {
    id: "R006",
    name: "麻婆豆腐",
    cookTime: "22分鐘",
    difficulty: "困難",
    category: "hot",
    image: "/images/recipes/mapo-tofu.jpg",
    tags: ["熱門", "川菜", "素食"],
  },
]);

// 計算篩選後的收藏食譜
const filteredCollectionRecipes = computed(() => {
  if (activeFilter.value === "all") {
    return collectionRecipes.value;
  }
  return collectionRecipes.value.filter(
    (recipe) => recipe.category === activeFilter.value
  );
});

// 設定活動篩選器
const setActiveFilter = (filterId) => {
  activeFilter.value = filterId;
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

    // 🔧 TODO: 這裡替換成真實的 API 呼叫
    // const response = await favoritesApi.removeFavorite(recipeId)
    // if (response.success) {

    // 模擬 API 延遲
    await new Promise((resolve) => setTimeout(resolve, 500));

    // 從本地數據中移除
    collectionRecipes.value = collectionRecipes.value.filter(
      (recipe) => recipe.id !== recipeId
    );

    // 可以使用 toast 通知替代 alert
    alert("已從收藏中移除");

    // }
  } catch (error) {
    console.error("移除收藏失敗:", error);
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

    // 🔧 TODO: 這裡替換成真實的 API 呼叫
    // const response = await favoritesApi.getFavoritesList()
    // collectionRecipes.value = response.data

    console.log("🍳 載入收藏食譜列表");
  } catch (error) {
    console.error("載入收藏失敗:", error);
  } finally {
    isLoading.value = false;
  }
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
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* 分類篩選標籤 */
.collection-filters {
  padding: 0 30px 20px 30px;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.filter-tag {
  padding: 8px 16px;
  border: 1px solid #2e7d32;
  border-radius: 20px;
  background: transparent;
  color: #2e7d32;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.filter-tag:hover {
  background-color: #2196f3;
  color: white;
  border-color: #2196f3;
}

.filter-tag.active {
  background-color: #2196f3;
  color: white;
  border-color: #2196f3;
}

/* 食譜卡片網格 */
.recipe-cards-grid {
  padding: 0 30px 30px 30px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  flex: 1;
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
  height: 120px;
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
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
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
  padding: 15px;
  display: flex;
  gap: 10px;
  border-top: 1px solid #f0f0f0;
}

.action-btn {
  flex: 1;
  padding: 8px;
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
  .collection-filters {
    padding: 0 20px 15px 20px;
  }

  .recipe-cards-grid {
    padding: 0 20px 20px 20px;
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .empty-state {
    padding: 40px 20px;
  }

  .filter-tag {
    font-size: 13px;
    padding: 6px 12px;
  }
}

@media (max-width: 480px) {
  .recipe-actions {
    flex-direction: column;
    gap: 8px;
  }

  .action-btn {
    padding: 10px;
  }
}
</style>
