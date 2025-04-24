<template>
  <div class="sidebar-section">
    <h2 class="section-title">AI 智慧推薦</h2>

    <div
      class="ai-feature"
      @mouseenter="hoverFeature('purchase')"
      @mouseleave="leaveFeature"
    >
      <div
        class="ai-feature-icon"
        :class="{ hovered: hoveredFeature === 'purchase' }"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
        </svg>
      </div>
      <div class="ai-feature-content">
        <h4>最佳購買時機</h4>
        <p>
          當前價格處於近3個月高點，建議等待7-10天後再購買，預計價格將下跌15-20%。
        </p>
      </div>
    </div>

    <div
      class="ai-feature"
      @mouseenter="hoverFeature('substitute')"
      @mouseleave="leaveFeature"
    >
      <div
        class="ai-feature-icon"
        :class="{ hovered: hoveredFeature === 'substitute' }"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M3 3h18v18H3z"></path>
          <path d="M3 9h18"></path>
          <path d="M9 21V9"></path>
        </svg>
      </div>
      <div class="ai-feature-content">
        <h4>同等替代選擇</h4>
        <p>
          白蘿蔔、牛蒡等根莖類蔬菜當前價格較低，營養價值相近，可作為替代選擇。
        </p>
      </div>
    </div>

    <div
      class="ai-feature"
      @mouseenter="hoverFeature('location')"
      @mouseleave="leaveFeature"
    >
      <div
        class="ai-feature-icon"
        :class="{ hovered: hoveredFeature === 'location' }"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      </div>
      <div class="ai-feature-content">
        <h4>最佳購買地點</h4>
        <p>附近南門市場的價格比平均低12%，週二、週五為進貨日，品質最佳。</p>
      </div>
    </div>

    <div class="toggle-section">
      <div class="toggle-label">均價超跌通知</div>
      <div
        class="toggle-switch"
        :class="{ on: isPriceAlertEnabled }"
        @click="togglePriceAlert"
      >
        <div class="toggle-switch-handle"></div>
      </div>
    </div>

    <div class="price-setting-section">
      <div class="price-setting-label">
        設定理想價格: ${{ targetPrice }}/公斤
      </div>
      <button class="edit-btn" @click="openPriceEditor">修改</button>

      <!-- 彈出式編輯器 -->
      <div class="price-editor" v-if="showPriceEditor">
        <div class="price-editor-content">
          <div class="price-input-group">
            <span class="price-symbol">$</span>
            <input
              type="number"
              v-model="editablePrice"
              min="1"
              max="100"
              step="1"
              class="price-input"
            />
            <span class="price-unit">/公斤</span>
          </div>
          <div class="price-editor-buttons">
            <button class="cancel-btn" @click="cancelPriceEdit">取消</button>
            <button class="save-btn" @click="savePriceEdit">儲存</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 此區域為預留的額外功能空間 -->
    <div class="more-features" v-if="showMoreFeatures">
      <div class="extra-feature">
        <h4>推薦搭配</h4>
        <p>紅蘿蔔與洋蔥、馬鈴薯搭配可增強營養吸收，同時烹飪出更美味的菜餚。</p>
      </div>

      <div class="extra-feature">
        <h4>季節性報告</h4>
        <p>根據歷史數據，紅蘿蔔在夏季價格通常較高，冬季是最佳購買季節。</p>
      </div>
    </div>

    <button
      class="more-features-btn"
      v-if="!showMoreFeatures"
      @click="toggleMoreFeatures"
    >
      顯示更多推薦功能 ▼
    </button>
    <button class="more-features-btn" v-else @click="toggleMoreFeatures">
      隱藏更多功能 ▲
    </button>
  </div>
</template>

<script setup>
import { ref } from "vue";

// 價格提醒開關狀態
const isPriceAlertEnabled = ref(true);

// 目標價格
const targetPrice = ref(25);
const editablePrice = ref(25);
const showPriceEditor = ref(false);

// 顯示更多功能
const showMoreFeatures = ref(false);

// 當前懸停的功能
const hoveredFeature = ref(null);

