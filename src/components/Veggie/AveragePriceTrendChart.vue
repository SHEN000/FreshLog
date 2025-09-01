<template>
  <div class="chart-container">
    <div class="chart-header">
      <div class="chart-title">平均價格趨勢</div>
      <div ref="tooltipEl" class="fixed-tooltip">
        <template v-if="activePoint">
          價格: {{ activePoint.price.toFixed(1) }}<br>
          日期: {{ formatDate(activePoint.date) }}
        </template>
      </div>
      <div class="period-buttons">
        <button v-for="period in ['30days', '6months', '1year']" :key="period"
          :class="{ active: selectedPeriod === period }" @click="changePeriod(period)">
          {{ labelMap[period] }}
        </button>
      </div>
    </div>

    <div ref="chartArea" class="chart-area"></div>

    <div class="chart-legend">
      <div class="legend-item"><span class="legend-color orange"></span>近3年均價(0%)</div>
      <div class="legend-item"><span class="legend-color purple"></span>超跌(-20%)</div>
      <div class="legend-item"><span class="legend-color red"></span>超漲(+20%)</div>
    </div>

    <!-- 其他說明文字 先寫死 -->
    <!-- <div class="market-risk">市場風險: 高 (-20.3%)</div>
    <div class="market-note">近期準備二次收成，價格將再降。建議等待 7-10 天後再購買。</div> -->
  </div>
</template>

<script setup>

import * as d3 from 'd3'
import { ref, onMounted, onUnmounted, watch } from 'vue'
import axios from 'axios'

// 建立 Reactive 變數
const chartArea = ref(null) // svg 容器
const tooltipEl = ref(null) // 固定提示框 DOM
const selectedPeriod = ref('30days') // 當前選擇時間區間
const activePoint = ref(null) // 當前滑鼠懸停的資料點
const labelMap = { '30days': '30天', '6months': '半年', '1year': '1年' }

// API 對應
const periodToApi = {
  '30days': 'DAY_30',
  '6months': 'DAY_180',
  '1year': 'DAY_360'
}

// 快取每個區間的資料：[{date, price}]
const seriesCache = ref({})

// 以目前區間資料的平均價當基準線
const basePrice = ref()

// 重新計算「全部資料」的平均價
function recomputeGlobalBase() {
  const uniq = new Map(); 
  Object.values(seriesCache.value).forEach(arr => {
    if (Array.isArray(arr)) {
      arr.forEach(p => {
        if (!uniq.has(p.date)) uniq.set(p.date, p.price);
      });
    }
  });

  const vals = Array.from(uniq.values());
  if (vals.length) {
    const avg = d3.mean(vals);      
    if (typeof avg === 'number' && !isNaN(avg)) {
      basePrice.value = avg;    
    }
  }
}


// D3 時間格式化：月/日
const formatMonthDay = d3.timeFormat("%m/%d")

