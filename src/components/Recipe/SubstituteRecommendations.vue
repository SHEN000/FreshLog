<template>
  <!-- 只有有資料才顯示整塊 -->
  <div class="subs-card" v-if="hasSubs">
    <div class="header">
      <img src="@/assets/icons/lightbulb.png" alt="當季推薦" class="header-icon" />
      <span class="title">當季替代食譜推薦</span>
    </div>
    <div class="subtitle">
      根據目前蔬果價格，為您推薦更經濟的類似料理
    </div>

    <div class="grid">
      <div v-for="item in visibleSubs" :key="item.name" class="card">
        <div class="card-header">
          <img :src="$img(item.image)" :alt="item.name" class="card-icon" />
          <div class="header-right">
            <h4 class="card-title">{{ item.name }}</h4>
            <span class="badge">省 - </span>
          </div>
        </div>

        <p class="card-desc">{{ item.description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  subs: {
    type: Array,
    default: () => []
  }
})

/** 過濾掉空值/空項目：只保留至少有一個欄位有內容的項目 */
const visibleSubs = computed(() => {
  const arr = Array.isArray(props.subs) ? props.subs : []
  return arr.filter(it => {
    if (!it) return false
    const { name, image, description, save } = it
    // 只要有任一欄位有值就算可顯示（save 允許 0）
    return (
      (name && String(name).trim() !== '') ||
      (image && String(image).trim() !== '') ||
      (description && String(description).trim() !== '') ||
      save !== undefined
    )
  })
})

/** 是否有可顯示的資料 */
const hasSubs = computed(() => visibleSubs.value.length > 0)
</script>

<style scoped>
/* 卡片最外層 */
.subs-card {
  background: linear-gradient(90deg, #fff3e0 0%, #ffe0e0 100%);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

/* 標題區塊 */
.header {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 標題圖示 */
.header-icon {
  width: 20px;
  height: 32px;
}

/* 主標題 */
.title {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
  color: #333;
}

/* 副標題 */
.subtitle {
  margin: 8px 0 16px;
  font-size: 14px;
  color: #666;
}

/* 卡片格：手機一列、桌機兩列 */
.grid {
  display: grid;
  gap: 16px;
  grid-template-columns: 1fr;
}

@media (min-width: 600px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* 單張推薦卡片 */
.card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* 卡片頭：圖示與右側文字並排 */
.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* 替代食譜圖示 */
.card-icon {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 15px;
}

/* 右側容器：垂直堆疊 標題在上、Badge 在下 */
.header-right {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
}

/* 食譜名稱 */
.card-title {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  color: #333;
  line-height: 1.2;
}

/* 省錢 Badge */
.badge {
  background: #22a135;
  color: #fff;
  font-size: 13px;
  padding: 4px 8px;
  border-radius: 9999px;
}

/* 描述文字 */
.card-desc {
  margin: 0;
  font-size: 14px;
  color: #555;
  line-height: 1.5;
}
</style>
