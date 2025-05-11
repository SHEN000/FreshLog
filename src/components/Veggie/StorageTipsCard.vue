<template>
  <div class="storage-card">
    <div class="header">
      <h2 class="title">保存與烹飪技巧</h2>
    </div>

    <!-- 網格 -->
    <div class="tips-grid">
      <div v-for="(tip, key) in storageTips" :key="key" class="tip-item">
        <!-- 提示項目的標頭：icon + 小標題 -->
        <div class="tip-header">
          <img :src="icons[key]" alt="" class="tip-icon" />
          <span class="tip-title">{{ tip.title }}</span>
        </div>
        <div class="tip-content">
          <span v-for="(line, i) in tip.content.split('\n')" :key="i">
            {{ line }}
            <!-- 除了最後一行之外，每行後都插入 <br> 換行 -->
            <br v-if="i < tip.content.split('\n').length - 1" />
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { veggieMockData } from '@/data/mockVeggieData.js'

// 引入 icon 圖片
import snowflakeIcon from '@/assets/icons/snowflake.png'
import flameIcon from '@/assets/icons/flame.png'
import recycleIcon from '@/assets/icons/recycle.png'
import clockIcon from '@/assets/icons/clock.png'

const { storageTips } = veggieMockData

// 建立 key 到 icon 的對應表
const icons = {
  method: snowflakeIcon,  // 保存方式
  cooking: flameIcon,     // 烹飪技巧
  waste: recycleIcon,     // 減少浪費
  bestBefore: clockIcon,  // 最佳食用期限
}
</script>

<style scoped>
.storage-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
}

/* 標題 */
.header .title {
  font-size: 18px;
  font-weight: bold;
  color: #2e7d32;
  margin: 0 0 16px;
}

/* 桌機：兩欄 grid */
.tips-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

/* 單一提示項目 */
.tip-item {
  background: #e8f5e9;
  border-radius: 8px;
  padding: 16px;
  box-sizing: border-box;
}

/* icon 與標題排版 */
.tip-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.tip-icon {
  width: 20px;
  height: 20px;
  margin-right: 8px;
}

.tip-title {
  font-size: 16px;
  font-weight: 600;
  color: #2e7d32;
}

/* 內容 */
.tip-content {
  font-size: 14px;
  color: #555;
  line-height: 1.6;
}

/* 手機版：一欄 */
@media (max-width: 768px) {
  .tips-grid {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
}
</style>