// 轉 API 回傳 -> 圖表資料
function mapApiTrend(list = []) {
  return (list ?? [])
    .filter(x => x && x.intervalEnd != null)
    .map(({ intervalEnd, avgPrice }) => ({
      date: intervalEnd,
      price: avgPrice === 0 ? null : Number(avgPrice ?? null)   // ← 0 當缺資料
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date))
}

const props = defineProps({
  foodId: { type: String, required: true }
})

const inFlight = new Map()
const keyOf = (period) => `${props.foodId}:${period}`

async function ensureData(period, { force = false } = {}) {
  const key = keyOf(period);
  if (!force && Array.isArray(seriesCache.value[key])) return; // 有快取才跳過
  if (inFlight.has(key)) return inFlight.get(key);

  const p = axios.get('/api/food/average-price-trends', {
    params: { days: periodToApi[period], foodId: props.foodId }
  })
  .then(({ data }) => {
    const payload = data?.data || {};
    const candidate = payload.trend30 ?? payload.trendHalfYear ?? payload.trendYear ?? [];
    seriesCache.value[key] = mapApiTrend(candidate);
    recomputeGlobalBase();
  })
  .finally(() => inFlight.delete(key));

  inFlight.set(key, p);
  return p;
}

/*
 * 根據不同區間，把日期字串格式化顯示
 * - 30days、6months：顯示 YYYY/MM/DD
 * - 1year：顯示 YYYY/MM
 */
const formatDate = (dateStr) => {
  const date = new Date(dateStr);

  if (isNaN(date.getTime())) return dateStr;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');

  if (selectedPeriod.value === '30days' || selectedPeriod.value === '6months') {
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  } else if (selectedPeriod.value === '1year') {
    return `${year}/${month}`;
  } else {
    return formatMonthDay(date);
  }
}

let resizeObserver = null

// 線性補值：把 price 為 null/0 的點補成左右相鄰有值點之間的線性插值
function interpolateMissing(arr) {
  const out = arr.map(d => ({ ...d, imputed: false }))

  let i = 0
  while (i < out.length) {
    if (out[i].price == null || out[i].price <= 0) {
      // 找左/右最近的有值點
      let L = i - 1
      while (L >= 0 && (out[L].price == null || out[L].price <= 0)) L--
      let R = i + 1
      while (R < out.length && (out[R].price == null || out[R].price <= 0)) R++

      if (L >= 0 && R < out.length) {
        // 兩側都有值 → 用線性補值把 L..R 之間全部補起來
        const left = out[L].price
        const right = out[R].price
        const span = R - L
        for (let k = L + 1; k < R; k++) {
          const t = (k - L) / span
          out[k].price = left + (right - left) * t
          out[k].imputed = true
        }
        i = R + 1
        continue
      } else {
        // 只有一側有值（開頭或結尾缺）→ 用最近的一側值帶過去
        if (L >= 0) {
          out[i].price = out[L].price
          out[i].imputed = true
        } else if (R < out.length) {
          out[i].price = out[R].price
          out[i].imputed = true
        }
      }
    }
    i++
  }
  return out
}

// 繪製圖表
function drawChart() {
  const raw = seriesCache.value[keyOf(selectedPeriod.value)] || []
  const container = chartArea.value

  d3.select(container).selectAll('*').remove()
  if (!raw.length) return

    // 先做補值
  const data = interpolateMissing(raw)

  // 清空之前繪製的
  d3.select(container).selectAll('*').remove()

  // 計算圖表寬高
  const fullWidth = container.clientWidth
  const margin = { top: 20, right: 20, bottom: 40, left: 40 }
  const width = fullWidth - margin.left - margin.right
  const height = width * 0.5

  // 建立 svg 主群組
  const svg = d3.select(container)
    .append('svg')
    .attr('width', fullWidth)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`)

  // X 軸：所有日期
  const allDates = data.map(d => d.date)

  // 調整不同時間範圍的日期顯示間隔
  let tickDates;
  if (selectedPeriod.value === '30days') {
    tickDates = allDates.filter((_, i) => i % 5 === 0); // 每5個點顯示一次
  } else if (selectedPeriod.value === '6months') {
    tickDates = allDates.filter((_, i) => i % 5 === 0); // 每6個點顯示一次
  } else if (selectedPeriod.value === '1year') {
    tickDates = allDates.filter((_, i) => i % 2 === 0); // 每2個點顯示一次
  } else {
    tickDates = allDates;
  }

  // 預先產生每個 tick 的 label，只在跨年時帶上年
  const tickLabels = {}
  let lastYear = null
  tickDates.forEach(dStr => {
    const dt = new Date(dStr)
    const yyyy = dt.getFullYear()
    const mm = String(dt.getMonth() + 1).padStart(2, '0')
    const dd = String(dt.getDate()).padStart(2, '0')
    let lbl
    if (selectedPeriod.value === '1year') {
      // 1 年：第一個或跨年的才顯示 YYYY/MM，其餘只顯示 MM
      if (yyyy !== lastYear) {
        lbl = `${yyyy}/${mm}`
        lastYear = yyyy
      } else {
        lbl = mm
      }
    } else if (selectedPeriod.value === '6months') {
      // 半年：跨年時顯示 YYYY/MM/DD，其餘只顯示 MM/DD
      if (yyyy !== lastYear) {
        lbl = `${yyyy}/${mm}/${dd}`
        lastYear = yyyy
      } else {
        lbl = `${mm}/${dd}`
      }
    } else {
      // 30天：保持原來的 月/日
      lbl = formatMonthDay(dt)
    }
    tickLabels[dStr] = lbl
  })


  // 建立比例尺
  const x = d3.scalePoint()
    .domain(allDates)
    .range([0, width])

  // y 軸：只看有價點，避免 0 拉垮比例
  const maxY = (d3.max(data, d => d.price) || 1) * 1.2
  const minY = Math.min(basePrice.value * 0.5, (d3.min(data, d => d.price) || basePrice.value) * 0.9)
  const y = d3.scaleLinear().domain([minY, maxY]).range([height, 0])

  // X 軸
  svg.append('g')
    .attr('transform', `translate(0,${height})`)
    .call(
      d3.axisBottom(x)
        .tickValues(tickDates)
        .tickFormat(d => tickLabels[d] || d)
    )

  // Y 軸
  svg.append('g').call(d3.axisLeft(y))

  // 底色區域：超跌 / 正常 / 超漲 , 調整為正負20%
  const areaLower  = d3.area().x(d => x(d.date)).y0(height).y1(y(basePrice.value * 0.8))
  const areaNormal = d3.area().x(d => x(d.date)).y0(y(basePrice.value * 0.8)).y1(y(basePrice.value * 1.2))
  const areaUpper  = d3.area().x(d => x(d.date)).y0(y(basePrice.value * 1.2)).y1(0)
  svg.append('path').datum(data).attr('fill', '#e0d7f1').attr('d', areaLower)
  svg.append('path').datum(data).attr('fill', '#e0f1e0').attr('d', areaNormal)
  svg.append('path').datum(data).attr('fill', '#f1e0e0').attr('d', areaUpper)

  // 參考線 - 調整為正負20%
  const guides = [
    { price: basePrice.value * 0.8, color: 'purple' },
    { price: basePrice.value, color: 'orange' },
    { price: basePrice.value * 1.2, color: 'red' }
  ]
  guides.forEach(({ price, color }) => {
    svg.append('line')
      .attr('x1', 0).attr('x2', width)
      .attr('y1', y(price)).attr('y2', y(price))
      .attr('stroke', color)
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '3,3')
  })

  // 折線：跳過缺資料 → 自動斷線
  const line = d3.line()
    .x(d => x(d.date))
    .y(d => y(d.price))

  svg.append('path')
    .datum(data)
    .attr('fill', 'none')
    .attr('stroke', '#2e7d32')
    .attr('stroke-width', 2)
    .attr('d', line)

  // 清除先前的滑鼠懸停資料
  activePoint.value = null;

  // 數據點與滑鼠互動
  // 點：原始 = 實心；補值 = 空心
  const observed = raw.map((d, i) => ({ ...data[i], isObserved: d.price != null && d.price > 0 }))
  svg.selectAll('.dot')
    .data(observed.filter(d => d.isObserved))
    .join('circle')
    .attr('class', 'dot')
    .attr('cx', d => x(d.date)).attr('cy', d => y(d.price))
    .attr('r', 3).attr('fill', '#2e7d32')
    .on('mouseover', function (event, d) { d3.select(this).attr('r', 6); activePoint.value = d })
    .on('mouseout',  function () { d3.select(this).attr('r', 3); activePoint.value = null })

  svg.selectAll('.dot-imputed')
    .data(observed.filter(d => !d.isObserved))
    .join('circle')
    .attr('class', 'dot-imputed')
    .attr('cx', d => x(d.date)).attr('cy', d => y(d.price))
    .attr('r', 3).attr('fill', 'white').attr('stroke', '#2e7d32')
    .append('title')
    .text(d => `補值：${formatDate(d.date)}`)
}

const changePeriod = async (period) => {
  if (selectedPeriod.value === period) return
  selectedPeriod.value = period
  // 每次切換都重打就 force: true；只打一次就拿掉 force
  await ensureData(period, { force: true })
  drawChart()
}

onMounted(async () => {
  // 先抓 1 年資料 → 做為「全部資料」的基準
  await ensureData('1year')
  // 再抓目前選取的區間（例如 30 天）
  await ensureData(selectedPeriod.value)
  // 這時候 basePrice 已經是「全部資料平均
  drawChart()
  resizeObserver = new ResizeObserver(() => drawChart())
  resizeObserver.observe(chartArea.value)
})

onUnmounted(() => {
  if (resizeObserver) resizeObserver.disconnect()
})

// 當區間變更時重畫
watch(selectedPeriod, async (p) => {
  await ensureData(p /*, { force: true }*/ )
  drawChart()
})
</script>

<style scoped>
/* 圖表容器 */
.chart-container {
  width: 100%;
  padding: 20px;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
  position: relative;
}

/* 標題與按鈕區塊 */
.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  position: relative;
}

.chart-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #2e7d32;
}

.period-buttons {
  margin-bottom: 15px;
}

.period-buttons button {
  padding: 6px 16px;
  margin-right: 10px;
  border: 1px solid #ddd;
  border-radius: 20px;
  background: #fff;
  cursor: pointer;
}

.period-buttons button.active {
  background-color: #2e7d32;
  color: white;
  border-color: #2e7d32;
}

/* 固定提示框 */
/* 顯示滑鼠懸停點的資料 */
.fixed-tooltip {
  font-size: 14px;
  background: #2e7d32;
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  position: absolute;
  transform: translateX(-50%);
  /* 水平置中 */
  top: 50px;
  /* 定位在上方 */
  left: 50%;
  min-height: 20px;
  min-width: 80px;
  opacity: 0;
  transition: opacity 0.2s;
  pointer-events: none;
  z-index: 10000;
}

.fixed-tooltip:empty {
  opacity: 0;
}

/* 當有內容時才顯示 */
.fixed-tooltip:not(:empty) {
  opacity: 1;
}

/* 圖例說明、風險文字 */
.chart-legend {
  display: flex;
  gap: 12px;
  font-size: 14px;
  margin-top: 15px;
}

.chart-area {
  width: 100%;
}

.legend-item {
  display: flex;
  align-items: center;
}

.legend-color {
  width: 16px;
  height: 10px;
  margin-right: 6px;
  display: inline-block;
}

.legend-color.orange {
  background: orange;
}

.legend-color.purple {
  background: #e0d7f1;
}

.legend-color.red {
  background: #f1e0e0;
}

.market-risk {
  margin-top: 12px;
  font-weight: bold;
  color: #d32f2f;
}

.market-note {
  font-size: 14px;
  color: #555;
  margin-top: 6px;
}

/* 手機版調整 */
@media (max-width: 768px) {
  .chart-title {
    font-size: 18px;
    margin-bottom: 8px;
  }

  .fixed-tooltip {
    font-size: 12px;
    background: #2e7d32;
    color: white;
    padding: 8px 12px;
    border-radius: 4px;
    position: absolute;
    transform: translateX(-50%);
    top: 50px;
    left: 50%;
    min-height: 20px;
    min-width: 80px;
    opacity: 0;
    transition: opacity 0.2s;
    pointer-events: none;
    z-index: 10000;
  }

  .period-buttons {
    gap: 8px;
    margin-bottom: 12px;
  }

  .period-buttons button {
    padding: 4px 8px;
    font-size: 14px;
  }

  .chart-legend {
    gap: 8px;
    font-size: 12px;
    margin-top: 12px;
  }

  .market-risk {
    font-size: 14px;
    margin-top: 10px;
  }

  .market-note {
    font-size: 12px;
    margin-top: 4px;
  }
}
</style>
