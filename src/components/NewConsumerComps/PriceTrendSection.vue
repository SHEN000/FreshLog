<template>
  <div class="price-chart-section">
    <div class="chart-header">
      <h2>平均價格趨勢</h2>
      <div class="period-buttons">
        <button
          class="period-btn"
          :class="{ active: selectedPeriod === '30days' }"
          @click="changePeriod('30days')"
        >
          30天
        </button>
        <button
          class="period-btn"
          :class="{ active: selectedPeriod === 'halfYear' }"
          @click="changePeriod('halfYear')"
        >
          半年
        </button>
        <button
          class="period-btn"
          :class="{ active: selectedPeriod === 'year' }"
          @click="changePeriod('year')"
        >
          1年
        </button>
      </div>
    </div>

    <div class="chart-container" ref="chartContainer">
      <!-- D3.js 將在這裡渲染圖表 -->
    </div>

    <div class="chart-legend">
      <div class="legend-item">
        <span class="legend-dot" style="background-color: #6baa64"></span>
        <span class="legend-text">近2年均價(0%)</span>
      </div>
      <div class="legend-item">
        <div class="legend-color" style="background-color: #d7d0f0"></div>
        <div class="legend-text">超跌(-20%)</div>
      </div>
      <div class="legend-item">
        <div class="legend-color" style="background-color: #ffd7d7"></div>
        <div class="legend-text">超漲(+20%)</div>
      </div>
    </div>

    <div class="price-warning" :class="{ danger: warningLevel === 'high' }">
      <div class="warning-gradient"></div>
      <span class="warning-text">市場風險: 高 (-20.3%)</span>
    </div>

    <p class="chart-disclaimer">
      <span class="info-icon">ⓘ</span>
      近期準備二次收成，價格將再飆漲。如果有大量購買需求，建議等待7-10天後再購買，預計價格將下跌15-20%。
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import * as d3 from "d3";

// 設定選擇的時間範圍，預設為30天
const selectedPeriod = ref("30days");

// 圖表容器參考
const chartContainer = ref(null);

// 警告等級（控制警告條的顏色）
const warningLevel = ref("high");

// 綠色系列主色調
const primaryColor = "#6BAA64";

// 不同時間段的數據
const dataSets = {
  "30days": {
    dates: [
      "4/9",
      "4/10",
      "4/11",
      "4/12",
      "4/13",
      "4/14",
      "4/15",
      "4/16",
      "4/17",
      "4/18",
      "4/19",
      "4/20",
      "4/21",
      "4/22",
      "4/23",
    ],
    values: [42, 44, 45, 44, 43, 42, 40, 38, 36, 35, 34, 34, 34, 34, 35],
  },
  halfYear: {
    dates: ["11月", "12月", "1月", "2月", "3月", "4月"],
    values: [38, 36, 39, 42, 40, 35],
  },
  year: {
    dates: [
      "5月",
      "6月",
      "7月",
      "8月",
      "9月",
      "10月",
      "11月",
      "12月",
      "1月",
      "2月",
      "3月",
      "4月",
    ],
    values: [30, 32, 35, 38, 37, 39, 38, 36, 39, 42, 40, 35],
  },
};

// 變更時間範圍
const changePeriod = (period) => {
  selectedPeriod.value = period;
  createChart();
};

