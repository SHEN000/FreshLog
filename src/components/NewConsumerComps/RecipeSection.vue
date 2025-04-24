<template>
  <div class="recipe-section">
    <div class="section-header">
      <h2>精選食譜推薦</h2>
      <a href="#" class="more-link">看更多</a>
    </div>

    <div class="recipe-cards">
      <div class="recipe-card">
        <div class="recipe-image">
          <div class="recipe-img-placeholder"></div>
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
          <div class="recipe-img-placeholder"></div>
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
          <div class="recipe-img-placeholder"></div>
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
</template>

<script setup>
// 可以添加查看食譜詳情的邏輯
const viewRecipe = (recipeId) => {
  console.log(`查看食譜: ${recipeId}`);
};
</script>

<style scoped>
.recipe-section {
  background-color: #fff;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h2 {
  margin: 0;
  font-size: 20px;
}

.more-link {
  color: #4caf50;
  text-decoration: none;
  font-size: 14px;
}

.more-link:hover {
  text-decoration: underline;
}

.recipe-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
}

.recipe-card {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.recipe-image {
  height: 150px;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.recipe-img-placeholder {
  width: 100px;
  height: 100px;
  background-color: #e0e0e0;
  border-radius: 8px;
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
  margin-bottom: 15px;
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
  transition: background-color 0.3s;
}

.view-recipe-btn:hover {
  background-color: #388e3c;
}

@media (max-width: 768px) {
  .recipe-cards {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
}
</style>
