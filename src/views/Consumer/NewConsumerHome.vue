<template>
  <div class="carrot-detail-page">
    <!-- 頂部導航欄 -->
    <header class="top-header">
      <div class="header-left">
        <div class="logo">
          <span class="logo-icon">📊</span>
          <span class="logo-text">蔬果數據可視化平台</span>
        </div>
      </div>
      <div class="header-center">
        <div class="search-container">
          <input type="text" placeholder="輸入關鍵字搜尋，如彩虹蔬菜配方..." />
        </div>
      </div>
      <div class="header-right">
        <button class="menu-btn">菜單</button>
        <button class="login-btn">個人資料</button>
      </div>
    </header>

    <!-- 左側內容區域 -->
    <div class="content-container">
      <div class="sidebar">
        <div class="sidebar-section">
          <h3>AI 智慧推薦</h3>

          <div class="ai-feature">
            <div class="ai-feature-icon">🔍</div>
            <div class="ai-feature-content">
              <h4>最佳蔬果時機</h4>
              <p>
                透過即時歷史行情月走勢，掌握時令好時機溢價，協助達到最佳「淨上收入」。
              </p>
            </div>
          </div>

          <div class="ai-feature">
            <div class="ai-feature-icon">🔄</div>
            <div class="ai-feature-content">
              <h4>同等級代替品</h4>
              <p>
                分析蔬果同等級營養成分相似項目，讓您選擇最佳，代替缺貨的選擇。
              </p>
            </div>
          </div>

          <div class="ai-feature">
            <div class="ai-feature-icon">📋</div>
            <div class="ai-feature-content">
              <h4>最佳蔬果組合</h4>
              <p>
                分析多樣性營養均衡組合計算的12%，用三、五組合補給品，達最健康。
              </p>
            </div>
          </div>

          <div class="toggle-section">
            <div class="toggle-label">只顯示當季</div>
            <div class="toggle-switch on"></div>
          </div>

          <div class="toggle-section">
            <div class="toggle-label">設定價格提醒: 52$/公斤</div>
            <div class="toggle-switch on"></div>
          </div>
        </div>

        <div class="sidebar-section">
          <h3>蔬果分值健康資訊</h3>

          <div class="health-score-section">
            <h4>主要營養成分</h4>
            <div class="score-bar">
              <div class="score-label">維生素A值</div>
              <div class="score-bar-bg">
                <div
                  class="score-bar-fill"
                  style="width: 85%; background-color: #ff9f40"
                ></div>
              </div>
            </div>
            <div class="score-bar">
              <div class="score-label">纖維含量</div>
              <div class="score-bar-bg">
                <div
                  class="score-bar-fill"
                  style="width: 65%; background-color: #a2d24a"
                ></div>
              </div>
            </div>
            <div class="score-bar">
              <div class="score-label">鉀</div>
              <div class="score-bar-bg">
                <div
                  class="score-bar-fill"
                  style="width: 40%; background-color: #fe5757"
                ></div>
              </div>
            </div>
            <div class="score-bar">
              <div class="score-label">抗氧化物質</div>
              <div class="score-bar-bg">
                <div
                  class="score-bar-fill"
                  style="width: 75%; background-color: #52a9ff"
                ></div>
              </div>
            </div>
          </div>

          <div class="health-info-section">
            <h4>健康益處</h4>
            <ul>
              <li>富含β-胡蘿蔔素，有助於保護眼睛</li>
              <li>豐富抗氧化物質能夠幫助抵抗自由基攻擊</li>
              <li>膳食纖維有助於促進腸道健康</li>
              <li>有助於增強免疫系統和心臟健康</li>
            </ul>
          </div>

          <div class="health-info-section">
            <h4>適合人群</h4>
            <p>
              所有想保持健康、增強免疫力、減低血脂症、帶眼睛疲勞的人群，約佔總族群九成的身分皆適用。
            </p>
          </div>
        </div>

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

        <div class="sidebar-section">
          <div class="farmer-section">
            <h3>小農直購專區</h3>

            <div class="farmer-profile">
              <div class="farmer-avatar">👨‍🌾</div>
              <div class="farmer-info">
                <div class="farmer-name">張大明 - 綠野蔬場</div>
                <div class="farmer-location">花蓮縣 / 有機認證</div>
                <div class="farmer-rating">★★★★★ 4.7 (190則評價)</div>
              </div>
            </div>

            <div class="farmer-price">特惠價: $28/公斤</div>
            <div class="farmer-stock">剩餘數量: 25公斤</div>

            <button class="add-to-cart-btn green">直接購買</button>

            <div class="farmer-contact">
              <span>📞 聯絡生產者</span>
              <span>📍 追蹤銷售地</span>
              <span>✓ 自取優惠更便宜，台北專車運送</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 主要內容區域 -->
      <div class="main-content">
        <!-- 產品標題區域 -->
        <div class="product-header">
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

        <!-- 價格趨勢圖 -->
        <div class="price-chart-section">
          <h2>平均價格趨勢</h2>

          <div class="price-gauge">
            <div class="gauge-label low">30天</div>
            <div class="gauge-track">
              <div class="gauge-fill" style="width: 70%"></div>
              <div class="gauge-marker" style="left: 70%"></div>
            </div>
            <div class="gauge-label high">1年</div>
          </div>

          <div class="chart-container">
            <img
              src="https://placeholder.com/price-chart"
              class="chart-placeholder"
              alt="價格趨勢圖"
            />
          </div>

          <div class="chart-legend">
            <div class="legend-item">
              <div class="legend-color" style="background-color: #ff6b6b"></div>
              <div class="legend-text">市場(30%)</div>
            </div>
            <div class="legend-item">
              <div class="legend-color" style="background-color: #4ecdc4"></div>
              <div class="legend-text">產銷(25%)</div>
            </div>
            <div class="legend-item">
              <div class="legend-color" style="background-color: #7d70ba"></div>
              <div class="legend-text">線上(20%)</div>
            </div>
          </div>

          <div class="price-warning">
            <span class="warning-icon">⚠️</span>
            <span class="warning-text">市場價格漲: (-20.3%)</span>
          </div>

          <p class="chart-disclaimer">
            ①
            此產品統二次週期，現產自桃園市場處，根據產季變動價差，10~2月間看好。<br />
            ② 近期紅蘿蔔上漲23%。
          </p>
        </div>

        <!-- 多通路價格比較 -->
        <div class="multi-channel-section">
          <h2>多通路價格比較與CP值排序</h2>
          <p class="section-desc">
            幫您比較市面各大超市、線上超市和產地價的價格排行
          </p>

          <div class="channel-cards">
            <div class="channel-card highlighted">
              <div class="channel-card-header">
                <span class="channel-type">批發市場-本季紅蘿蔔</span>
                <span class="best-value-tag">最佳CP值</span>
              </div>

              <div class="channel-card-image">
                <img
                  src="https://placeholder.com/carrot-image"
                  alt="紅蘿蔔圖片"
                  class="product-img"
                />
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
                <img
                  src="https://placeholder.com/carrot-organic"
                  alt="有機紅蘿蔔圖片"
                  class="product-img"
                />
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

        <!-- 精選食譜推薦 -->
        <div class="recipe-section">
          <div class="section-header">
            <h2>精選食譜推薦</h2>
            <a href="#" class="more-link">看更多</a>
          </div>

          <div class="recipe-cards">
            <div class="recipe-card">
              <div class="recipe-image">
                <img
                  src="https://placeholder.com/carrot-soup"
                  alt="胡蘿蔔湯"
                  class="recipe-img"
                />
              </div>
              <div class="recipe-info">
                <h3>奶油胡蘿蔔湯</h3>
                <div class="recipe-meta">
                  <span>🕒 30分鐘</span>
                  <span>👨‍🍳 4人份</span>
                  <span>⭐ 4.8分</span>
                </div>
                <button class="view-recipe-btn">查看食譜</button>
              </div>
            </div>

            <div class="recipe-card">
              <div class="recipe-image">
                <img
                  src="https://placeholder.com/carrot-cake"
                  alt="胡蘿蔔蛋糕"
                  class="recipe-img"
                />
              </div>
              <div class="recipe-info">
                <h3>健康紅蘿蔔蛋糕</h3>
                <div class="recipe-meta">
                  <span>🕒 90分鐘</span>
                  <span>👨‍🍳 6人份</span>
                  <span>⭐ 4.9分</span>
                </div>
                <button class="view-recipe-btn">查看食譜</button>
              </div>
            </div>

            <div class="recipe-card">
              <div class="recipe-image">
                <img
                  src="https://placeholder.com/carrot-noodle"
                  alt="紅蘿蔔炒麵"
                  class="recipe-img"
                />
              </div>
              <div class="recipe-info">
                <h3>韓式胡蘿蔔炒麵</h3>
                <div class="recipe-meta">
                  <span>🕒 15分鐘</span>
                  <span>👨‍🍳 2人份</span>
                  <span>⭐ 4.7分</span>
                </div>
                <button class="view-recipe-btn">查看食譜</button>
              </div>
            </div>
          </div>
        </div>

        <!-- 保存小秘訣 -->
        <div class="storage-tips-section">
          <h2>保存小秘訣技巧</h2>

          <div class="tips-cards">
            <div class="tip-card">
              <div class="tip-icon">🌱</div>
              <h3>保存方法</h3>
              <p>
                紅蘿蔔最適合冷藏保存，理想的室溫為4-8度，建議切除綠色頂部，避免水分流失，套上塑膠袋放入冰箱可延長一週以上的保存期。
              </p>
            </div>

            <div class="tip-card">
              <div class="tip-icon">🌿</div>
              <h3>清洗技巧</h3>
              <p>
                清洗紅蘿蔔時應先用冷水沖洗去除多餘泥土，可以用刷子輕刷表面，但不要用洗潔劑，避免化學物質滲入蔬菜表皮，影響健康。
              </p>
            </div>

            <div class="tip-card">
              <div class="tip-icon">🥡</div>
              <h3>減少浪費</h3>
              <p>
                紅蘿蔔皮和頂部可製作成高湯，建議收集起來放冷凍，用於調味料，提高使用效率和營養價值。
              </p>
            </div>

            <div class="tip-card">
              <div class="tip-icon">📅</div>
              <h3>最佳食用期限</h3>
              <p>
                新鮮的蘿蔔最好在購買後7-10天內食用完畢，冷凍切片可保存約3個月，保存過久會失去營養價值和新鮮度。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 可以根據需要添加響應式數據和方法
