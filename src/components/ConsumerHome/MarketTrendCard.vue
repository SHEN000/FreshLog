<template>
  <Card class="trend-card">
    <!-- Header -->
    <div class="card-head">
      <div class="title-wrap">
        <h3 class="title">今日市場行情</h3>
        <button class="pill" @click="refresh">即時更新</button>
      </div>

      <div class="controls">
        <div class="select-wrap">
          <select v-model="selectedItem" class="select" aria-label="選擇品項">
            <option v-for="it in items" :key="it" :value="it">{{ it }}</option>
          </select>
        </div>
        <span class="hint">過去7天價格走勢</span>
      </div>
    </div>

    <div class="slab">
      <div ref="chartEl" class="chart"></div>
    </div>

    <div class="highlights">
      <div class="hi-card">
        <div class="hi-label">周下跌最多</div>
        <div class="hi-center">
          <div class="hi-price down">
            <span class="sym">$</span>{{ highlight.weekDown.price }}<span class="unit">/{{ unit }}</span>
          </div>
          <div class="hi-name">{{ highlight.weekDown.name }}</div>
        </div>
      </div>

      <div class="hi-card">
        <div class="hi-label">周上漲最多</div>
        <div class="hi-center">
          <div class="hi-price up">
            <span class="sym">$</span>{{ highlight.weekUp.price }}<span class="unit">/{{ unit }}</span>
          </div>
          <div class="hi-name">{{ highlight.weekUp.name }}</div>
        </div>
      </div>

      <div class="hi-card">
        <div class="hi-label">漲幅最多</div>
        <div class="hi-center">
          <div class="hi-price up">
            <span class="sym">$</span>{{ highlight.dayUp.price }}<span class="unit">/{{ unit }}</span>
          </div>
          <div class="hi-name">{{ highlight.dayUp.name }}</div>
        </div>
      </div>
    </div>
  </Card>
</template>

<script setup>
import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue'
import * as d3 from 'd3'
import { marketTrend } from '@/data/consumerDashboardData.js'
import Card from './Card.vue'

/* ----- data (7天) ----- */
const unit = marketTrend.unit
const items = marketTrend.items
const table = marketTrend.last7days || []

const selectedItem = ref(items[0])
const series = computed(() =>
  table.map(d => ({ date: d.date, price: d[selectedItem.value] }))
)

const highlight = computed(() => {
  if (!table.length) {
    return {
      weekDown: { name: '-', price: 0 },
      weekUp: { name: '-', price: 0 },
      dayUp: { name: '-', price: 0 }
    }
  }
  const firstIdx = 0
  const lastIdx = table.length - 1
  const prevIdx = Math.max(lastIdx - 1, 0)

  const weekDiff = items.map(name => {
    const first = table[firstIdx]?.[name] ?? 0
    const last = table[lastIdx]?.[name] ?? 0
    return { name, diff: last - first, last }
  })
  const weekDown = weekDiff.reduce((m, c) => (c.diff < m.diff ? c : m), weekDiff[0])
  const weekUp = weekDiff.reduce((m, c) => (c.diff > m.diff ? c : m), weekDiff[0])

  const dayDiff = items.map(name => {
    const prev = table[prevIdx]?.[name] ?? 0
    const last = table[lastIdx]?.[name] ?? 0
    return { name, diff: last - prev, last }
  })
  const dayUp = dayDiff.reduce((m, c) => (c.diff > m.diff ? c : m), dayDiff[0])

  return {
    weekDown: { name: weekDown.name, price: weekDown.last },
    weekUp: { name: weekUp.name, price: weekUp.last },
    dayUp: { name: dayUp.name, price: dayUp.last }
  }
})

/* ----- D3 bar chart (綠色漸層) ----- */
const chartEl = ref(null)
let svg, x, y, barsG, resizeObs

function ensureGradient() {
  if (!svg) return
  let defs = svg.select('defs')
  if (defs.empty()) defs = svg.append('defs')
  if (!svg.select('#barGrad').node()) {
    const grad = defs.append('linearGradient')
      .attr('id', 'barGrad')
      .attr('x1', '0').attr('y1', '0')
      .attr('x2', '0').attr('y2', '1')
    grad.append('stop').attr('offset', '0%').attr('stop-color', '#22c55e')
    grad.append('stop').attr('offset', '100%').attr('stop-color', '#16a34a')
  }
}

