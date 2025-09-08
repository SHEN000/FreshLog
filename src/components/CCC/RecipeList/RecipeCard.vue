<template>
  <div class="recipe-card" @click="goToDetail">
    <!-- 推薦標籤 -->
    <div v-if="recipe.isRecommended" class="recommend-badge">推薦</div>

    <!-- 圖片區域 -->
    <div class="image-container">
      <!-- 載入狀態 -->
      <div v-if="imageLoading" class="image-loading">
        <span>載入中...</span>
      </div>

      <!-- 錯誤狀態 -->
      <div v-else-if="imageErrorCount > maxRetries" class="image-error">
        <span>🖼️</span>
        <span>圖片載入失敗</span>
        <small>{{ recipe.name }}</small>
      </div>

      <!-- 正常圖片 -->
      <img
        v-else
        :src="$img(recipe.image)"
        :alt="recipe.name"
        class="recipe-image"
        @load="handleImageLoad"
        @error="handleImageError"
      />
    </div>

    <!-- 內容區域 -->
    <div class="content-area">
      <h3 class="recipe-title">{{ recipe.name }}</h3>
      <p class="recipe-description">{{ recipe.description }}</p>

      <!-- 資訊列 -->
      <div class="info-row">
        <span class="info-item">
          <span class="info-label">難度</span>
          <span class="info-value">{{ recipe.difficulty }}</span>
        </span>
        <span class="info-item">
          <span class="info-label">時間</span>
          <span class="info-value">{{ recipe.cookTime }}</span>
        </span>
        <span class="info-item">
          <span class="info-label">份量</span>
          <span class="info-value">{{ recipe.servings }}人</span>
        </span>
      </div>

      <!-- 標籤列 -->
      <div class="tags-row">
        <span
          v-for="tag in recipe.tags"
          :key="tag"
          class="recipe-tag"
          :class="getTagClass(tag)"
        >
          {{ tag }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from "vue";
import { useRouter } from "vue-router";

const props = defineProps({
  recipe: {
    type: Object,
    required: true,
  },
});

const router = useRouter();

// 圖片狀態管理
const imageLoading = ref(true);
const imageErrorCount = ref(0);
const maxRetries = 3;
const retryDelay = 20000; // 20秒
let retryTimeout = null;

// 前往詳情頁
const goToDetail = () => {
  router.push(`/ai-recommendation/${props.recipe.id}`);
};

// 圖片載入成功
const handleImageLoad = () => {
  imageLoading.value = false;
  imageErrorCount.value = 0; // 重置錯誤計數
  console.log(`✅ 圖片載入成功: ${props.recipe.name}`);
};

// 處理圖片載入錯誤 - 改良版
const handleImageError = (event) => {
  const img = event.target;
  const currentSrc = img.src;

  imageLoading.value = false;

  // 避免無限迴圈：如果已經是預設圖片，就不再重試
  if (currentSrc.includes("/images/placeholder/recipe-placeholder.jpg")) {
    console.warn(`🖼️ 預設圖片也載入失敗: ${props.recipe.name}`);
    imageErrorCount.value = maxRetries + 1; // 直接設為超過上限
    return;
  }

  imageErrorCount.value++;
  console.log(
    `🔄 圖片載入失敗 (第${imageErrorCount.value}次): ${props.recipe.name}`
  );

  // 如果超過最大重試次數，停止重試
  if (imageErrorCount.value > maxRetries) {
    console.error(
      `❌ 圖片載入失敗超過${maxRetries}次，停止重試: ${props.recipe.name}`
    );
    return;
  }

  // 清除之前的重試計時器
  if (retryTimeout) {
    clearTimeout(retryTimeout);
  }

  // 設置20秒後重試預設圖片
  retryTimeout = setTimeout(() => {
    console.log(`🔄 20秒後重試載入預設圖片: ${props.recipe.name}`);
    imageLoading.value = true;
    img.src = "/images/placeholder/recipe-placeholder.jpg";
  }, retryDelay);
};

// 取得標籤樣式類別
const getTagClass = (tag) => {
  const tagClassMap = {
    素食: "tag-vegetarian",
    簡單: "tag-easy",
    烘焙: "tag-baking",
    甜點: "tag-dessert",
    辣味: "tag-spicy",
    湯品: "tag-soup",
  };
  return tagClassMap[tag] || "tag-default";
};

// 清理計時器
onUnmounted(() => {
  if (retryTimeout) {
    clearTimeout(retryTimeout);
  }
});
</script>

<style scoped>
.recipe-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.recipe-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.recommend-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background-color: #4caf50;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  z-index: 2;
}

.image-container {
  height: 200px;
  overflow: hidden;
  position: relative;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
  color: #666;
  font-size: 14px;
}

.image-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: #f0f0f0;
  border: 2px dashed #ccc;
  color: #999;
  text-align: center;
  padding: 16px;
  box-sizing: border-box;
}

.image-error span:first-child {
  font-size: 32px;
  margin-bottom: 8px;
}

.image-error small {
  font-size: 12px;
  margin-top: 4px;
  opacity: 0.7;
}

.recipe-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.recipe-card:hover .recipe-image {
  transform: scale(1.05);
}

.content-area {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 200px;
}

.recipe-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.recipe-description {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  margin-bottom: 16px;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  font-size: 13px;
  flex-wrap: nowrap;
}

.info-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  flex: 1;
  min-width: 0;
}

.info-label {
  color: #999;
  margin-bottom: 4px;
  font-size: 12px;
}

.info-value {
  color: #333;
  font-weight: 500;
  font-size: 13px;
}

.tags-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: auto;
  max-height: 60px;
  overflow: hidden;
}

.recipe-tag {
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
}

/* 標籤顏色 */
.tag-vegetarian {
  background-color: #e8f5e8;
  color: #2e7d32;
}

.tag-easy {
  background-color: #fff3e0;
  color: #f57c00;
}

.tag-baking {
  background-color: #fce4ec;
  color: #c2185b;
}

.tag-dessert {
  background-color: #f3e5f5;
  color: #7b1fa2;
}

.tag-spicy {
  background-color: #ffebee;
  color: #d32f2f;
}

.tag-soup {
  background-color: #e3f2fd;
  color: #1976d2;
}

.tag-default {
  background-color: #f5f5f5;
  color: #757575;
}

/* 響應式調整 */
@media (max-width: 768px) {
  .image-container {
    height: 160px;
  }

  .content-area {
    padding: 16px;
    min-height: 180px;
  }

  .recipe-title {
    font-size: 16px;
  }

  .recipe-description {
    font-size: 13px;
  }

  .info-row {
    font-size: 12px;
  }

  .info-label {
    font-size: 11px;
  }

  .info-value {
    font-size: 12px;
  }
}
</style>
