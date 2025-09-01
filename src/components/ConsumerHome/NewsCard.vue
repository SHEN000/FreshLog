<template>
  <Card class="news-card">
    <!-- 米黃色面板：大小與原白色卡片完全相同 -->
    <div class="news-panel">
      <h3 class="news-title">食安快訊</h3>

      <ul class="news-list">
        <li v-for="n in vegNews" :key="n.id" class="news-item">
          <button class="pill" type="button">
            <span class="pill-text">
              <template v-if="n.date">{{ n.date }} </template>{{ n.title }}
            </span>
          </button>
        </li>
      </ul>
    </div>
  </Card>
</template>

<script setup>
import Card from './Card.vue'
import { vegNews } from '@/data/consumerDashboardData.js'
</script>

<style scoped>
/* 讓共用 Card 只當「容器」：去背景 / 邊框 / 內距 */
.news-card {
  background: transparent !important;
  border: none !important;
  padding: 0 !important;
  overflow: hidden;
  border-radius: 16px;
}

/* 米黃色面板：撐滿整張卡片，大小=原白色卡片 */
.news-panel {
  --panel-bg: #faf5dc;

  width: 100%;
  height: 100%;
  box-sizing: border-box;
  background: var(--panel-bg);
  border: 1px solid var(--panel-border);
  border-radius: inherit;
  padding: 14px 14px 16px;
}

/* 標題與列表樣式 */
.news-title {
  margin: 6px 0 14px;
  text-align: center;
  font-size: 22px;
  font-weight: 900;
  color: #111;
}

.news-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 16px;
}

.pill {
  width: 100%;
  background: #71c983;
  border: none;
  border-radius: 18px;
  padding: 14px 16px;
  text-align: left;
  cursor: pointer;
  transition: transform .06s ease, box-shadow .12s ease;
}

.pill:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, .06);
}

.pill:active {
  transform: translateY(0);
}

.pill-text {
  display: block;
  color: #0b0b0b;
  font-size: 20px;
  line-height: 1.35;
  font-weight: 600;
  letter-spacing: .5px;
}

/* 手機微調 */
@media (max-width: 768px) {
  .news-panel {
    border-radius: inherit;
    padding: 12px;
  }

  .news-title {
    font-size: 20px;
    margin: 4px 0 12px;
  }

  .news-list {
    gap: 14px;
  }

  .pill {
    padding: 12px 14px;
    border-radius: 16px;
  }

  .pill-text {
    font-size: 18px;
  }
}
</style>
