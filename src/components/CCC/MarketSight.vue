<template>
  <div class="market-insight">
    <div class="insight-header">
      <span class="insight-icon">💡</span>
      <h3>AI 市場洞察</h3>
    </div>
    <p class="insight-content">
      {{ insightText }}
    </p>
  </div>
</template>

<script setup>
import { ref } from "vue";

// 可以透過 props 傳入洞察內容，或從資料來源取得
const props = defineProps({
  insightText: {
    type: String,
    default:
      "根據最近市場趨勢，紅蘿蔔價格已連續三週下降，預計未來一週將回穩。建議現在是採購紅蘿蔔的好時機。",
  },
});
</script>

<style scoped>
/* AI 市場洞察區塊 */
.market-insight {
  background-color: #f1f8e9;
  border-left: 4px solid #2e7d32;
  padding: 16px;
  margin-bottom: 24px;
  border-radius: 0 4px 4px 0;
}

.insight-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.insight-icon {
  font-size: 20px;
  margin-right: 8px;
}

.insight-header h3 {
  margin: 0;
  font-size: 16px;
  color: #2e7d32;
}

.insight-content {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  color: #444;
}
</style>
