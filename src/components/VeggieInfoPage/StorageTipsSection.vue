<template>
  <div class="storage-tips-section">
    <h2>保存小秘訣技巧</h2>

    <div class="tips-cards">
      <div class="tip-card">
        <div class="tip-icon">🌱</div>
        <h3>保存方法</h3>
        <p>
          紅蘿蔔最適合冷藏保存，理想的室溫為4-8度，建議切除綠色頂部，避免水分流失，套上塑膠袋放入冰箱可延長一週以上的保存期。
        </p>
      </div>

      <div class="tip-card">
        <div class="tip-icon">🌿</div>
        <h3>清洗技巧</h3>
        <p>
          清洗紅蘿蔔時應先用冷水沖洗去除多餘泥土，可以用刷子輕刷表面，但不要用洗潔劑，避免化學物質滲入蔬菜表皮，影響健康。
        </p>
      </div>

      <div class="tip-card">
        <div class="tip-icon">🥡</div>
        <h3>減少浪費</h3>
        <p>
          紅蘿蔔皮和頂部可製作成高湯，建議收集起來放冷凍，用於調味料，提高使用效率和營養價值。
        </p>
      </div>

      <div class="tip-card">
        <div class="tip-icon">📅</div>
        <h3>最佳食用期限</h3>
        <p>
          新鮮的蘿蔔最好在購買後7-10天內食用完畢，冷凍切片可保存約3個月，保存過久會失去營養價值和新鮮度。
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
// 可以添加更多保存小技巧的資料
</script>

<style scoped>
.storage-tips-section {
  background-color: #fff;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.storage-tips-section h2 {
  margin-top: 0;
  font-size: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

.tips-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.tip-card {
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  border-left: 4px solid #4caf50;
}

.tip-icon {
  font-size: 24px;
  margin-bottom: 10px;
}

.tip-card h3 {
  margin: 0 0 10px 0;
  font-size: 16px;
  color: #333;
}

.tip-card p {
  margin: 0;
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .tips-cards {
    grid-template-columns: 1fr;
  }
}
</style>
