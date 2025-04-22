<template>
  <div class="ai-recommendation">
    <!-- 頂部標題和搜尋欄 -->
    <div class="page-header">
      <h1>AI 智慧推薦</h1>
      <div class="search-bar">
        <input type="text" placeholder="AI推薦可查詢的料理>>" />
        <button class="search-btn">搜尋</button>
      </div>
    </div>

    <!-- 食物分類標籤列 -->
    <div class="food-category-section">
      <div class="category-left">食物分類</div>
      <div class="category-center">
        <button
          class="category-btn"
          :class="{ active: activeCategory === '早餐' }"
          @click="setCategory('早餐')"
        >
          早餐
        </button>
        <button
          class="category-btn"
          :class="{ active: activeCategory === '主食' }"
          @click="setCategory('主食')"
        >
          主食
        </button>
        <button
          class="category-btn"
          :class="{ active: activeCategory === '湯品' }"
          @click="setCategory('湯品')"
        >
          湯品
        </button>
        <button
          class="category-btn"
          :class="{ active: activeCategory === '剩菜飯' }"
          @click="setCategory('剩菜飯')"
        >
          剩菜飯
        </button>
        <button
          class="category-btn"
          :class="{ active: activeCategory === '異國料理' }"
          @click="setCategory('異國料理')"
        >
          異國料理
        </button>
      </div>
      <div class="category-right">
        更多分類 <span class="down-arrow">▼</span>
      </div>
    </div>

    <!-- 食物網格佈局 -->
    <div class="food-grid">
      <!-- 重複的食物卡片 -->
      <div class="food-item" v-for="i in 14" :key="i">
        <div class="food-left">
          <div class="food-image"></div>
        </div>
        <div class="food-right">
          <h3>炒高麗菜</h3>
          <div class="food-info">
            <div>難易度:3顆星</div>
            <div>時間:15分鐘</div>
          </div>
          <div class="food-action">
            <button class="view-recipe">查看食譜</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 查看更多按鈕 -->
    <div class="view-more">
      <button class="more-btn">查看看更多食譜......</button>
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
.ai-recommendation {
  padding: 20px 0;
}

/* 頁面標題和搜尋區 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

h1 {
  font-size: 24px;
  margin: 0;
}

.search-bar {
  display: flex;
  align-items: center;
}

.search-bar input {
  height: 36px;
  padding: 0 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 10px;
  min-width: 300px;
}

.search-btn {
  background-color: #59c2b9;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
}

/* 分類選項樣式 */
.food-category-section {
  display: flex;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

.category-left {
  font-weight: bold;
  margin-right: 20px;
  padding: 8px 0;
  min-width: 80px;
}

.category-center {
  display: flex;
  gap: 10px;
  flex: 1;
}

.category-btn {
  background: none;
  border: none;
  padding: 8px 16px;
  cursor: pointer;
  border-radius: 4px;
}

.category-btn.active {
  background-color: #59c2b9;
  color: white;
}

.category-right {
  color: #59c2b9;
  display: flex;
  align-items: center;
  padding: 8px 16px;
  cursor: pointer;
}

.down-arrow {
  font-size: 12px;
  margin-left: 5px;
}

/* 食物網格 */
.food-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1px;
  background-color: #ddd;
  margin-bottom: 20px;
}

.food-item {
  display: flex;
  background-color: #f9f9f1; /* 淡綠色背景 */
  padding: 15px;
}

.food-left {
  margin-right: 15px;
}

.food-image {
  width: 120px;
  height: 120px;
  background-color: #e0e0e0;
}

.food-right {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.food-right h3 {
  margin: 0 0 10px 0;
  font-size: 18px;
}

.food-info {
  font-size: 14px;
  color: #666;
  margin-bottom: 15px;
}

.food-action {
  text-align: right;
  margin-top: auto;
}

.view-recipe {
  background: none;
  border: none;
  text-decoration: underline;
  cursor: pointer;
  padding: 5px;
}

/* 查看更多按鈕 */
.view-more {
  text-align: center;
  margin-top: 20px;
}

.more-btn {
  background: none;
  border: none;
  color: #666;
  font-size: 16px;
  cursor: pointer;
  text-decoration: underline;
}

/* 手機版適配 */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .search-bar {
    width: 100%;
    margin-top: 10px;
  }

  .search-bar input {
    flex-grow: 1;
    min-width: unset;
  }

  .food-category-section {
    flex-direction: column;
  }

  .category-center {
    overflow-x: auto;
    margin: 10px 0;
  }

  .category-right {
    align-self: flex-end;
  }

  .food-grid {
    grid-template-columns: 1fr;
  }
}

.food-image-placeholder {
  height: 180px;
  background-color: #e6e6e6;
}

.dish1 {
  background-color: #f3f3e3;
}

.dish2 {
  background-color: #eaeadd;
}

.dish3 {
  background-color: #efefde;
}

.food-info {
  padding: 15px;
}

.dish-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

.cooking-info {
  display: flex;
  justify-content: space-between;
  color: #666;
  font-size: 14px;
}

.action-buttons {
  padding: 0 15px 15px;
  text-align: center;
}

.action-btn {
  width: 100%;
  background-color: #59c2b9;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
}

.view-more {
  text-align: center;
  margin-top: 20px;
}

.more-btn {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  font-size: 16px;
  text-decoration: underline;
}

/* 手機版適應 */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .search-bar {
    width: 100%;
    margin-top: 10px;
  }

  .search-bar input {
    flex-grow: 1;
    min-width: unset;
  }

  .food-cards {
    flex-direction: column;
  }
}
</style>
