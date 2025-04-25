<template>
  <div class="sidebar-section">
    <div class="farmer-section">
      <h3>小農直購專區</h3>

      <div class="farmer-profile">
        <div class="farmer-avatar">👨‍🌾</div>
        <div class="farmer-info">
          <div class="farmer-name">張大明 - 綠野蔬場</div>
          <div class="farmer-location">花蓮縣 / 有機認證</div>
          <div class="farmer-rating">
            <span class="stars">★★★★★</span> 4.7 (190則評價)
          </div>
        </div>
      </div>

      <div class="farmer-price">特惠價: $28/公斤</div>
      <div class="farmer-stock">剩餘數量: 25公斤</div>

      <button class="add-to-cart-btn green">直接購買</button>

      <div class="farmer-contact">
        <div class="contact-item">
          <span class="contact-icon">📞</span> 聯絡生產者
        </div>
        <div class="contact-item">
          <span class="contact-icon">📍</span> 追蹤銷售地
        </div>
        <div class="contact-item">
          <span class="contact-icon">✓</span> 自取優惠更便宜，台北專車運送
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 可以添加購買和聯絡功能的邏輯
const buyDirect = () => {
  console.log("直接購買流程");
};

const contactFarmer = () => {
  console.log("聯絡小農");
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

/* 小農區塊 */
.farmer-profile {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.farmer-avatar {
  font-size: 40px;
  margin-right: 15px;
}

.farmer-info {
  flex: 1;
}

.farmer-name {
  font-weight: bold;
  margin-bottom: 3px;
}

.farmer-location,
.farmer-rating {
  font-size: 12px;
  color: #666;
  margin-bottom: 3px;
}

.stars {
  color: #ffc107;
}

.farmer-price {
  font-size: 18px;
  font-weight: bold;
  color: #4caf50;
  margin: 10px 0 5px;
}

.farmer-stock {
  font-size: 14px;
  color: #666;
  margin-bottom: 15px;
}

.add-to-cart-btn {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 4px;
  margin-top: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
}

.add-to-cart-btn.green {
  background-color: #4caf50;
  color: white;
}

.add-to-cart-btn.green:hover {
  background-color: #388e3c;
}

.farmer-contact {
  margin-top: 15px;
  font-size: 13px;
}

.contact-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  cursor: pointer;
}

.contact-icon {
  margin-right: 8px;
}
</style>
