<template>
  <div class="header-container">
    <!-- 動態漸層背景 -->
    <div class="header-bg" :style="{ background: gradientStyle }"></div>

    <div class="header-gradient">
      <h1 class="header-title">{{ title }}</h1>
      <p class="header-desc">{{ desc }}</p>
      <div class="header-info">
        <span class="info-item">
          <img src="@/assets/icons/recipetime.png" alt="時間" class="icon" />
          {{ cookTimeMinutes }}分鐘
        </span>
        <span class="info-item">
          <img src="@/assets/icons/quantity.png" alt="份量" class="icon" />
          {{ servings }}人份
        </span>
        <span class="info-item">
          <img src="@/assets/icons/difficulty.png" alt="難度" class="icon" />
          {{ difficulty }}
        </span>
      </div>
    </div>
    <img :src="image" alt="食譜圖片" class="header-image" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'

const props = defineProps({
  title: String,
  desc: String,
  image: String,
  cookTimeMinutes: { type: [Number, String], default: null },
  servings: { type: [Number, String], default: null },
  difficulty: String,
  gradientColors: { type: Array, default: () => [] }
})

// 產生背景用的 CSS
const gradientStyle = computed(() => {
  const colors = props.gradientColors || []
  if (colors.length < 2) return ''
  // e.g. ["#f00","#0f0"] => "linear-gradient(to right, #f00, #0f0)"
  return `linear-gradient(to right, ${props.gradientColors.join(', ')})`
})

// 處理漸層 CSS 字串（for desktop & mobile）
function generateGradientCSS() {
  const [c1, c2, c3] = props.gradientColors
  const transparent = 'rgba(255, 102, 0, 0)'

  const desktopGradient = `linear-gradient(90deg, ${c1} 0%, ${c2} 20%, ${c3} 60%, ${transparent} 100%)`
  const mobileGradient = `linear-gradient(to bottom, ${c1} 0%, ${c2} 30%, ${c3} 65%, ${transparent} 100%)`

  // 寫入 CSS 變數供 ::before 使用
  document.documentElement.style.setProperty('--recipe-header-gradient-pc', desktopGradient)
  document.documentElement.style.setProperty('--recipe-header-gradient-mobile', mobileGradient)
}

onMounted(() => {
  generateGradientCSS()
})

onUnmounted(() => {
  // 可選：離開頁面時清掉變數
  document.documentElement.style.removeProperty('--recipe-header-gradient-pc')
  document.documentElement.style.removeProperty('--recipe-header-gradient-mobile')
})
</script>

<style scoped>
/* 最外層容器 */
.header-container {
  position: relative;
  display: flex;
  align-items: stretch;
  border-radius: 24px;
  overflow: hidden;
  width: 100%;
  min-height: 150px;
  background: #ccc;
}

/* 動態背景漸層層 */
.header-bg {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}

/* 漸層背景：使用 CSS 變數動態注入 */
.header-container::before {
  content: "";
  position: absolute;
  inset: 0;
  background: var(--recipe-header-gradient-pc); /* default PC 漸層 */
  z-index: 1;
}

/* 文字 */
.header-gradient {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 32px 40px;
  background: transparent;
  color: #fff;
  position: relative;
  z-index: 2;   /* 確保文字在元素之上 */
}

/* 標題字體 */
.header-title {
  font-size: 2.4rem;
  font-weight: bold;
  margin-bottom: 12px;
  letter-spacing: 2px;
  font-size: 32px;
}

/* 描述文字 */
.header-desc {
  font-size: 1.1rem;
  margin-bottom: 28px;
  opacity: 0.93;
  font-size: 16px;
}

/* 資訊列：時間、份量、難度 */
.header-info {
  display: flex;
  gap: 28px;
  font-size: 1rem;
  align-items: center;
  margin-top: 8px;
  font-size: 16px;
}

/* 每個資訊項目 */
.header-info span {
  display: flex;
  align-items: center;
  gap: 6px;
}

/* 右側圖片 */
.header-image {
  flex: 1;
  object-fit: cover;
  width: 100%;
  min-width: 250px;
  max-width: 400px;
  position: relative;
  z-index: 0;  /* 圖片最底層 */
  border-top-right-radius: 24px;
  border-bottom-right-radius: 24px;
}

/* 手機版樣式調整 */
@media (max-width: 768px) {
  .header-container {
    flex-direction: column;
    border-radius: 16px;
  }
  .header-gradient {
    padding: 24px 16px;
    border-radius: 0;
  }
  .header-image {
    border-radius: 0 0 16px 16px;
    min-width: 120px;
    max-width: 100%;
    height: 180px;
  }

    /* 漸層改為上下方向 */
  .header-container::before {
    background: var(--recipe-header-gradient-mobile); /* mobile 漸層 */
  }
}
</style>
