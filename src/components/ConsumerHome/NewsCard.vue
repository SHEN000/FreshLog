<template>
  <Card class="news-card">
    <div
      class="news-panel"
      @mouseenter="pause()"
      @mouseleave="resume()"
      @focusin="pause()"
      @focusout="resume()"
    >
      <h3 class="news-title">食安快訊</h3>

      <!-- 一次只顯示一則 -->
      <transition name="fade" mode="out-in">
        <div
          v-if="current"
          :key="current.id"
          class="news-slide"
          role="group"
          :aria-label="`第 ${index+1} 則，共 ${total} 則`"
        >
          <button class="pill" type="button">
            <span class="pill-text">
              <template v-if="current.date">{{ current.date }}</template>
            </span>
            <span class="pill-text">{{ current.title }}</span>
            <span v-if="current.summary" class="pill-summary">
              {{ current.summary }}
            </span>
          </button>
        </div>
      </transition>

      <!-- 導覽圓點（可點擊切換） -->
      <div class="dots" role="tablist" aria-label="新聞導覽">
        <button
          v-for="(n,i) in vegNews"
          :key="n.id"
          class="dot"
          :class="{ active: i === index }"
          :aria-selected="i===index"
          role="tab"
          @click="go(i)"
        />
      </div>

      <!-- 5 秒進度條（視覺回饋） -->
      <div class="progress">
        <div class="bar" :style="{ width: progressPct + '%' }"></div>
      </div>
    </div>
  </Card>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import Card from './Card.vue'
import { vegNews } from '@/data/consumerDashboardData.js'

/** 設定：輪播間隔（毫秒） */
const INTERVAL = 5000

const index = ref(0)
const total = vegNews.length
const timer = ref(null)
const lastTick = ref(performance.now())
const accElapsed = ref(0)  //已累積的時間（毫秒）
const progressPct = ref(0)
const paused = ref(false)

const current = computed(() => vegNews[index.value])

function tick() {
  if (paused.value) return
  const now = performance.now()
  const totalElapsed = accElapsed.value + (now - lastTick.value)
  progressPct.value = Math.min(100, (totalElapsed / INTERVAL) * 100)

  if (totalElapsed >= INTERVAL) {
    next()
  }
}

function start() {
  stop()
  accElapsed.value = 0   // 重置累積時間
  lastTick.value = performance.now()
  progressPct.value = 0
  timer.value = setInterval(tick, 80) // 平滑更新進度條
}

function stop() {
  if (timer.value) {
    clearInterval(timer.value)
    timer.value = null
  }
}

function pause () {
  if (paused.value) return
  accElapsed.value += performance.now() - lastTick.value
  paused.value = true
}

function resume () {
  if (!paused.value) return
  paused.value = false
  lastTick.value = performance.now() // 只更新起點，不歸零 progress
}


function next () {
  index.value = (index.value + 1) % total
  accElapsed.value = 0  
  lastTick.value = performance.now()
  progressPct.value = 0
}

function prev() {
  index.value = (index.value - 1 + total) % total
  accElapsed.value = 0  
  lastTick.value = performance.now()
  progressPct.value = 0
}

function go(i) {
  index.value = i
  accElapsed.value = 0  
  lastTick.value = performance.now()
  progressPct.value = 0
}

onMounted(() => {
  start()
  // 鍵盤左右切換（可選）
  window.addEventListener('keydown', onKey)
})

onBeforeUnmount(() => {
  stop()
  window.removeEventListener('keydown', onKey)
})

function onKey(e) {
  if (e.key === 'ArrowRight') { e.preventDefault(); next(); pause() }
  if (e.key === 'ArrowLeft')  { e.preventDefault(); prev(); pause() }
}
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
  --panel-border: #e5dec3;

  width: 100%;
  height: 100%;
  box-sizing: border-box;
  background: var(--panel-bg);
  border: 1px solid var(--panel-border);
  border-radius: inherit;
  padding: 14px 14px 16px;
  position: relative;
}

/* 標題與列表樣式 */
.news-title {
  margin: 6px 0 14px;
  text-align: center;
  font-size: 22px;
  font-weight: 900;
  color: #111;
}



/* 單則容器，確保文字多時不抖動 */
.news-slide {
  min-height: 116px; /* 視需要微調，避免輪播時高度跳動 */
  display: grid;
}

/* Pill 本體 */
.pill {
  width: 100%;
  background: #71c983;
  border: none;
  border-radius: 18px;
  padding: 14px 16px;
  text-align: left;
  cursor: default;
  transition: box-shadow .12s ease;
}
.pill:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, .06);
}
.pill-text {
  display: block;
  color: #0b0b0b;
  font-size: 20px;
  line-height: 1.35;
  font-weight: 700;
  letter-spacing: .3px;
  margin-bottom: 6px;
  overflow-wrap: anywhere;
}
.pill-summary {
  display: block;
  color: #0b0b0b;
  font-size: 15px;
  line-height: 1.5;
  opacity: .95;
  /* 多行截斷（避免內容過長撐爆卡片） */
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 導覽圓點 */
.dots {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-top: 12px;
}
.dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  border: 0;
  background: #d1fadf;
  cursor: pointer;
  transition: transform .12s ease, background .12s ease;
}
.dot.active {
  background: #16a34a;
  transform: scale(1.15);
}
.dot:focus-visible {
  outline: 2px solid #14532d;
  outline-offset: 2px;
}

/* 左右切換（可選） */
/* .nav {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  pointer-events: none;
}
.nav-btn {
  pointer-events: auto;
  background: rgba(255,255,255,.55);
  border: 1px solid rgba(0,0,0,.08);
  width: 28px;
  height: 28px;
  border-radius: 999px;
  margin: 0 6px;
  font-size: 18px;
  line-height: 1;
  display: grid;
  place-items: center;
  cursor: pointer;
} */

/* 進度條（5 秒） */
.progress {
  height: 3px;
  background: rgba(0,0,0,.06);
  border-radius: 999px;
  margin-top: 12px;
  overflow: hidden;
}
.bar {
  height: 100%;
  width: 0%;
  background: #22c55e;
  transition: width .08s linear;
}

/* 淡入轉場 */
.fade-enter-active, .fade-leave-active { transition: opacity .26s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

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
