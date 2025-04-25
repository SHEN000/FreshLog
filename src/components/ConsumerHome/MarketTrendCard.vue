<template>
  <Card>
    <h3>📈 價格趨勢快報 / 營養排行看板</h3>

     <!-- 圖表的掛載容器 -->
    <div ref="chartContainer" class="chart-container" />

    <!-- 圖例區：點擊可切換顯示 / hover 可突顯 -->
    <div class="legend fixed">
      <span
        v-for="item in data"
        :key="item.name"
        :style="{ color: color(item.name) }"
        class="legend-item"
        @click="toggleLine(item.name)"  
        @mouseenter="highlightLine(item.name)"
        @mouseleave="highlightLine(null)"
      >
        <input type="checkbox" :checked="activeLines.has(item.name)" readonly />
        {{ item.name }}
      </span>
    </div>
  </Card>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import * as d3 from 'd3'
import { marketTrend as data } from '@/data/consumerDashboardData.js'
import Card from './Card.vue'

const chartContainer = ref(null) // 圖表容器 DOM
const activeLines = ref(new Set(data.map(d => d.name))) // 初始顯示所有線
const color = d3.scaleOrdinal(d3.schemeCategory10) // 使用 D3 顏色方案

//D3 初始化區域變數
let svg, xScale, yScale, xAxisG, yAxisG
const margin = { top: 20, right: 20, bottom: 30, left: 40 }
let highlightTarget = null

//建立 SVG 元素與基本結構
function initChart() {
  const container = chartContainer.value
  const width = container.clientWidth
  const height = container.clientHeight || 240

  svg = d3.select(container)
    .append('svg')
    .attr('width', width)
    .attr('height', height)

  const xDomain = data[0].values.map(d => d.date)
  const yDomain = [0, d3.max(data.flatMap(d => d.values.map(v => v.value)))]

  xScale = d3.scalePoint().domain(xDomain).range([margin.left, width - margin.right])
  yScale = d3.scaleLinear().domain(yDomain).nice().range([height - margin.bottom, margin.top])

  xAxisG = svg.append('g').attr('transform', `translate(0,${height - margin.bottom})`)
  yAxisG = svg.append('g').attr('transform', `translate(${margin.left},0)`)

  svg.append('g').attr('class', 'line-group')
  svg.append('g').attr('class', 'dot-group')

  updateChart()
}

//重新繪製折線與點，並更新座標軸
function updateChart() {
  const width = chartContainer.value.clientWidth
  const height = chartContainer.value.clientHeight || 240

  svg.attr('width', width).attr('height', height)
  xScale.range([margin.left, width - margin.right])
  yScale.range([height - margin.bottom, margin.top])

  //定義折線
  const line = d3.line()
    .x(d => xScale(d.date))
    .y(d => yScale(d.value))
    .curve(d3.curveCatmullRom)

  //清除舊圖、重新繪製新資料
  const lineGroup = svg.select('.line-group')
  const dotGroup = svg.select('.dot-group')
  lineGroup.selectAll('path').remove()
  dotGroup.selectAll('g').remove()

  //繪製每條折線與資料點
  data.forEach(series => {
    if (!activeLines.value.has(series.name)) return

    const path = lineGroup.append('path')
      .datum(series.values)
      .attr('fill', 'none')
      .attr('stroke', color(series.name))
      .attr('stroke-width', highlightTarget === null || highlightTarget === series.name ? 2.5 : 1.5)
      .attr('opacity', highlightTarget === null || highlightTarget === series.name ? 1 : 0.2)
      .attr('d', line)
      .attr('stroke-dasharray', function () {
        const len = this.getTotalLength()
        return `${len} ${len}`
      })
      .attr('stroke-dashoffset', function () {
        return this.getTotalLength()
      })
      .transition()
      .duration(800)
      .attr('stroke-dashoffset', 0)

    //繪製對應的資料點（小圓圈）
    const dots = dotGroup.append('g')

    dots.selectAll('circle')
      .data(series.values)
      .enter()
      .append('circle')
      .attr('cx', d => xScale(d.date))
      .attr('cy', d => yScale(d.value))
      .attr('r', 4)
      .attr('fill', color(series.name))
      .attr('opacity', highlightTarget === null || highlightTarget === series.name ? 1 : 0.2)
  })

  // 更新座標軸
  xAxisG.call(d3.axisBottom(xScale).tickSizeOuter(0))
  yAxisG.call(d3.axisLeft(yScale))
}

//點擊切換線條顯示
function toggleLine(name) {
  if (activeLines.value.has(name)) {
    activeLines.value.delete(name)
  } else {
    activeLines.value.add(name)
  }
  updateChart()
}

//滑入滑出高亮線條
function highlightLine(name) {
  highlightTarget = name
  updateChart()
}

//初始化與 Resize 監聽
onMounted(() => {
  initChart()
  const resizeObserver = new ResizeObserver(() => updateChart())
  resizeObserver.observe(chartContainer.value)
  onBeforeUnmount(() => resizeObserver.disconnect())
})
</script>

<style scoped>
/* 設定圖表區域的尺寸與定位模式（relative 為 tooltip 等絕對定位元件的依附基準） */
.chart-container {
  width: 100%;
  height: 240px;
  position: relative;
}

/* 將圖例排成橫列，可換行，並讓每個項目之間保持間距，字體大小統一為 14px */
.legend {
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
  font-size: 14px;
}

/* 滑鼠移上項目文字會變成點選指標 */
.legend-item {
  cursor: pointer;
  user-select: none;
}
</style>
