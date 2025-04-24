<template>
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
</template>

<script setup>
// 可以添加動態獲取營養數據的邏輯
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

.health-score-section,
.health-info-section {
  margin-bottom: 15px;
}

.health-score-section h4,
.health-info-section h4 {
  margin: 10px 0;
  font-size: 16px;
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

.health-info-section li {
  margin-bottom: 5px;
  font-size: 14px;
}

.health-info-section p {
  margin: 5px 0;
  font-size: 14px;
  color: #666;
  line-height: 1.4;
}
</style>