</script>

<style scoped>
.carrot-detail-page {
  font-family: "Noto Sans TC", sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  color: #333;
}

/* 頂部導航欄 */
.top-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  border-bottom: 1px solid #eee;
  background-color: #fff;
}

.logo {
  display: flex;
  align-items: center;
  color: #3c8e3c;
  font-weight: bold;
}

.logo-icon {
  margin-right: 8px;
  font-size: 20px;
}

.search-container input {
  width: 300px;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 20px;
}

.menu-btn,
.login-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  background-color: #f5f5f5;
  margin-left: 10px;
  cursor: pointer;
}

.login-btn {
  background-color: #4caf50;
  color: white;
}

/* 內容區佈局 */
.content-container {
  display: flex;
  padding: 20px;
}

.sidebar {
  width: 300px;
  margin-right: 20px;
}

.main-content {
  flex: 1;
}

/* 側邊欄樣式 */
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

/* AI推薦功能區域 */
.ai-feature {
  display: flex;
  margin-bottom: 15px;
}

.ai-feature-icon {
  font-size: 24px;
  margin-right: 10px;
  color: #4caf50;
}

.ai-feature-content h4 {
  margin: 0 0 5px 0;
  font-size: 16px;
}

.ai-feature-content p {
  margin: 0;
  font-size: 14px;
  color: #666;
}