// 切換價格提醒
const togglePriceAlert = () => {
  isPriceAlertEnabled.value = !isPriceAlertEnabled.value;
  // 這裡可以添加發送到後端的邏輯，更新用戶的通知設定
};

// 處理價格編輯
const openPriceEditor = () => {
  editablePrice.value = targetPrice.value;
  showPriceEditor.value = true;
};

const savePriceEdit = () => {
  targetPrice.value = editablePrice.value;
  showPriceEditor.value = false;
  // 這裡可以添加發送到後端的邏輯，更新用戶的理想價格設定
};

const cancelPriceEdit = () => {
  showPriceEditor.value = false;
};

// 切換更多功能的顯示
const toggleMoreFeatures = () => {
  showMoreFeatures.value = !showMoreFeatures.value;
};

// 處理特徵懸停
const hoverFeature = (feature) => {
  hoveredFeature.value = feature;
};

const leaveFeature = () => {
  hoveredFeature.value = null;
};
</script>

<style scoped>
.sidebar-section {
  background-color: #f0f7ff;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.section-title {
  color: #2d8646;
  font-size: 20px;
  margin-top: 0;
  margin-bottom: 20px;
  font-weight: bold;
}

.ai-feature {
  display: flex;
  margin-bottom: 25px;
  transition: all 0.3s ease;
  border-radius: 8px;
  padding: 10px;
}

.ai-feature:hover {
  background-color: rgba(240, 247, 255, 0.7);
}

.ai-feature-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  margin-right: 15px;
  color: #3498db;
  border-radius: 8px;
  background-color: rgba(52, 152, 219, 0.1);
  transition: all 0.3s ease;
}

.ai-feature-icon.hovered {
  background-color: #3498db;
  color: white;
  transform: scale(1.1);
}

.ai-feature-content {
  flex: 1;
}

.ai-feature-content h4 {
  margin: 0 0 8px 0;
  font-size: 16px;
  color: #333;
}

.ai-feature-content p {
  margin: 0;
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}

/* 開關按鈕樣式 */
.toggle-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 25px 0;
  padding: 5px 0;
  border-top: 1px solid #eee;
}

.toggle-label {
  font-size: 16px;
  color: #333;
}

.toggle-switch {
  position: relative;
  width: 50px;
  height: 24px;
  border-radius: 12px;
  background-color: #ccc;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.toggle-switch.on {
  background-color: #4caf50;
}

.toggle-switch-handle {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: white;
  transition: transform 0.3s ease;
}

.toggle-switch.on .toggle-switch-handle {
  transform: translateX(26px);
}

/* 價格設定區域 */
.price-setting-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  position: relative;
}

.price-setting-label {
  font-size: 16px;
  color: #333;
}

.edit-btn {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 6px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

.edit-btn:hover {
  background-color: #45a049;
}

/* 價格編輯器 */
.price-editor {
  position: absolute;
  top: 40px;
  right: 0;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  padding: 15px;
  z-index: 10;
  width: 250px;
}

.price-input-group {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.price-symbol {
  font-size: 18px;
  margin-right: 5px;
}

.price-input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  text-align: center;
}

.price-unit {
  margin-left: 5px;
  font-size: 16px;
}

.price-editor-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.cancel-btn,
.save-btn {
  padding: 6px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.cancel-btn {
  background-color: #f5f5f5;
  color: #333;
}

.save-btn {
  background-color: #4caf50;
  color: white;
}

/* 更多功能區域 */
.more-features {
  margin-top: 20px;
  border-top: 1px dashed #ddd;
  padding-top: 15px;
}

.extra-feature {
  margin-bottom: 15px;
}

.extra-feature h4 {
  margin: 0 0 5px 0;
  font-size: 16px;
  color: #333;
}

.extra-feature p {
  margin: 0;
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}

.more-features-btn {
  width: 100%;
  background: none;
  border: 1px solid #ddd;
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 15px;
  color: #666;
  font-size: 14px;
  transition: all 0.3s ease;
}

.more-features-btn:hover {
  background-color: #f5f5f5;
}
</style>
