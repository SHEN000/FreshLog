<template>
  <div class="veggie-favorites-container">
    <!-- 分類標籤 -->
    <div class="collection-filters">
      <button
        v-for="filter in veggieFilters"
        :key="filter.id"
        :class="['filter-tag', { active: activeFilter === filter.id }]"
        @click="setActiveFilter(filter.id)"
      >
        {{ filter.label }}
      </button>
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
            <span class="veggie-price">售價：{{ veggie.price }}</span>
            <span class="veggie-category-tag" :class="veggie.category">{{
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

const router = useRouter();

// 響應式狀態
const isLoading = ref(false);
const activeFilter = ref("all");

// 蔬菜分類篩選選項
const veggieFilters = [
  { id: "all", label: "全部" },
  { id: "root", label: "根莖類" },
  { id: "leafy", label: "葉菜類" },
  { id: "fruit", label: "果菜類" },
  { id: "bean", label: "瓜果類" },
  { id: "mushroom", label: "菇類" },
  { id: "bean-pod", label: "豆類" },
];

// 收藏的蔬菜數據（假資料）
const veggieCollection = ref([
  {
    id: "V001",
    name: "番茄",
    price: "台灣",
    category: "fruit",
    categoryLabel: "果菜類",
    image: "/images/veggies/tomato.jpg",
    tags: ["維生素C", "抗氧化"],
  },
  {
    id: "V002",
    name: "高麗菜",
    price: "新化",
    category: "leafy",
    categoryLabel: "葉菜類",
    image: "/images/veggies/cabbage.jpg",
    tags: ["葉菜類", "纖維"],
  },
  {
    id: "V003",
    name: "胡蘿蔔",
    price: "雲林",
    category: "root",
    categoryLabel: "根莖類",
    image: "/images/veggies/carrot.jpg",
    tags: ["維生素A", "護眼"],
  },
  {
    id: "V004",
    name: "青椒",
    price: "彰化",
    category: "fruit",
    categoryLabel: "果菜類",
    image: "/images/veggies/green-pepper.jpg",
    tags: ["維生素C", "果菜"],
  },
  {
    id: "V005",
    name: "菠菜",
    price: "台中",
    category: "leafy",
    categoryLabel: "葉菜類",
    image: "/images/veggies/spinach.jpg",
    tags: ["葉酸", "鐵質"],
  },
  {
    id: "V006",
    name: "白蘿蔔",
    price: "台南",
    category: "root",
    categoryLabel: "根莖類",
    image: "/images/veggies/daikon.jpg",
    tags: ["消化", "纖維"],
  },
]);

// 計算篩選後的收藏蔬菜
const filteredVeggieCollection = computed(() => {
  if (activeFilter.value === "all") {
    return veggieCollection.value;
  }
  return veggieCollection.value.filter(
    (veggie) => veggie.category === activeFilter.value
  );
});

// 設定活動篩選器
const setActiveFilter = (filterId) => {
  activeFilter.value = filterId;
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

    // 🔧 TODO: 這裡替換成真實的 API 呼叫
    // const response = await veggieApi.removeFavorite(veggieId)
    // if (response.success) {

    // 模擬 API 延遲
    await new Promise((resolve) => setTimeout(resolve, 500));

    // 從本地數據中移除
    veggieCollection.value = veggieCollection.value.filter(
      (veggie) => veggie.id !== veggieId
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
  event.target.src = "/images/placeholder/veggie-placeholder.jpg";
};

// 載入收藏列表
const loadVeggieFavorites = async () => {
  try {
    isLoading.value = true;

    // 🔧 TODO: 這裡替換成真實的 API 呼叫
    // const response = await veggieApi.getFavoritesList()
    // veggieCollection.value = response.data

    console.log("🥬 載入收藏蔬菜列表");
  } catch (error) {
    console.error("載入收藏失敗:", error);
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

/* 蔬菜卡片網格 */
.veggie-cards-grid {
  padding: 0 30px 50px 30px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  flex: 1;
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
  height: 140px;
  overflow: hidden;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.veggie-image {
  width: 80%;
  height: 80%;
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
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
}

.veggie-price {
  color: #666;
  font-weight: 500;
}

.veggie-category-tag {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
}

.veggie-category-tag.root {
  background-color: #fff3e0;
  color: #f57c00;
}

.veggie-category-tag.leafy {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.veggie-category-tag.fruit {
  background-color: #fce4ec;
  color: #c2185b;
}

.veggie-category-tag.bean {
  background-color: #e3f2fd;
  color: #1976d2;
}

.veggie-category-tag.mushroom {
  background-color: #f3e5f5;
  color: #7b1fa2;
}

.veggie-category-tag.bean-pod {
  background-color: #e0f2f1;
  color: #00695c;
}

/* 操作按鈕 */
.veggie-actions {
  padding: 16px;
  display: flex;
  gap: 12px;
  border-top: 1px solid #f0f0f0;
  flex-shrink: 0;
  margin-top: auto;
}

.action-btn {
  flex: 1;
  padding: 10px 8px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
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

@media (max-width: 768px) {
  .collection-filters {
    padding: 0 20px 15px 20px;
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
    height: 120px;
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
