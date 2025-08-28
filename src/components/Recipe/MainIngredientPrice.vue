<template>
  <div class="price-card-outer">
    <div class="price-card-inner">
      <h3 class="title">主要食材當前價格</h3>
      <div class="main-row">
        <div class="money-icon">
          <img src="@/assets/icons/money-bag.png" alt="icon" />
        </div>

        <div class="info-block">
          <div v-for="item in items" :key="item.name" class="main-price-row">
            <span class="item-name">{{ item.name }}</span>
            <span class="item-price">${{ item.displayPrice }}</span>
            <span class="item-unit">/{{ item.unit }}</span>

            <!-- 只有非 0 才顯示 -->
            <template v-if="trendInfo(item.trend).show">
              <span class="item-change"
                    :class="{ up: trendInfo(item.trend).isUp, down: trendInfo(item.trend).isDown }">
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
</template>

<script setup>
const props = defineProps({
    items: { type: Array, default: () => [] },
    cost: { type: [Number, String], default: '' }
})

/** 將趨勢資訊轉換為顯示格式 */
function trendInfo(t) {
  let n = 0

  if (typeof t === 'number') {
    n = t
  } else if (typeof t === 'string') {
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
  const value = Number(pct.toFixed(2))        // 兩位小數
                  .toString()
                  .replace(/\.00$/, '')       // 去掉 .00
                  .replace(/(\.\d*[1-9])0+$/, '$1') // 去掉多餘 0

  return {
    show: n !== 0,       // 0 不顯示
    isUp: n > 0,         // 正數＝上升(變貴)
    isDown: n < 0,       // 負數＝下降(變便宜)
    value
  }
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
</style>
