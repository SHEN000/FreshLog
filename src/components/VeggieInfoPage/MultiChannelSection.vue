<template>
  <div class="multi-channel-section">
    <h2>多通路價格比較與CP值排序</h2>
    <p class="section-desc">幫您比較市面各大超市、線上超市和產地價的價格排行</p>

    <div class="channel-cards">
      <div class="channel-card highlighted">
        <div class="channel-card-header">
          <span class="channel-type">批發市場-本季紅蘿蔔</span>
          <span class="best-value-tag">最佳CP值</span>
        </div>

        <div class="channel-card-image">
          <div class="product-img-placeholder"></div>
        </div>

        <div class="channel-card-price">NT$30/公斤</div>

        <div class="rating-bars">
          <div class="rating-bar">
            <div class="rating-name">品質分數</div>
            <div class="rating-track">
              <div class="rating-fill" style="width: 80%"></div>
            </div>
            <div class="rating-score">50</div>
          </div>

          <div class="rating-bar">
            <div class="rating-name">CP值</div>
            <div class="rating-track">
              <div class="rating-fill" style="width: 90%"></div>
            </div>
            <div class="rating-score">3.68</div>
          </div>
        </div>

        <div class="channel-card-desc">
          <p>
            $30元/公斤 /
            台中產銷履歷認證產地CP值，實體採購需現場購買，運費自付15元內，批量更優惠，不用比價。
          </p>
        </div>

        <div class="card-actions">
          <button class="card-btn">聯絡廠商</button>
          <button class="card-btn">查詢運費</button>
        </div>
      </div>

      <div class="channel-card">
        <div class="channel-card-header">
          <span class="channel-type">古林有機紅蘿蔔</span>
        </div>

        <div class="channel-card-image">
          <div class="product-img-placeholder"></div>
        </div>

        <div class="channel-card-price">NT$65/公斤</div>

        <div class="rating-bars">
          <div class="rating-bar">
            <div class="rating-name">品質分數</div>
            <div class="rating-track">
              <div class="rating-fill" style="width: 95%"></div>
            </div>
            <div class="rating-score">95</div>
          </div>

          <div class="rating-bar">
            <div class="rating-name">CP值</div>
            <div class="rating-track">
              <div class="rating-fill" style="width: 40%"></div>
            </div>
            <div class="rating-score">1.21</div>
          </div>
        </div>

        <div class="channel-card-desc">
          <p>
            65元/公斤 /
            通過有機驗證，無化學添加，適合有特殊需求的消費者，配送快速，網路預購享有優惠。
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 可以添加聯絡廠商和查詢運費的邏輯
const contactSupplier = () => {
  console.log("聯絡廠商");
};

const checkShippingFee = () => {
  console.log("查詢運費");
};
</script>

<style scoped>
.multi-channel-section {
  background-color: #fff;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.multi-channel-section h2 {
  margin-top: 0;
  font-size: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.section-desc {
  color: #666;
  margin: 10px 0 20px;
  font-size: 14px;
}

.channel-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.channel-card {
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
}

.channel-card.highlighted {
  border-color: #4caf50;
  box-shadow: 0 0 0 1px #4caf50;
}

.channel-card-header {
  background-color: #f5f5f5;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.best-value-tag {
  background-color: #4caf50;
  color: white;
  padding: 3px 8px;
  border-radius: 20px;
  font-size: 12px;
}

.channel-card-image {
  height: 150px;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-img-placeholder {
  width: 100px;
  height: 100px;
  background-color: #e0e0e0;
  border-radius: 50%;
}

.channel-card-price {
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  padding: 10px;
  color: #f05252;
}

.rating-bars {
  padding: 0 15px;
}

.rating-bar {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.rating-name {
  width: 80px;
  font-size: 14px;
}

.rating-track {
  flex: 1;
  height: 8px;
  background-color: #eee;
  border-radius: 4px;
  margin: 0 10px;
}

.rating-fill {
  height: 100%;
  background-color: #4caf50;
  border-radius: 4px;
}

.rating-score {
  width: 30px;
  text-align: right;
  font-size: 14px;
  font-weight: bold;
}

.channel-card-desc {
  padding: 0 15px 15px;
  font-size: 14px;
  color: #666;
}

.channel-card-desc p {
  margin: 0;
  line-height: 1.4;
}

.card-actions {
  display: flex;
  border-top: 1px solid #eee;
}

.card-btn {
  flex: 1;
  padding: 10px;
  background: none;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
}

.card-btn:hover {
  background-color: #f5f5f5;
}

@media (max-width: 768px) {
  .channel-cards {
    grid-template-columns: 1fr;
  }
}
</style>
