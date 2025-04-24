<template>
  <div class="sidebar-section">
    <h3>相關產品比較</h3>

    <div class="product-comparison">
      <div class="product-item">
        <div class="product-icon">🥕</div>
        <div class="product-detail">
          <div class="product-name">有機紅蘿蔔</div>
          <div class="product-origin">臺灣南投</div>
          <div class="product-price">$58/公斤</div>
          <div class="price-trend up">↑</div>
        </div>
      </div>

      <div class="product-item">
        <div class="product-icon">🥕</div>
        <div class="product-detail">
          <div class="product-name">進口紅蘿蔔</div>
          <div class="product-origin">澳洲進口</div>
          <div class="product-price">$49/公斤</div>
          <div class="price-trend up">↑</div>
        </div>
      </div>

      <div class="product-item">
        <div class="product-icon">🥕</div>
        <div class="product-detail">
          <div class="product-name">嬰兒紅蘿蔔</div>
          <div class="product-origin">臺灣雲林</div>
          <div class="product-price">$85/公斤</div>
          <div class="price-trend up">↑</div>
        </div>
      </div>

      <div class="product-item">
        <div class="product-icon">🥬</div>
        <div class="product-detail">
          <div class="product-name">白蘿蔔</div>
          <div class="product-origin">臺灣宜蘭</div>
          <div class="product-price">$22/公斤</div>
          <div class="price-trend down">↓</div>
        </div>
      </div>
    </div>

    <button class="add-to-cart-btn">加入購物清單</button>
  </div>
</template>

<script setup>
// 可以添加處理購物車邏輯
const addToCart = () => {
  console.log("加入購物清單");
};
</script>

<style scoped>
.sidebar-section {
  background-color: #f9f9f9;
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 8px;
}

.sidebar-section h3 {
  margin-top: 0;
  color: #333;
  font-size: 18px;
}

/* 產品比較 */
.product-comparison {
  margin-bottom: 15px;
}

.product-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.product-item:last-child {
  border-bottom: none;
}

.product-icon {
  font-size: 24px;
  margin-right: 10px;
}

.product-detail {
  flex: 1;
}

.product-name {
  font-weight: bold;
}

.product-origin {
  font-size: 12px;
  color: #666;
}

.product-price {
  font-weight: bold;
  color: #e57373;
}

.price-trend {
  display: inline-block;
  margin-left: 5px;
}

.price-trend.up {
  color: #4caf50;
}

.price-trend.down {
  color: #f44336;
}

.add-to-cart-btn {
  width: 100%;
  padding: 8px;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-top: 10px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.add-to-cart-btn:hover {
  background-color: #e0e0e0;
}
</style>
