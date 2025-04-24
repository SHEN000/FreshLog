<template>
  <div class="price-chart-section">
    <h2>平均價格趨勢</h2>

    <div class="price-gauge">
      <div class="gauge-label low">30天</div>
      <div class="gauge-track">
        <div class="gauge-fill" style="width: 70%"></div>
        <div class="gauge-marker" style="left: 70%"></div>
      </div>
      <div class="gauge-label high">1年</div>
    </div>

    <div class="chart-container">
      <canvas ref="chartCanvas" class="price-chart"></canvas>
    </div>

    <div class="chart-legend">
      <div class="legend-item">
        <div class="legend-color" style="background-color: #ff6b6b"></div>
        <div class="legend-text">市場(30%)</div>
      </div>
      <div class="legend-item">
        <div class="legend-color" style="background-color: #4ecdc4"></div>
        <div class="legend-text">產銷(25%)</div>
      </div>
      <div class="legend-item">
        <div class="legend-color" style="background-color: #7d70ba"></div>
        <div class="legend-text">線上(20%)</div>
      </div>
    </div>

    <div class="price-warning">
      <span class="warning-icon">⚠️</span>
      <span class="warning-text">市場價格漲: (-20.3%)</span>
    </div>

    <p class="chart-disclaimer">
      ① 此產品統二次週期，現產自桃園市場處，根據產季變動價差，10~2月間看好。<br />
      ② 近期紅蘿蔔上漲23%。
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const chartCanvas = ref(null);

onMounted(() => {
  if (chartCanvas.value) {
    renderChart();
  }
});

function renderChart() {
  const ctx = chartCanvas.value.getContext("2d");

  // 設置Canvas尺寸
  chartCanvas.value.width = chartCanvas.value.offsetWidth;
  chartCanvas.value.height = 250;

  // 設置數據
  const months = [
    "1月",
    "2月",
    "3月",
    "4月",
    "5月",
    "6月",
    "7月",
    "8月",
    "9月",
    "10月",
    "11月",
    "12月",
  ];
  const marketData = [35, 33, 36, 32, 34, 38, 45, 42, 40, 36, 34, 32];
  const retailData = [40, 38, 42, 39, 40, 44, 50, 48, 46, 42, 40, 38];
  const onlineData = [32, 30, 33, 29, 31, 35, 42, 40, 37, 32, 30, 28];

  // 設置圖表參數
  const padding = 40;
  const graphWidth = chartCanvas.value.width - 2 * padding;
  const graphHeight = chartCanvas.value.height - 2 * padding;

  // 繪製座標軸
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, chartCanvas.value.height - padding);
  ctx.lineTo(
    chartCanvas.value.width - padding,
    chartCanvas.value.height - padding
  );
  ctx.strokeStyle = "#ccc";
  ctx.stroke();

  // 繪製水平格線
  ctx.strokeStyle = "#eee";
  ctx.beginPath();
  for (let i = 1; i <= 5; i++) {
    const y = padding + graphHeight - (i * graphHeight) / 5;
    ctx.moveTo(padding, y);
    ctx.lineTo(chartCanvas.value.width - padding, y);
  }
  ctx.stroke();

  // 繪製漸變填充
  function drawGradientFill(data, color) {
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.1;
    ctx.beginPath();

    // 起始點在 x 軸上
    ctx.moveTo(padding, chartCanvas.value.height - padding);

    // 繪製數據點
    data.forEach((value, index) => {
      const x = padding + (index * graphWidth) / (data.length - 1);
      const y =
        chartCanvas.value.height - padding - ((value - 25) * graphHeight) / 30;
      ctx.lineTo(x, y);
    });

    // 回到 x 軸
    ctx.lineTo(
      chartCanvas.value.width - padding,
      chartCanvas.value.height - padding
    );
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1.0;
  }

  // 繪製數據線
  function drawDataLine(data, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();

    data.forEach((value, index) => {
      const x = padding + (index * graphWidth) / (data.length - 1);
      const y =
        chartCanvas.value.height - padding - ((value - 25) * graphHeight) / 30;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();
  }

  // 繪製月份標籤
  ctx.fillStyle = "#666";
  ctx.font = "12px Arial";
  ctx.textAlign = "center";
  months.forEach((month, index) => {
    const x = padding + (index * graphWidth) / (months.length - 1);
    const y = chartCanvas.value.height - padding + 20;
    ctx.fillText(month, x, y);
  });

  // 繪製價格標籤
  ctx.textAlign = "right";
  for (let i = 0; i <= 5; i++) {
    const value = 25 + i * 6;
    const y = chartCanvas.value.height - padding - (i * graphHeight) / 5 + 5;
    ctx.fillText("$" + value, padding - 10, y);
  }

  // 繪製數據
  drawGradientFill(marketData, "#FF6B6B");
  drawGradientFill(retailData, "#4ECDC4");
  drawGradientFill(onlineData, "#7D70BA");

  drawDataLine(marketData, "#FF6B6B");
  drawDataLine(retailData, "#4ECDC4");
  drawDataLine(onlineData, "#7D70BA");
}
</script>

<style scoped>
.price-chart-section {
  background-color: #fff;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.price-chart-section h2 {
  margin-top: 0;
  font-size: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.price-gauge {
  display: flex;
  align-items: center;
  margin: 15px 0;
}

.gauge-track {
  flex: 1;
  height: 8px;
  background-color: #eee;
  border-radius: 4px;
  margin: 0 10px;
  position: relative;
}

.gauge-fill {
  height: 100%;
  background-color: #4caf50;
  border-radius: 4px;
}

.gauge-marker {
  position: absolute;
  top: -5px;
  width: 18px;
  height: 18px;
  background-color: #fff;
  border: 2px solid #4caf50;
  border-radius: 50%;
  transform: translateX(-50%);
}

.chart-container {
  height: 250px;
  background-color: #fff;
  margin-bottom: 15px;
}

.price-chart {
  width: 100%;
  height: 100%;
}

.chart-legend {
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
}

.legend-item {
  display: flex;
  align-items: center;
  margin: 0 10px;
}

.legend-color {
  width: 16px;
  height: 16px;
  margin-right: 5px;
  border-radius: 3px;
}

.price-warning {
  background-color: #feecdc;
  padding: 10px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.warning-icon {
  margin-right: 10px;
}

.warning-text {
  color: #f05252;
  font-weight: bold;
}

.chart-disclaimer {
  font-size: 12px;
  color: #666;
  line-height: 1.5;
  margin: 0;
}
</style>
