<template>
  <div class="veggie-info">
    <div class="tab-header">
      <div class="tab-left">各別蔬果資訊頁</div>
      <div class="tab-right">
        <div class="logo-section">
          <!-- 移除實際圖片，改用文字或圖標 -->
          <!-- <span class="logo-placeholder">🥬</span>
          <span class="site-name">食價登錄</span> -->
        </div>

        <!-- 暫時不用 -->
        <div class="function-buttons">
          <!-- <button class="function-btn">功能1</button>
          <button class="function-btn">功能2</button>
          <button class="function-btn">功能3</button>
          <button class="function-btn">追蹤清單</button>
          <button class="menu-btn">☰</button> -->
        </div>
      </div>
    </div>

    <!-- 搜尋框 -->
    <div class="search-box">
      <div class="search-input-wrapper">
        <!-- 使用HTML符號代替圖片 -->
        <span class="search-icon-placeholder">🔍</span>
        <input type="text" placeholder="搜尋" class="search-input" />
      </div>
    </div>

    <!-- 排序與分類 -->
    <div class="sort-filter-section">
      <div class="sort-dropdown">
        <span>價格排序</span>
        <!-- 使用HTML符號代替圖片 -->
        <span class="dropdown-arrow">▼</span>
      </div>
      <div class="filter-dropdown">
        <span>更多分類</span>
        <span class="dropdown-arrow">▼</span>
      </div>
    </div>

    <!-- 蔬菜卡片網格 -->
    <div class="veggie-grid">
      <!-- 高麗菜 -->
      <div class="veggie-card">
        <div class="veggie-images">
          <!-- 使用背景色代替實際圖片 -->
          <div class="veggie-img-placeholder"></div>
          <div class="veggie-img-placeholder"></div>
        </div>
        <div class="veggie-info-content">
          <h3 class="veggie-name">高麗菜</h3>
          <div class="veggie-price">
            最新價 $50 <span class="price-up">▲18 %</span>
          </div>
          <div class="veggie-status">追蹤狀態：是</div>
          <button class="more-info-btn">查看更多</button>
        </div>
      </div>

      <!-- 蔬果 -->
      <div class="veggie-card">
        <div class="veggie-images">
          <div class="veggie-img-placeholder"></div>
          <div class="veggie-img-placeholder"></div>
        </div>
        <div class="veggie-info-content">
          <h3 class="veggie-name">蔬果</h3>
          <div class="veggie-price">
            最新價 $50 <span class="price-up">▲18 %</span>
          </div>
          <div class="veggie-status">追蹤狀態：是</div>
          <button class="more-info-btn">查看更多</button>
        </div>
      </div>

      <!-- 香蕉 -->
      <div class="veggie-card">
        <div class="veggie-images">
          <div class="veggie-img-placeholder"></div>
          <div class="veggie-img-placeholder"></div>
        </div>
        <div class="veggie-info-content">
          <h3 class="veggie-name">香蕉</h3>
          <div class="veggie-price">
            最新價 $50 <span class="price-up">▲18 %</span>
          </div>
          <div class="veggie-status">追蹤狀態：是</div>
          <button class="more-info-btn">查看更多</button>
        </div>
      </div>

      <!-- 菠菜 - 高亮顯示 -->
      <div class="veggie-card highlighted">
        <div class="veggie-images">
          <div class="veggie-img-placeholder"></div>
          <div class="veggie-img-placeholder"></div>
        </div>
        <div class="veggie-info-content">
          <h3 class="veggie-name">菠菜</h3>
          <div class="veggie-price">
            最新價 $50 <span class="price-up">▲18 %</span>
          </div>
          <div class="veggie-status">追蹤狀態：是</div>
          <button class="more-info-btn">查看更多</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

// 實際應用中，這些數據會從API獲取
const veggies = ref([
  {
    id: 1,
    name: "高麗菜",
    latestPrice: 50,
    priceChange: 18,
    isTracked: true,
  },
  {
    id: 2,
    name: "蔬果",
    latestPrice: 50,
    priceChange: 18,
    isTracked: true,
  },
  {
    id: 3,
    name: "香蕉",
    latestPrice: 50,
    priceChange: 18,
    isTracked: true,
  },
  {
    id: 4,
    name: "菠菜",
    latestPrice: 50,
    priceChange: 18,
    isTracked: true,
    isHighlighted: true,
  },
]);

// 排序和篩選狀態
const currentSort = ref("price-desc");
const currentCategory = ref("all");

// 排序和篩選方法
const sortVeggies = (sortType) => {
  currentSort.value = sortType;
  // 在實際應用中，這裡會根據不同的排序條件進行排序
};

const filterByCategory = (category) => {
  currentCategory.value = category;
  // 在實際應用中，這裡會根據不同的分類進行篩選
};
</script>

<style scoped>
.veggie-info {
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

/* 排序與分類 */
.sort-filter-section {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.sort-dropdown,
.filter-dropdown {
  display: flex;
  align-items: center;
  background-color: #e8f5e9;
  padding: 8px 15px;
  border-radius: 20px;
  cursor: pointer;
}

.dropdown-arrow {
  font-size: 12px;
  margin-left: 10px;
}

/* 蔬菜卡片網格 */
.veggie-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.veggie-card {
  display: flex;
  flex-direction: column;
  background-color: #e8f5e9;
  border-radius: 8px;
  overflow: hidden;
}

.veggie-card.highlighted {
  border: 2px solid #2196f3;
}

.veggie-images {
  display: flex;
}

.veggie-img-placeholder {
  width: 50%;
  height: 120px;
  background-color: #d0d0d0;
}

.veggie-info-content {
  padding: 15px;
}

.veggie-name {
  margin: 0 0 8px 0;
  font-size: 18px;
}

.veggie-price {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}

.price-up {
  color: #4caf50;
  margin-left: 10px;
}

.veggie-status {
  margin-bottom: 10px;
  font-size: 14px;
  color: #666;
}

.more-info-btn {
  background-color: #ffd54f;
  border: none;
  padding: 5px 15px;
  border-radius: 15px;
  float: right;
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

  .veggie-grid {
    grid-template-columns: 1fr;
  }
}
</style>
