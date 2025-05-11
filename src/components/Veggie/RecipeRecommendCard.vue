<template>
  <div class="recipe-card">
    <div class="header">
      <div class="header-text">
        <h2 class="title">精選食譜推薦</h2>
      </div>
      <!-- 先連結到一般食譜列表頁面 , 之後再改成篩選過的列表頁 -->
      <router-link to="/ai-recommendation" class="view-more">查看更多</router-link>
    </div>

    <div class="cards">
      <div class="card" v-for="recipe in veggieMockData.recipes" :key="recipe.id">

        <!-- 食譜縮圖 -->
        <img :src="recipe.image" alt="食譜圖片" class="thumb" />

        <div class="card-body">
          <h3 class="name">{{ recipe.name }}</h3>

          <!-- 時間／份數／難度 -->
          <div class="meta">
            <span class="meta-item">
              <img :src="icons.clock" alt="時間" class="meta-icon" />{{ recipe.time }}分鐘
            </span>
            <span class="meta-item">
              <img :src="icons.people" alt="人數" class="meta-icon" />
              {{ recipe.servings }}人份
            </span>
            <span class="meta-item">
              <img :src="icons.sparkle" alt="難度" class="meta-icon" />
              {{ recipe.difficulty }}
            </span>
          </div>

          <!-- 之後會連接到該食譜的內頁 -->
          <button class="btn">查看食譜</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { veggieMockData } from '@/data/mockVeggieData.js'

// 引入 icon 圖片
import clockIcon from '@/assets/icons/clock2.png'
import peopleIcon from '@/assets/icons/people.png'
import sparkleIcon from '@/assets/icons/sparkle.png'

const recipes = veggieMockData.recipes || []

// 圖示物件
const icons = {
  clock: clockIcon,
  people: peopleIcon,
  sparkle: sparkleIcon
}
</script>

<style scoped>
.recipe-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-sizing: border-box;
}

/* header */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.header-text .title {
  font-size: 18px;
  color: #2e7d32;
  margin: 0;
}

.view-more {
  font-size: 14px;
  color: #555;
  text-decoration: none;
}

/* cards: 三張並排 */
.cards {
  display: flex;
  gap: 16px;
}

/* 單張卡片樣式 */
.card {
  background: #fff;
  border: 1px solid #eee;
  border-radius: 12px;
  overflow: hidden;  /* 圖片超出遮罩 */
  width: calc((100% - 32px) / 3);  /* 三欄等寬 */
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
}

/* 縮圖 */
.thumb {
  width: 100%;
  height: 140px;
  object-fit: cover;
}

.card-body {
  padding: 12px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.name {
  font-size: 16px;
  margin: 0 0 8px;
  color: #333;
}

/* 時間／份數／難度區 */
.meta {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #777;
  margin-bottom: 12px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px; /* Icon 與文字間距 */
}

.meta-icon {
  width: 14px;
  height: 15px;
}


.btn {
  margin-top: auto;
  background: #2e7d32;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 8px 0;
  cursor: pointer;
}

/* 手機版：只顯示前兩張 */
@media (max-width: 768px) {
  .cards {
    gap: 12px;
  }

  /* 兩欄等寬 */
  .card {
    width: calc((100% - 12px) / 2);
  }

  /* 隱藏第 3 筆以後 */
  .card:nth-child(n+3) {
    display: none;
  }
}
</style>
