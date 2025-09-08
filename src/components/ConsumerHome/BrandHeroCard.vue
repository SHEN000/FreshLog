<template>
  <div class="bento-card hero-card" :style="styleVars">
    <img
      class="hero-img"
      src="@/assets/freshlog-hero.png"
      alt="FRESHLOG"
      draggable="false"
      decoding="async"
      loading="eager"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  /** 背景上緣（桌機）：0~1 或 '32%' */
  offset: { type: [Number, String], default: 0.32 },
  /** 背景上緣（手機） */
  mobileOffset: { type: [Number, String], default: 0.28 },

  /** 米白底與邊線、圓角 */
  panelBg: { type: String, default: '#efefe3' },
  panelBorder: { type: String, default: '#e4e6da' },
  radiusDesktop: { type: [Number, String], default: 18 },
  radiusMobile: { type: [Number, String], default: 16 },
})

const toPx = (v, fallback) =>
  typeof v === 'number'
    ? `${v}px`
    : typeof v === 'string' && /(px|rem|em|%|vh|vw)$/.test(v)
      ? v
      : fallback

const toPercent = (v, fallback) => {
  if (typeof v === 'string') {
    if (v.trim().endsWith('%')) return v.trim()
    const n = Number(v)
    if (!Number.isNaN(n)) return n <= 1 ? `${n * 100}%` : `${n}%`
    return fallback
  }
  if (typeof v === 'number') return v <= 1 ? `${v * 100}%` : `${v}%`
  return fallback
}

const styleVars = computed(() => ({
  '--panel-bg': props.panelBg,
  '--panel-border': props.panelBorder,
  '--bg-offset-desktop': toPercent(props.offset, '32%'),
  '--bg-offset-mobile': toPercent(props.mobileOffset, '28%'),
  '--radius-desktop': toPx(props.radiusDesktop, '18px'),
  '--radius-mobile': toPx(props.radiusMobile, '16px'),
}))
</script>

<style scoped>
/* 容器：透明（保留圓角與裁切 */
.hero-card{
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;

  background: transparent !important;  /* 白底 → 透明 */
  border: none !important;             /* 去邊框 */
  box-shadow: none !important;         /* 去陰影 */
  overflow: hidden;              
}

/* 米白區塊：左右/下邊界貼齊容器 */
.hero-card::before{
  content: "";
  position: absolute;
  z-index: 0; /* 在圖片下層 */
  left: 0;
  right: 0;
  bottom: 0;
  top: var(--bg-offset-desktop);

  background: var(--panel-bg);
  border: 1px solid var(--panel-border);
  border-radius: inherit;       
  pointer-events: none;
}

/* 圖片維持當前大小邏輯：等比、完整顯示、不裁切 */
.hero-img{
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
  display: block;
  image-rendering: -webkit-optimize-contrast;
}

/* 手機：上緣下移、面板不溢出，並在圖片下方留空 */
@media (max-width: 768px){
  .hero-card{
    padding-bottom: clamp(24px, 4vw, 20px);
    overflow: hidden;      
  }
  .hero-card::before{
    /* 手機的面板上緣、左右與下緣 */
    top: var(--bg-offset-mobile, 30%);
    bottom: var(--inset-bottom, 12px); 
    border-radius: var(--radius-mobile, 16px);
  }
}
</style>
