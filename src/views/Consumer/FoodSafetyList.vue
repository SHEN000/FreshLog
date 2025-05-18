<template>
  <div class="food-safety-list">
    <div class="tab-header">
      <div class="tab-left">食安資訊列表</div>
      <div class="tab-right">
        <div class="logo-section">
          <!-- <span class="logo-placeholder">🥬</span> -->
          <!-- <span class="site-name">食價登錄</span> -->
        </div>
        <!-- 暫時不用 -->
        <div class="function-buttons">
          <!-- <button class="function-btn">功能1</button>
          <button class="function-btn">功能2</button>
          <button class="function-btn">功能3</button>
          <button class="function-btn">追蹤清單</button> -->
          <!-- <button class="menu-btn">☰</button> -->
        </div>
      </div>
    </div>

    <!-- 搜尋框 -->
    <div class="search-box">
      <div class="search-input-wrapper">
        <span class="search-icon-placeholder">🔍</span>
        <input type="text" placeholder="搜尋" class="search-input" />
      </div>
    </div>

    <!-- 篩選選項 -->
    <div class="filter-options">
      <button class="filter-btn">時間排序</button>
      <button class="filter-btn">農藥超標</button>
      <button class="filter-btn">產地造假</button>
      <button class="filter-btn">違法添加物</button>
      <button class="filter-btn more-btn">更多...</button>
    </div>

    <!-- 食安問題卡片網格 -->
    <div class="safety-grid">
      <!-- 第一列第一欄 -->
      <div class="safety-card">
        <h3 class="veggie-name">高麗菜</h3>
        <div class="issue-type">問題:農藥超標</div>
        <div class="detection-info">檢出單位: 台北市場處</div>
        <div class="date-info">日期:2025/04/01</div>
        <button class="detail-btn">查看詳情</button>
      </div>

      <!-- 第一列第二欄 -->
      <div class="safety-card">
        <h3 class="veggie-name">高麗菜</h3>
        <div class="issue-type">問題:農藥超標</div>
        <div class="detection-info">檢出單位: 台北市場處</div>
        <div class="date-info">日期:2025/04/01</div>
        <button class="detail-btn">查看詳情</button>
      </div>

      <!-- 第二列第一欄 -->
      <div class="safety-card">
        <h3 class="veggie-name">高麗菜</h3>
        <div class="issue-type">問題:農藥超標</div>
        <div class="detection-info">檢出單位: 台北市場處</div>
        <div class="date-info">日期:2025/04/01</div>
        <button class="detail-btn">查看詳情</button>
      </div>

      <!-- 第二列第二欄 -->
      <div class="safety-card">
        <h3 class="veggie-name">高麗菜</h3>
        <div class="issue-type">問題:農藥超標</div>
        <div class="detection-info">檢出單位: 台北市場處</div>
        <div class="date-info">日期:2025/04/01</div>
        <button class="detail-btn">查看詳情</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

// 食安問題資料
const safetyIssues = ref([
  {
    id: 1,
    name: "高麗菜",
    issue: "農藥超標",
    detectionUnit: "台北市場處",
    date: "2025/04/01",
  },
  {
    id: 2,
    name: "高麗菜",
    issue: "農藥超標",
    detectionUnit: "台北市場處",
    date: "2025/04/01",
  },
  {
    id: 3,
    name: "高麗菜",
    issue: "農藥超標",
    detectionUnit: "台北市場處",
    date: "2025/04/01",
  },
  {
    id: 4,
    name: "高麗菜",
    issue: "農藥超標",
    detectionUnit: "台北市場處",
    date: "2025/04/01",
  },
]);

// 篩選方法
const filterByIssueType = (type) => {
  // 在實際應用中，這裡會根據不同的問題類型進行篩選
  console.log(`篩選問題類型: ${type}`);
};
</script>

<style scoped>
.food-safety-list {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 10px;
  font-family: Arial, sans-serif;
}

/* 頂部選項卡樣式 */
.tab-header {
  display: flex;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
  margin-bottom: 15px;
}

.tab-left {
  font-size: 18px;
  font-weight: bold;
  padding: 10px 0;
  color: #333;
  flex: 1;
}

.tab-right {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 3;
}

.logo-section {
  display: flex;
  align-items: center;
}

.logo-placeholder {
  font-size: 24px;
  margin-right: 10px;
}

.site-name {
  font-size: 18px;
  font-weight: bold;
}

.function-buttons {
  display: flex;
  gap: 10px;
}

.function-btn {
  background-color: #e0e0e0;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
}

.menu-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
}

/* 搜尋框 */
.search-box {
  margin-bottom: 15px;
}

.search-input-wrapper {
  display: flex;
  align-items: center;
  background-color: #e8f5e9;
  border-radius: 20px;
  padding: 5px 15px;
  max-width: 300px;
}

.search-icon-placeholder {
  margin-right: 10px;
}

.search-input {
  border: none;
  background: transparent;
  flex-grow: 1;
  padding: 8px 0;
  outline: none;
}

/* 篩選選項 */
.filter-options {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.filter-btn {
  background-color: #e0e0e0;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
}

.more-btn {
  color: #2196f3;
}

/* 食安問題卡片網格 */
.safety-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.safety-card {
  background-color: #e8f5e9;
  border-radius: 8px;
  padding: 15px;
  position: relative;
}

.veggie-name {
  margin: 0 0 10px 0;
  font-size: 18px;
}

.issue-type {
  margin-bottom: 8px;
}

.detection-info {
  margin-bottom: 8px;
}

.date-info {
  margin-bottom: 8px;
  color: #666;
}

.detail-btn {
  background-color: #ffd54f;
  border: none;
  padding: 5px 15px;
  border-radius: 15px;
  position: absolute;
  bottom: 15px;
  right: 15px;
  cursor: pointer;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .tab-header {
    flex-direction: column;
  }

  .tab-right {
    flex-direction: column;
    align-items: flex-start;
  }

  .function-buttons {
    margin-top: 10px;
    width: 100%;
    overflow-x: auto;
  }

  .safety-grid {
    grid-template-columns: 1fr;
  }
}
</style>
