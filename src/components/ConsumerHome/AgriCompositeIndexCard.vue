<template>
    <Card class="agri-card">
        <!-- 標題列 -->
        <div class="card-head">
            <h3 class="title">農業綜合指數儀表板</h3>
        </div>

        <!-- 藍色說明區 -->
        <div class="summary-slab">
            <div class="score-wrap">
                <img class="donut" src="@/assets/agri-donut.png" alt="綜合指數圓環" />
                <div class="center">
                    <div class="num">81</div>
                    <div class="label">綜合指數</div>
                </div>
            </div>

            <!-- 文字說明 -->
            <div class="summary-text">
                <div class="chip"><span class="dot"></span>農業景氣良好</div>
                <p>
                    本週農業綜合指數為 <b>81</b> 分，處於「良好」區間。價格穩定、品質優良、供應充足，適合採購。
                </p>
            </div>
        </div>

        <!-- 迷你指標卡（3×2） -->
        <div class="mini-grid">
            <div v-for="m in metrics" :key="m.key" class="mini-card">
                <div class="mini-title">{{ m.title }}</div>
                <div class="mini-value">{{ m.value }}</div>
                <span class="mini-dot" :class="m.status" />
            </div>
        </div>
    </Card>
</template>

<script setup>
import Card from './Card.vue'

const metrics = [
    { key: 'price', title: '價格指數', value: 72, status: 'warn' },
    { key: 'quality', title: '品質指數', value: 93, status: 'good' },
    { key: 'supply', title: '供應指數', value: 73, status: 'warn' },
    { key: 'climate', title: '氣候指數', value: 78, status: 'warn' },
    { key: 'logistic', title: '運輸指數', value: 94, status: 'good' },
    { key: 'safety', title: '食安指數', value: 93, status: 'good' },
]
</script>

<style scoped>
/* 卡片結構 */
.agri-card {
    --pad-x: 16px;
    --pad-top: 10px;
    --pad-bot: 14px;
    padding: var(--pad-top) var(--pad-x) var(--pad-bot) !important;
    display: grid;
    grid-template-rows: auto auto auto;
    row-gap: 10px;
}

.card-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 2px;
}

.title {
    font-size: 22px;
    font-weight: 800;
    color: #111827;
}

/* ===== 上方藍色說明區 ===== */
.summary-slab {
    background: #e8f3ff;
    border-radius: 16px;
    padding: 14px;
    display: flex;
    align-items: center;
    gap: 18px;
    margin-bottom: 10px;
}

.score-wrap {
    position: relative;
    width: 136px;
    height: 136px;
    flex: 0 0 136px;
}

.donut {
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
}

.center {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    pointer-events: none;
}

.center .num {
    font-size: 32px;
    font-weight: 900;
    line-height: 1;
    color: #111827;
}

.center .label {
    font-size: 12px;
    color: #6b7280;
    margin-top: 2px;
}

.summary-text {
    flex: 1;
}

.chip {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #fff;
    border-radius: 999px;
    padding: 6px 12px;
    font-size: 13px;
    font-weight: 700;
    color: #000;
    box-shadow: 0 1px 0 rgba(0, 0, 0, .03);
    margin-bottom: 8px;
}

.chip .dot {
    width: 8px;
    height: 8px;
    border-radius: 999px;
    background: #10b981;
    display: inline-block;
}

.summary-text p {
    margin: 0;
    color: #475569;
    line-height: 1.7;
    font-size: 14px;
}

/* ===== 迷你指標卡 ===== */
.mini-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
}

.mini-card {
    position: relative;
    background: #fff;
    border: 1px solid #e8ece9;
    border-radius: 12px;
    padding: 10px 14px;
    padding-right: 44px; 
}

.mini-title {
    font-size: 13px;
    color: #6b7280;
}

.mini-value {
    font-size: 20px;
    font-weight: 800;
    margin-top: 4px;
}

.mini-dot{
  position: absolute;
  right: 14px;              
  top: 50%;                     
  transform: translateY(-50%);  
  width: 14px;                 
  height: 14px;             
  border-radius: 999px;
  background: #d1d5db;
}

/* 綠燈號 */
.mini-dot.good {
    background: #10b981;
}

/* 橘燈號 */
.mini-dot.warn {
    background: #f59e0b;
}

/* ===== 手機板 ===== */
@media (max-width: 768px) {

    /* 手機：指標在左、標籤與文字都在右側 */
    .summary-slab {
        display: grid;
        grid-template-columns: auto 1fr;
        align-items: center;
        column-gap: 12px;
        row-gap: 8px;
        margin-bottom: 14px;
    }

    .score-wrap {
        width: 110px;
        height: 110px;
    }

    .summary-text {
        width: 100%;
    }

    /* 迷你指標卡：手機 2 欄 */
    .mini-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
    }
}
</style>
