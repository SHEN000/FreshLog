<template>
  <div class="market-card">
    <div class="market-header">
      <img src="@/assets/icons/chart.png" alt="行情图标" class="market-icon" />
      <h3 class="market-title">市場行情</h3>
    </div>

    <div class="trend-box">
      <div class="trend-title-row">
        <span class="trend-title">本週蔬果價格趨勢</span>
        <span class="trend-date">更新：{{ date }}</span>
      </div>

      <div class="trend-list">
        <div v-for="item in trends" :key="item.name" class="trend-row">
          <div class="trend-name">
            <img :src="item.image" :alt="item.name" class="trend-icon" />
            {{ item.name }}
          </div>
          <div class="trend-value">
            <span :class="['price', { 'no-change': item.change === '0%' }]">${{ item.displayPrice }}{{ item.unit
              }}</span>
            <span class="change" :class="{
              up: item.trend === '上升',
              down: item.trend === '下降'
            }">
              <!-- 平穩顯示 '-'，上升/下降顯示箭頭 -->
              {{ item.trend === '上升' ? '↑'
                : item.trend === '下降' ? '↓'
                  : '-' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="trend-tip" v-if="tip">
      <div class="tip-header">
        <img src="@/assets/icons/lightbulb.png" alt="提示圖示" class="tip-icon" />
        <span class="tip-title">省錢小提醒</span>
      </div>
      <!-- 提醒內容 -->
      <p class="tip-text">{{ tip }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  trends: {
    type: Array,
    default: () => []
  },
  /** 更新日期 */
  date: {
    type: String,
    default: () => {
      const d = new Date()
      return `${d.getMonth() + 1}/${d.getDate()}`
    }
  },
  /** 省錢提醒文字 */
  tip: {
    type: String
  }
})
</script>

<style scoped>
/* 外層容器 */
.market-card {
  background: linear-gradient(135deg,
      #f0f4fe 0%,
      #f5e8ff 100%);
  border: 2px solid #3b82f6;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

/* 標題區 */
.market-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

/* 標題圖示 */
.market-icon {
  width: 24px;
  height: 24px;
}

/* 主標題文字 */
.market-title {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
  color: #1976d2;
}

/* 内部白卡 */
.trend-box {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1);
}

/* 標題列 */
.trend-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

/* 標題文字 */
.trend-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

/* 更新日期 */
.trend-date {
  font-size: 14px;
  color: #666;
}

/* 列表 */
.trend-list {
  display: flex;
  flex-direction: column;
}

/* 每一行：左右對齊 + 底部分隔線 */
.trend-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #e5e7eb;
}

/* 去除最後一行的分隔線 */
.trend-row:last-child {
  border-bottom: none;
}

/* 左側名稱：圖示 + 文字 */
.trend-name {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #333;
}

/* 名稱圖示 */
.trend-icon {
  width: 20px;
  height: 20px;
}

/* 右側價格與漲跌 */
.trend-value {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 價格文字 */
.price {
  font-size: 16px;
  font-weight: bold;
  color: #22a135;
}

/* 漲跌百分比文字 */
.change {
  font-size: 14px;
}

/* 漲（紅色） */
.change.up {
  color: #ef4444;
}

/* 跌（綠色） */
.change.down {
  color: #22a135;
}

/* 省錢小提醒區塊 */
.trend-tip {
  background: #fff4e5;
  border-radius: 12px;
  margin-top: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 提醒標題列：圖示 + 文案 */
.tip-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 8px;
}

/* 提醒圖示尺寸 */
.tip-icon {
  width: 18px;
  height: 28px;
}

/* 提醒標題文字 */
.tip-title {
  font-size: 14px;
  font-weight: 500;
  color: #f57c00;
}

/* 提醒內容文字 */
.tip-text {
  margin: 0;
  font-size: 14px;
  color: #666666;
  line-height: 1.4;
}
</style>
