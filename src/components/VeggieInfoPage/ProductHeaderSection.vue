<template>
  <div class="product-header-section">
    <div class="product-info">
      <div class="title-with-favorite">
        <h1 class="product-title">紅蘿蔔 Carrot</h1>
        <button
          @click="toggleFavorite"
          class="favorite-btn"
          :class="{ active: isFavorite }"
        >
          ❤
        </button>
      </div>
      <p class="product-category">根莖類蔬菜 / 適合涼拌、熱炒、燉煮</p>

      <div class="price-tags">
        <div class="price-tag">最新平均價格: $35/公斤</div>
        <div class="stock-tag">價格飆漲超過 20%，建議選購替代品</div>
      </div>
    </div>

    <div class="product-image">
      <div class="seasonal-badge">當季推薦</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

// 是否已加入我的最愛
const isFavorite = ref(false);

// 切換我的最愛狀態
const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value;

  if (isFavorite.value) {
    // 如果加入最愛，可以在這裡添加通知訊息
    console.log("已加入我的最愛");
    // 在實際應用中，這裡可以呼叫 API 將商品加入使用者的最愛列表
  } else {
    console.log("已從我的最愛中移除");
    // 在實際應用中，這裡可以呼叫 API 將商品從使用者的最愛列表中移除
  }
};
</script>

<style scoped>
.product-header-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.title-with-favorite {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}

.product-title {
  font-size: 24px;
  margin: 0;
  color: #333;
  margin-right: 10px;
}

.favorite-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #ddd;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin: 0;
}

.favorite-btn.active {
  color: #ff4757;
  animation: pulse 0.5s;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

.product-category {
  color: #666;
  margin: 5px 0 15px;
  font-size: 14px;
}

.price-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.price-tag,
.stock-tag {
  background-color: #ffa726;
  color: white;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 14px;
}

.stock-tag {
  background-color: #ef5350;
}

.product-image {
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9f9f9;
  border-radius: 50%;
  margin-left: 20px;
  position: relative;
  background-image: url("/carrot-icon.png");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.seasonal-badge {
  position: absolute;
  top: -10px;
  right: -10px;
  background-color: #4caf50;
  color: white;
  font-size: 12px;
  padding: 3px 6px;
  border-radius: 4px;
}

@media (max-width: 768px) {
  .product-header-section {
    flex-direction: column;
  }

  .product-image {
    margin: 15px auto 0;
  }
}
</style>