function draw() {
  const el = chartEl.value
  if (!el) return
  const W = Math.max(el.clientWidth, 120)
  const H = Math.max(el.clientHeight, 120)
  if (W < 20 || H < 20) return

  const PADX = 12, PADY = 8

  if (!svg) {
    svg = d3.select(el).append('svg').attr('class', 'svg')
    barsG = svg.append('g').attr('class', 'bars')
  }
  svg.attr('width', W).attr('height', H)
  ensureGradient()

  x = d3.scaleBand()
    .domain(series.value.map(d => d.date))
    .range([PADX, W - PADX])
    .padding(0.24)

  const maxY = d3.max(series.value, d => d.price) || 0
  y = d3.scaleLinear()
    .domain([0, maxY * 1.2])
    .range([H - PADY, PADY])

  const sel = barsG.selectAll('rect.bar').data(series.value, d => d.date)

  sel.enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('x', d => x(d.date))
    .attr('width', x.bandwidth())
    .attr('y', H - PADY).attr('height', 0)
    .attr('rx', 8)
    .style('fill', 'url(#barGrad)')
    .transition().duration(450)
    .attr('y', d => y(d.price))
    .attr('height', d => (H - PADY) - y(d.price))

  sel.transition().duration(300)
    .attr('x', d => x(d.date))
    .attr('width', x.bandwidth())
    .attr('y', d => y(d.price))
    .attr('height', d => (H - PADY) - y(d.price))

  sel.exit().transition().duration(150)
    .attr('y', H - PADY)
    .attr('height', 0)
    .remove()
}

function refresh() {
  if (!table.length) return
  const last = table[table.length - 1]
  items.forEach(name => {
    const delta = Math.round((Math.random() - 0.5) * 4) // -2~+2
    last[name] = Math.max(1, last[name] + delta)
  })
  draw()
}

onMounted(() => {
  draw()
  resizeObs = new ResizeObserver(draw)
  resizeObs.observe(chartEl.value.parentElement)
})
onBeforeUnmount(() => resizeObs && resizeObs.disconnect())
watch([selectedItem], draw)
</script>

<style scoped>
.trend-card {
  display: grid;
  grid-template-rows: auto auto 1fr;
  row-gap: 0;
  overflow: hidden;
}

/* Header */
.card-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  min-height: 32px;
}

.title-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}

.title {
  font-size: 22px;
  font-weight: 800;
  color: #1f2937;
  line-height: 0.3;
}

.pill {
  font-size: 12px;
  padding: 3px 8px;
  border-radius: 999px;
  border: 0;
  background: #e7f6eb;
  color: #1a7f3c;
  cursor: pointer;
}

.controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.select-wrap {
  position: relative;
  display: inline-block;
}

.select-wrap::after {
  content: "";
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 10px;
  height: 10px;
  pointer-events: none;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%2390a4ae' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>");
  background-repeat: no-repeat;
  background-position: center;
}

.select {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 6px 28px 6px 10px;
  font-size: 13px;
  min-width: 120px;
  line-height: 1.2;
}

.select:focus {
  outline: 2px solid #c7f0d7;
  border-color: #22c55e;
}

.hint {
  color: #94a3b8;
  font-size: 12px;
}

.slab {
  background: #eaf7ef;
  border-radius: 14px;
  padding: 8px 10px;
  display: flex;
  overflow: hidden;
  min-height: 0;
  height: 140px;
  margin-bottom: 16px;
}

.chart {
  width: 100%;
  height: 100%;
  min-height: 0;
}

.svg {
  display: block;
}

.highlights {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  min-height: 0;
}

/* 小方塊統一字級與間距 */
.hi-card {
  position: relative;
  background: #f1f5f3;
  border: 1px solid #e8ece9;
  border-radius: 12px;
  padding: 22px 12px 12px;
  min-height: 50px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.hi-label {
  position: absolute;
  left: 10px;
  top: 8px;
  color: #64748b;
  font-size: 12px;
  font-weight: 600;
  line-height: 1;
}

/* 置中兩行區塊 */
.hi-center {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  text-align: center;
}

.hi-price {
  font-size: 24px;
  font-weight: 900;
  letter-spacing: 0.3px;
}

.hi-price.up {
  color: #e11d48;
}

.hi-price.down {
  color: #16a34a;
}

.hi-price .sym {
  margin-right: 2px;
}

.hi-price .unit {
  font-size: inherit;
  font-weight: inherit;
  line-height: inherit;
  margin-left: 2px;
  color: currentColor;
}

.hi-name {
  font-size: 13px;
  color: #000;
  font-weight: 500;
  line-height: 1.0;
}

@media (max-width: 768px) {
  .trend-card {
    height: auto;
    grid-template-rows: auto auto auto;
    row-gap: 12px;
    padding: 14px 14px 12px !important;
  }

  /* 讓「選單＋文字」靠在一起，並與圖表拉開距離 */
  .card-head {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }

  .controls {
    width: 100%;
    display: flex;
    justify-content: center;  
    align-items: center;
    gap: 6px;                 
    margin-bottom: 10px;     
  }

  .select-wrap { flex: 0 0 auto; }
  .hint { white-space: nowrap; }  /* 避免斷行 */

  .slab {
    height: 160px;
    padding: 10px;
    border-radius: 16px;
    margin-bottom: 8px;
  }

  .highlights {
    grid-template-columns: 1fr;
  }

  .hi-card {
    min-height: 68px;
    border-radius: 14px;
  }
}
</style>
