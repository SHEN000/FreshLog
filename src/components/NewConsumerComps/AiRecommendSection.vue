<template>
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
        <p>分析蔬果同等級營養成分相似項目，讓您選擇最佳，代替缺貨的選擇。</p>
      </div>
    </div>

    <div class="ai-feature">
      <div class="ai-feature-icon">📋</div>
      <div class="ai-feature-content">
        <h4>最佳蔬果組合</h4>
        <p>分析多樣性營養均衡組合計算的12%，用三、五組合補給品，達最健康。</p>
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
</template>

<script setup>
// 這裡可以添加切換開關的邏輯
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
  cursor: pointer;
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
</style>