/* 開關樣式 */
.toggle-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0;
}

.toggle-switch {
  width: 40px;
  height: 20px;
  background-color: #ccc;
  border-radius: 10px;
  position: relative;
}

.toggle-switch.on {
  background-color: #4caf50;
}

.toggle-switch.on:after {
  content: "";
  position: absolute;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: white;
  top: 2px;
  right: 2px;
}

.toggle-switch:after {
  content: "";
  position: absolute;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: white;
  top: 2px;
  left: 2px;
}

/* 健康分數條 */
.score-bar {
  margin-bottom: 10px;
}

.score-label {
  font-size: 14px;
  margin-bottom: 5px;
}

.score-bar-bg {
  height: 10px;
  background-color: #eee;
  border-radius: 5px;
}

.score-bar-fill {
  height: 100%;
  border-radius: 5px;
}

/* 健康益處列表 */
.health-info-section ul {
  margin: 0;
  padding-left: 20px;
}

.health-info-section p {
  margin: 5px 0;
  font-size: 14px;
}

/* 產品比較 */
.product-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.product-icon {
  font-size: 24px;
  margin-right: 10px;
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
}

.add-to-cart-btn.green {
  background-color: #4caf50;
  color: white;
  border: none;
}

/* 小農區塊 */
.farmer-profile {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.farmer-avatar {
  font-size: 40px;
  margin-right: 10px;
}

.farmer-name {
  font-weight: bold;
}

.farmer-location,
.farmer-rating {
  font-size: 12px;
  color: #666;
}

.farmer-price {
  font-size: 18px;
  font-weight: bold;
  color: #4caf50;
  margin: 10px 0;
}

.farmer-stock {
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
}

.farmer-contact {
  display: flex;
  flex-direction: column;
  font-size: 12px;
  margin-top: 10px;
}

.farmer-contact span {
  margin-bottom: 5px;
}

/* 主內容區域 */
/* 產品標題區 */
.product-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.product-title {
  font-size: 24px;
  margin: 0;
  color: #333;
}

.product-category {
  color: #666;
  margin: 5px 0 15px;
}

.price-tags {
  display: flex;
  flex-wrap: wrap;
}

.price-tag,
.stock-tag {
  background-color: #ffa726;
  color: white;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 14px;
  margin-right: 10px;
  margin-bottom: 10px;
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
}

.image-placeholder {
  font-size: 50px;
}

/* 價格趨勢圖 */
.price-chart-section,
.multi-channel-section,
.recipe-section,
.storage-tips-section {
  background-color: #fff;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.price-chart-section h2,
.multi-channel-section h2,
.recipe-section h2,
.storage-tips-section h2 {
  margin-top: 0;
  font-size: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.price-gauge {
  display: flex;
  align-items: center;
  margin: 15px 0;
}

.gauge-track {
  flex: 1;
  height: 8px;
  background-color: #eee;
  border-radius: 4px;
  margin: 0 10px;
  position: relative;
}

.gauge-fill {
  height: 100%;
  background-color: #4caf50;
  border-radius: 4px;
}

.gauge-marker {
  position: absolute;
  top: -5px;
  width: 18px;
  height: 18px;
  background-color: #fff;
  border: 2px solid #4caf50;
  border-radius: 50%;
  transform: translateX(-50%);
}

.chart-container {
  height: 300px;
  background-color: #f9f9f9;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
}

.chart-placeholder {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.chart-legend {
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
}

.legend-item {
  display: flex;
  align-items: center;
  margin: 0 10px;
}

.legend-color {
  width: 16px;
  height: 16px;
  margin-right: 5px;
}

.price-warning {
  background-color: #feecdc;
  padding: 10px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.warning-icon {
  margin-right: 10px;
}

.warning-text {
  color: #f05252;
  font-weight: bold;
}

.chart-disclaimer {
  font-size: 12px;
  color: #666;
  line-height: 1.5;
}

/* 多通路價格比較 */
.section-desc {
  color: #666;
  margin-bottom: 20px;
}

.channel-cards {
  display: flex;
  gap: 20px;
  overflow-x: auto;
  padding-bottom: 10px;
}

.channel-card {
  min-width: 280px;
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
}

.channel-card.highlighted {
  border-color: #4caf50;
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
  background-color: #f9f9f9;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-img {
  max-width: 100%;
  max-height: 100%;
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
}

.channel-card-desc {
  padding: 15px;
  font-size: 14px;
  color: #666;
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
}

.card-btn:hover {
  background-color: #f5f5f5;
}

/* 食譜推薦 */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.more-link {
  color: #4caf50;
  text-decoration: none;
}

.recipe-cards {
  display: flex;
  gap: 20px;
  overflow-x: auto;
  padding-bottom: 10px;
}

.recipe-card {
  min-width: 200px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.recipe-image {
  height: 150px;
  background-color: #f5f5f5;
}

.recipe-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.recipe-info {
  padding: 15px;
}

.recipe-info h3 {
  margin: 0 0 10px 0;
  font-size: 16px;
}

.recipe-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 10px;
  font-size: 12px;
  color: #666;
}

.view-recipe-btn {
  width: 100%;
  padding: 8px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

/* 保存技巧 */
.tips-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.tip-card {
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  border-left: 4px solid #4caf50;
}

.tip-icon {
  font-size: 24px;
  margin-bottom: 10px;
}

.tip-card h3 {
  margin: 0 0 10px 0;
  font-size: 16px;
  color: #333;
}

.tip-card p {
  margin: 0;
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}

/* 響應式設計 */
@media (max-width: 992px) {
  .content-container {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    margin-right: 0;
    margin-bottom: 20px;
  }

  .channel-cards {
    flex-direction: column;
  }

  .channel-card {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .product-header {
    flex-direction: column;
  }

  .search-container input {
    width: 200px;
  }

  .tips-cards {
    grid-template-columns: 1fr;
  }
}
</style>