// 創建並渲染圖表
const createChart = () => {
  if (!chartContainer.value) return;

  // 清除舊圖表
  d3.select(chartContainer.value).selectAll("*").remove();

  // 獲取容器尺寸
  const width = chartContainer.value.clientWidth;
  const height = 300;
  const margin = { top: 10, right: 30, bottom: 40, left: 50 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // 獲取選定期間的數據
  const currentData = dataSets[selectedPeriod.value];

  // 創建SVG元素
  const svg = d3
    .select(chartContainer.value)
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  // 創建圖表區域
  const chart = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // 定義比例尺
  const xScale = d3
    .scaleBand()
    .domain(currentData.dates)
    .range([0, innerWidth])
    .padding(0.1);

  const yScale = d3
    .scaleLinear()
    .domain([0, 50]) // 固定範圍從0到50元
    .range([innerHeight, 0]);

  // 添加背景區域 - 超跌區域（紫色）
  chart
    .append("rect")
    .attr("x", 0)
    .attr("y", yScale(25))
    .attr("width", innerWidth)
    .attr("height", yScale(0) - yScale(25))
    .attr("fill", "#D7D0F0");

  // 添加中間區域（淺綠色）
  chart
    .append("rect")
    .attr("x", 0)
    .attr("y", yScale(40))
    .attr("width", innerWidth)
    .attr("height", yScale(25) - yScale(40))
    .attr("fill", "#E8F4E8");

  // 添加超漲區域（粉紅色）
  chart
    .append("rect")
    .attr("x", 0)
    .attr("y", yScale(50))
    .attr("width", innerWidth)
    .attr("height", yScale(40) - yScale(50))
    .attr("fill", "#FFD7D7");

  // 添加參考線 - 均價
  chart
    .append("line")
    .attr("x1", 0)
    .attr("x2", innerWidth)
    .attr("y1", yScale(40))
    .attr("y2", yScale(40))
    .attr("stroke", "#FF6B6B")
    .attr("stroke-width", 1.5)
    .attr("stroke-dasharray", "3,3");

  // 添加下參考線
  chart
    .append("line")
    .attr("x1", 0)
    .attr("x2", innerWidth)
    .attr("y1", yScale(25))
    .attr("y2", yScale(25))
    .attr("stroke", "#FFB347")
    .attr("stroke-width", 1.5)
    .attr("stroke-dasharray", "3,3");

  // 添加下參考線
  chart
    .append("line")
    .attr("x1", 0)
    .attr("x2", innerWidth)
    .attr("y1", yScale(10))
    .attr("y2", yScale(10))
    .attr("stroke", "#9370DB")
    .attr("stroke-width", 1.5)
    .attr("stroke-dasharray", "3,3");

  // 創建線條生成器
  const line = d3
    .line()
    .x((d) => xScale(d.date) + xScale.bandwidth() / 2)
    .y((d) => yScale(d.value))
    .curve(d3.curveMonotoneX); // 使用平滑曲線

  // 轉換數據為 D3 格式
  const lineData = currentData.dates.map((date, i) => ({
    date,
    value: currentData.values[i],
  }));

  // 繪製線條
  const path = chart
    .append("path")
    .datum(lineData)
    .attr("fill", "none")
    .attr("stroke", primaryColor)
    .attr("stroke-width", 3)
    .attr("d", line);

  // 添加線條動畫
  const pathLength = path.node().getTotalLength();
  path
    .attr("stroke-dasharray", pathLength)
    .attr("stroke-dashoffset", pathLength)
    .transition()
    .duration(1000)
    .attr("stroke-dashoffset", 0);

  // 添加數據點
  chart
    .selectAll(".data-point")
    .data(lineData)
    .enter()
    .append("circle")
    .attr("class", "data-point")
    .attr("cx", (d) => xScale(d.date) + xScale.bandwidth() / 2)
    .attr("cy", (d) => yScale(d.value))
    .attr("r", 0)
    .attr("fill", primaryColor)
    .transition()
    .delay((d, i) => i * 100)
    .duration(500)
    .attr("r", 5);

  // 添加X軸
  chart
    .append("g")
    .attr("transform", `translate(0, ${innerHeight})`)
    .call(d3.axisBottom(xScale))
    .selectAll("text")
    .style("font-size", "12px");

  // 添加Y軸
  chart
    .append("g")
    .call(d3.axisLeft(yScale).tickFormat((d) => `${d} 元`))
    .selectAll("text")
    .style("font-size", "12px");

  // 添加懸停效果
  const tooltip = d3
    .select(chartContainer.value)
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)
    .style("position", "absolute")
    .style("background", "white")
    .style("padding", "10px")
    .style("border-radius", "5px")
    .style("box-shadow", "0 2px 4px rgba(0,0,0,0.1)")
    .style("pointer-events", "none");

  chart
    .selectAll(".data-point")
    .on("mouseover", function (event, d) {
      d3.select(this).transition().duration(200).attr("r", 8);

      tooltip.transition().duration(200).style("opacity", 1);

      tooltip
        .html(
          `
        <div style="font-weight: bold;">${d.date}</div>
        <div>${d.value} 元/公斤</div>
      `
        )
        .style(
          "left",
          `${
            event.pageX - chartContainer.value.getBoundingClientRect().left + 15
          }px`
        )
        .style(
          "top",
          `${
            event.pageY - chartContainer.value.getBoundingClientRect().top - 40
          }px`
        );
    })
    .on("mouseout", function () {
      d3.select(this).transition().duration(200).attr("r", 5);

      tooltip.transition().duration(500).style("opacity", 0);
    });
};

// 監聽窗口大小變化
let resizeObserver;

onMounted(() => {
  createChart();

  // 使用 ResizeObserver 監聽容器尺寸變化
  resizeObserver = new ResizeObserver(() => {
    createChart();
  });

  if (chartContainer.value) {
    resizeObserver.observe(chartContainer.value);
  }
});

onUnmounted(() => {
  // 清理資源
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
});

// 監聽時間範圍變化
watch(selectedPeriod, () => {
  createChart();
});
</script>

<style scoped>
.price-chart-section {
  background-color: #fff;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.chart-header h2 {
  margin: 0;
  font-size: 20px;
  color: #333;
}

.period-buttons {
  display: flex;
  gap: 8px;
}

.period-btn {
  background-color: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  padding: 6px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.period-btn.active {
  background-color: #4caf50;
  color: white;
  border-color: #4caf50;
}

.chart-container {
  height: 300px;
  width: 100%;
  position: relative;
  margin-bottom: 15px;
}

.chart-legend {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 15px;
}

.legend-item {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #666;
}

.legend-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 5px;
}

.legend-color {
  width: 16px;
  height: 16px;
  margin-right: 5px;
}

.price-warning {
  position: relative;
  overflow: hidden;
  padding: 10px 15px;
  border-radius: 8px;
  margin-bottom: 15px;
  background-color: #f9f9f9;
  color: #333;
  display: flex;
  align-items: center;
}

.price-warning.danger {
  padding-top: 20px;
  background-color: #fff3f3;
  color: #e53e3e;
  font-weight: bold;
}

.warning-gradient {
  position: absolute;
  padding-bottom: 10px;
  left: 0;
  top: 0;
  bottom: 0;
  width: 100%;
  background: linear-gradient(90deg, #4caf50 0%, #ffeb3b 50%, #f44336 100%);
  opacity: 0.7;
  height: 10px;
}

.warning-text {
  margin-left: 5px;
}

.chart-disclaimer {
  font-size: 12px;
  color: #666;
  line-height: 1.5;
  margin: 0;
  padding: 0 5px;
}

.info-icon {
  display: inline-block;
  width: 16px;
  height: 16px;
  text-align: center;
  border-radius: 50%;
  background-color: #eee;
  margin-right: 5px;
  font-size: 12px;
  color: #555;
}

/* D3 特定樣式 */
:deep(.x-axis line),
:deep(.y-axis line) {
  stroke: #e0e0e0;
}

:deep(.x-axis path),
:deep(.y-axis path) {
  stroke: #e0e0e0;
}

:deep(.data-point) {
  cursor: pointer;
}
</style>
