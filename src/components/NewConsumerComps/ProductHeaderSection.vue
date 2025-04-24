<template>
  <div class="product-header-section">
    <div class="product-info">
      <h1 class="product-title">紅蘿蔔 Carrot</h1>
      <p class="product-category">根莖類蔬菜 / 餐飲設計 > 時尚 > 營養</p>

      <div class="price-tags">
        <div class="price-tag">最新平均價格: $35/公斤</div>
        <div class="stock-tag">市場供應量30%，預期價格趨勢向上</div>
      </div>
    </div>

    <div class="product-image">
      <div class="image-placeholder">🥕</div>
    </div>
  </div>
</template>

<script setup>
// 可以添加動態獲取產品資訊的邏輯
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

.product-title {
  font-size: 24px;
  margin: 0;
  color: #333;
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
}

.image-placeholder {
  font-size: 50px;
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
