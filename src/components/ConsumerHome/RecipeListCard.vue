<template>
  <Card class="recipe-card">
    <!-- 標題 + 分類籤 -->
    <div class="head">
      <h3 class="title">食譜清單列表</h3>

      <div class="tabs">
        <button v-for="c in categories" :key="c" class="tab" :class="{ active: c === activeCat }" type="button"
          @click="setCategory(c)">
          {{ c }}
        </button>
      </div>
    </div>

    <div class="slider" ref="sliderEl" @mousedown="onStart" @mouseup="onEnd" @touchstart.passive="onStart"
      @touchend.passive="onEnd">
      <div class="track" :style="{ transform: `translateX(-${translatePct}%)` }">
        <div v-for="r in pool" :key="r.id" class="slide" :style="{ flex: `0 0 ${100 / itemsPerView}%` }">
          <div class="r-card">
            <div class="thumb-wrap">
              <RouterLink class="thumb-wrap link-reset" :to="r.route || '#'" :title="r.title">
                <img :src="thumbSrc(r)" :alt="r.title" class="thumb" />
              </RouterLink>
            </div>
            <div class="r-name">{{ r.title }}</div>

            <div class="r-sub r-sub-1" v-if="r.time">{{ r.time }}分鐘</div>

            <div class="r-sub r-sub-2">
              <template v-if="r.kcal || r.nutrients">
                <span v-if="r.kcal">{{ r.kcal }}kcal</span>
                <span v-if="r.kcal && r.nutrients">、</span>
                <span v-if="r.nutrients">{{ r.nutrients }}</span>
              </template>
              <template v-else-if="r.protein">
                {{ r.protein }}
              </template>
            </div>
          </div>
        </div>
      </div>

      <!-- 左右箭頭 -->
      <button class="nav nav-left" :disabled="atStart" @click="prev" aria-label="上一張">‹</button>
      <button class="nav nav-right" :disabled="atEnd" @click="next" aria-label="下一張">›</button>
    </div>

    <!-- 分頁小圓點 -->
    <div class="dots">
      <button v-for="(_, i) in totalPages" :key="i" class="dot" :class="{ active: pageIndex === i }" @click="goPage(i)"
        :aria-label="`第 ${i + 1} 頁`" />
    </div>
  </Card>
</template>

<script setup>
import { computed, ref, onMounted, onBeforeUnmount, watch } from 'vue'
import Card from './Card.vue'
import { recipeList } from '@/data/consumerDashboardData.js'

/* 分類 */
const categories = ['熱炒', '甜點', '熱門']
const activeCat = ref(categories[0])
const all = Array.isArray(recipeList) ? recipeList : []
const pool = computed(() => all.filter(r => r.category === activeCat.value))
function setCategory(c) {
  activeCat.value = c
  index.value = 0
}

/* 視口下的每頁張數  */
const sliderEl = ref(null)
const itemsPerView = ref(3)
function recomputeItemsPerView() {
  const w = sliderEl.value?.clientWidth || 0
  itemsPerView.value = w < 560 ? 1 : (w < 980 ? 2 : 3)
  if (index.value > maxIndex.value) index.value = maxIndex.value
}
let ro
onMounted(() => {
  recomputeItemsPerView()
  ro = new ResizeObserver(recomputeItemsPerView)
  ro.observe(sliderEl.value)
})
onBeforeUnmount(() => ro && ro.disconnect())

/* 滑動控制 */
const index = ref(0)
const maxIndex = computed(() => Math.max(0, pool.value.length - itemsPerView.value))
const translatePct = computed(() => (100 / itemsPerView.value) * index.value)
const atStart = computed(() => index.value <= 0)
const atEnd = computed(() => index.value >= maxIndex.value)
function next() { if (!atEnd.value) index.value += 1 }
function prev() { if (!atStart.value) index.value -= 1 }

const totalPages = computed(() => {
  const n = itemsPerView.value || 1
  return Math.max(1, Math.ceil(pool.value.length / n))
})
const pageIndex = computed(() => {
  const n = itemsPerView.value || 1
  return Math.min(totalPages.value - 1, Math.floor((index.value + (n - 1)) / n))
})
function goPage(p) { index.value = Math.min(maxIndex.value, p * itemsPerView.value) }
watch(activeCat, () => { index.value = 0 })

/* 圖片來源 */
const thumbSrc = (r) => r?.image || defaultThumb

// 簡單的圓形底圖（不用新增檔案）
const defaultThumb =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="156" height="156" viewBox="0 0 156 156">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#e8f5e9"/>
        <stop offset="100%" stop-color="#c8e6c9"/>
      </linearGradient>
    </defs>
    <circle cx="78" cy="78" r="78" fill="url(#g)"/>
    <text x="50%" y="55%" text-anchor="middle" font-family="sans-serif" font-size="18" fill="#2e7d32">FreshLog</text>
  </svg>`);
</script>

<style scoped>
/* 版頭 */
.recipe-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 35px 20px;
}

.head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 22px;
  font-weight: 900;
  color: #0f172a;
  margin: 0;
}

/* 分類籤 */
.tabs {
  display: flex;
  align-items: center;
  gap: 5px;
}

.tab {
  background: transparent;
  border: 1.5px solid #d1d5db;
  border-radius: 999px;
  padding: 8px 12px;
  font-weight: 800;
  color: #0b0b0b;
  cursor: pointer;
  transition: background-color .15s ease, border-color .15s ease, color .15s ease;
}

.tab:hover {
  border-color: #2e7d32;
}

.tab.active {
  background: #e6f4ec;
  border-color: #2e7d32;
  color: #0b0b0b;
}

.slider {
  position: relative;
  overflow: hidden;
  --top-gap: 24px;
}

.track {
  display: flex;
  transition: transform .35s ease;
  padding-top: var(--top-gap);
}

.slide {
  padding: 0 8px;
  box-sizing: border-box;
}

/* 卡片 */
.r-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.thumb-wrap {
  width: 170px;
  height: 170px;
  border-radius: 999px;
  background: #fff;
  display: grid;
  place-items: center;
  box-shadow: 0 8px 16px rgba(0, 0, 0, .08);
}

.thumb {
  width: 156px;
  height: 156px;
  border-radius: 999px;
  object-fit: cover;
  display: block;
}

.r-name {
  font-size: 22px;
  font-weight: 900;
  color: #0f172a;
  margin-top: 10px;
}

.r-sub {
  color: #111;
  font-size: 18px;
  line-height: 1.35;
}

.r-sub-1 {
  margin-top: 8px;
}

.r-sub-2 {
  margin-top: 2px;
}

/* 箭頭 */
.nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 36px;
  height: 36px;
  border-radius: 999px;
  border: none;
  display: grid;
  place-items: center;
  font-size: 22px;
  line-height: 1;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .15);
  cursor: pointer;
  opacity: .95;
}

.nav:disabled {
  opacity: .4;
  cursor: default;
}

.nav-left {
  left: 4px;
}

.nav-right {
  right: 4px;
}

/* 分頁點 */
.dots {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 8px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #d1d5db;
  border: none;
  cursor: pointer;
}

.dot.active {
  background: #1a7f3c;
  transform: scale(1.1);
}

/* 手機 */
@media (max-width:768px) {
  .thumb-wrap {
    width: 180px;
    height: 180px;
  }

  .thumb {
    width: 166px;
    height: 166px;
  }

  .r-name {
    font-size: 24px;
  }

  .r-sub {
    font-size: 18px;
  }
}
</style>
