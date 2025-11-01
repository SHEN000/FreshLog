<template>
  <div class="price-card-outer" role="region" aria-label="主要食材當前價格">
    <div class="price-card-inner">
      <h3 class="title">主要食材當前價格</h3>

      <div class="main-row">
        <div class="money-icon">
          <img src="@/assets/icons/money-bag.png" alt="icon" />
        </div>

        <!-- Slider 視窗 -->
        <div class="slider-viewport" tabindex="0" @keydown.left.prevent="prev" @keydown.right.prevent="next"
          @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onTouchEnd" @mousedown="onMouseDown"
          @mousemove="onMouseMove" @mouseup="onMouseUp" @mouseleave="onMouseLeave">
          <!-- 軌道 -->
          <div class="slider-track" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
            <!-- 每一張 slide -->
            <div v-for="(item, i) in items" :key="item.name + '-' + i" class="slide">
              <div class="main-price-row">
                <span class="item-name">{{ item.name }}</span>
                <span class="item-price">${{ item.displayPrice }}</span>
                <span class="item-unit">/{{ item.unit }}</span>

                <template v-if="trendInfo(item.trend).show">
                  <span class="item-change" :class="{
                    up: trendInfo(item.trend).isUp,
                    down: trendInfo(item.trend).isDown
                  }">
                    {{ trendInfo(item.trend).isUp ? '↑' : '↓' }}
                    比上週{{ trendInfo(item.trend).isUp ? '貴' : '便宜' }}
                    {{ trendInfo(item.trend).value }}%
                  </span>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 導航圓點 -->
      <div v-if="items.length > 1" class="dots">
        <button v-for="(it, i) in items" :key="i" class="dot" :class="{ active: i === currentIndex }" @click="goTo(i)"
          :aria-label="`顯示第 ${i + 1} 項`" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  items: { type: Array, default: () => [] },
  cost: { type: [Number, String], default: '' }
})

const currentIndex = ref(0)

// — 導航
function goTo(i) {
  if (!props.items.length) return
  currentIndex.value = Math.min(Math.max(i, 0), props.items.length - 1)
}
function prev() { goTo(currentIndex.value - 1) }
function next() { goTo(currentIndex.value + 1) }

// — 觸控/滑鼠拖曳
const startX = ref(0)
const deltaX = ref(0)
const dragging = ref(false)
const THRESHOLD = 40 // 觸發滑動的像素閾值

function onTouchStart(e) {
  startX.value = e.touches[0].clientX
  deltaX.value = 0
}
function onTouchMove(e) {
  deltaX.value = e.touches[0].clientX - startX.value
}
function onTouchEnd() {
  if (Math.abs(deltaX.value) > THRESHOLD) {
    deltaX.value < 0 ? next() : prev()
  }
  deltaX.value = 0
}

function onMouseDown(e) {
  dragging.value = true
  startX.value = e.clientX
  deltaX.value = 0
}
function onMouseMove(e) {
  if (!dragging.value) return
  deltaX.value = e.clientX - startX.value
}
function onMouseUp() {
  if (!dragging.value) return
  dragging.value = false
  if (Math.abs(deltaX.value) > THRESHOLD) {
    deltaX.value < 0 ? next() : prev()
  }
  deltaX.value = 0
}
function onMouseLeave() {
  if (!dragging.value) return
  dragging.value = false
  deltaX.value = 0
}

/** 將趨勢資訊轉換為顯示格式（保留你的邏輯） */
function trendInfo(t) {
  let n = 0
  if (typeof t === 'number') n = t
  else if (typeof t === 'string') {
    const m = t.match(/-?\d+(\.\d+)?/)
    if (m) n = Number(m[0])
    else if (t.includes('上升') || t.trim().startsWith('+')) n = 1
    else if (t.includes('下降') || t.trim().startsWith('-')) n = -1
  }
  const abs = Math.abs(n)
  const looksLikeFraction =
    (typeof t === 'number' && abs > 0 && abs < 1) ||
    (typeof t === 'string' && !t.includes('%') && /^-?0?\.\d+/.test(t))
  const pct = looksLikeFraction ? abs * 100 : abs
  const value = Number(pct.toFixed(2))
    .toString()
    .replace(/\.00$/, '')
    .replace(/(\.\d*[1-9])0+$/, '$1')

  return { show: n !== 0, isUp: n > 0, isDown: n < 0, value }
}
</script>

<style scoped>
/* 外層 */
.price-card-outer {
  border: 2px solid #22a135;
  border-radius: 16px;
  background: #f8fefa;
  padding: 20px;
  box-shadow: 0 2px 8px #eaf7ea;
  display: flex;
  justify-content: center;
}

/* 內層 */
.price-card-inner {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px #CCC;
  padding: 20px;
  min-width: 280px;
  max-width: 340px;
  width: 100%;
}

/* 標題樣式 */
.title {
  color: #2e7d32;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  margin: 0 0 16px 0;
  letter-spacing: 1px;
}

/* 主要內容行：圖示 + 資訊 */
.main-row {
  display: flex;
  align-items: center;
  gap: 16px;
}

/* 圖示圓圈 */
.money-icon {
  width: 48px;
  height: 48px;
  background: #22a135;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 2px 8px #eaf7ea;
}

/* 圖示內部 Icon */
.money-icon img {
  width: 28px;
  height: 28px;
}

/* 資訊區塊*/
.info-block {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* 單列價格資料 */
.main-price-row {
  font-size: 16px;
  margin-bottom: 4px;
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
}

/* 食材名稱 */
.item-name {
  color: #666;
  font-weight: 500;
  margin-right: 4px;
}

/* 價格文字 */
.item-price {
  color: #22a135;
  font-size: 20px;
  font-weight: bold;
  margin-right: 2px;
}

/* 單位 */
.item-unit {
  color: #22a135;
  font-size: 15px;
  font-weight: 500;
  margin-right: 8px;
}

/* 漲跌文字預設顏色 */
.item-change {
  color: #8dd48c;
  font-size: 14px;
  margin-left: 2px;
}

/* 漲 (紅色) */
.item-change.up {
  color: #f44336;
}

/* 跌 (綠色) */
.item-change.down {
  color: #22a135;
}

/* 小計文字 */
.cost-summary {
  margin-top: 6px;
  font-size: 15px;
  color: #888;
}

/* 小計成本數值 */
.cost-value {
  color: #22a135;
  font-size: 18px;
  font-weight: bold;
  margin-left: 2px;
}

/* Slider 視窗 */
.slider-viewport {
  flex: 1;
  overflow: hidden;
  outline: none;
  border-radius: 8px;
}

.slider-track {
  display: flex;
  width: 100%;
  transition: transform .3s ease;
}

.slide {
  width: 100%;
  flex: 0 0 100%;
}

/* 導航圓點 */
.dots {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-top: 10px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 9999px;
  border: 0;
  background: #d6ecd7;
  cursor: pointer;
}

.dot.active {
  background: #2e7d32;
}

.price-card-inner {
  position: relative;
}

.nav.prev {
  left: 10px;
}

.nav.next {
  right: 10px;
}
</style>
