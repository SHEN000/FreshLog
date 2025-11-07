<template>
  <div class="filter-sidebar">
    <!-- 特色篩選區塊 -->
    <div class="filter-section">
      <h3 class="filter-title">特色篩選</h3>
      <div class="filter-options">
        <label class="checkbox-item">
          <input
            type="checkbox"
            v-model="localFilters.antioxidant"
            @change="emitFilters"
          />
          <span class="checkbox-label">抗氧化</span>
        </label>
        <label class="checkbox-item">
          <input
            type="checkbox"
            v-model="localFilters.supplement"
            @change="emitFilters"
          />
          <span class="checkbox-label">補鈣佳品</span>
        </label>
        <label class="checkbox-item">
          <input
            type="checkbox"
            v-model="localFilters.eyecare"
            @change="emitFilters"
          />
          <span class="checkbox-label">護眼明目</span>
        </label>
        <label class="checkbox-item">
          <input
            type="checkbox"
            v-model="localFilters.energy"
            @change="emitFilters"
          />
          <span class="checkbox-label">運動能量</span>
        </label>
        <label class="checkbox-item">
          <input
            type="checkbox"
            v-model="localFilters.superFood"
            @change="emitFilters"
          />
          <span class="checkbox-label">超級食物</span>
        </label>
      </div>
    </div>

    <!-- 價格區間滑桿 -->
    <div class="filter-section">
      <h3 class="filter-title">價格區間</h3>
      <div class="price-range">
        <div class="price-display">
          NT${{ localPriceRange[0] }} - NT${{ localPriceRange[1] }}
        </div>
        <div class="slider-container">
          <input
            type="range"
            min="0"
            max="200"
            v-model.number="localPriceRange[0]"
            @input="validateAndEmitPriceRange"
            class="slider-input"
          />
          <input
            type="range"
            min="0"
            max="200"
            v-model.number="localPriceRange[1]"
            @input="validateAndEmitPriceRange"
            class="slider-input"
          />
          <div class="slider-track"></div>
          <div class="slider-fill" :style="sliderFillStyle"></div>
        </div>
      </div>
      <button class="apply-btn" @click="emitPriceRange">套用篩選</button>
    </div>

    <!-- 營養需求導航 -->
    <div class="filter-section nutrition-nav">
      <h3 class="filter-title">營養需求導航</h3>
      <div class="nutrition-tabs">
        <div
          v-for="tab in nutritionTabs"
          :key="tab.id"
          class="nutrition-tab"
          :class="{ active: activeNutritionTab === tab.id }"
          @click="handleNutritionTabClick(tab.id)"
        >
          {{ tab.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from "vue";

const props = defineProps({
  filters: {
    type: Object,
    required: true,
  },
  priceRange: {
    type: Array,
    required: true,
  },
  nutritionFilters: {
    type: Object,
    required: true,
  },
  activeNutritionTab: {
    type: String,
    default: "",
  },
});

const emit = defineEmits([
  "update-filters",
  "update-price-range",
  "update-nutrition-filters",
  "update-nutrition-tab",
]);

// 本地狀態
const localFilters = ref({ ...props.filters });
const localPriceRange = ref([...props.priceRange]);
const localNutritionFilters = ref({ ...props.nutritionFilters });

// 營養需求選項卡
const nutritionTabs = [
  { id: "vitaminA", name: "維生素A" },
  { id: "vitaminC", name: "維生素C" },
  { id: "minerals", name: "膳食纖維" },
  { id: "potassium", name: "鉀" },
  { id: "calcium", name: "鈣" },
  { id: "iron", name: "鐵" },
  { id: "antioxidant", name: "抗氧化" },
];

// 使用 computed 來讀取 activeNutritionTab
const activeNutritionTab = computed(() => props.activeNutritionTab);

// 計算滑桿填充樣式（考慮 10px padding）
const sliderFillStyle = computed(() => {
  const min = 0;
  const max = 200;
  const leftPercent = ((localPriceRange.value[0] - min) / (max - min)) * 100;
  const rightPercent = ((max - localPriceRange.value[1]) / (max - min)) * 100;
  return {
    left: `calc(10px + ${leftPercent}% * (100% - 20px) / 100%)`,
    right: `calc(10px + ${rightPercent}% * (100% - 20px) / 100%)`,
  };
});

// 監聽 props 變化，同步更新本地狀態
watch(
  () => props.filters,
  (newFilters) => {
    localFilters.value = { ...newFilters };
  },
  { deep: true }
);

watch(
  () => props.priceRange,
  (newRange) => {
    localPriceRange.value = [...newRange];
  }
);

watch(
  () => props.nutritionFilters,
  (newFilters) => {
    localNutritionFilters.value = { ...newFilters };
  },
  { deep: true }
);

// 處理營養標籤點擊 - 支援取消選取
const handleNutritionTabClick = (tabId) => {
  console.log("點擊營養標籤:", tabId, "當前選中:", activeNutritionTab.value);

  // 如果點擊的是當前已選中的標籤，則清空選取狀態
  if (activeNutritionTab.value === tabId) {
    console.log("清空選取狀態");
    // 清空當前標籤
    emit("update-nutrition-tab", "");

    // 清空所有營養篩選
    const clearedFilters = { ...localNutritionFilters.value };
    Object.keys(clearedFilters).forEach((key) => {
      clearedFilters[key] = false;
    });

    localNutritionFilters.value = clearedFilters;
    emit("update-nutrition-filters", clearedFilters);
    return;
  }

  console.log("設定新的選取狀態:", tabId);

  // 🔧 清空特色篩選（與營養導航互斥）
  const clearedFeatureFilters = {
    antioxidant: false,
    supplement: false,
    eyecare: false,
    energy: false,
    superFood: false,
  };
  localFilters.value = clearedFeatureFilters;
  emit("update-filters", clearedFeatureFilters);
  console.log("✅ 已清空特色篩選");

  // 更新當前標籤
  emit("update-nutrition-tab", tabId);

  // 根據點擊的標籤自動啟用對應的篩選
  const newNutritionFilters = { ...localNutritionFilters.value };

  // 重置所有營養篩選
  Object.keys(newNutritionFilters).forEach((key) => {
    newNutritionFilters[key] = false;
  });

  // 啟用對應的篩選
  switch (tabId) {
    case "vitaminA":
      newNutritionFilters.vitaminA = true;
      break;
    case "vitaminC":
      newNutritionFilters.vitaminC = true;
      break;
    case "minerals":
      newNutritionFilters.calcium = true;
      break;
    case "potassium":
      newNutritionFilters.iron = true;
      break;
    case "calcium":
      newNutritionFilters.calcium = true;
      break;
    case "iron":
      newNutritionFilters.iron = true;
      break;
    case "antioxidant":
      newNutritionFilters.antioxidant = true;
      break;
  }

  localNutritionFilters.value = newNutritionFilters;
  emit("update-nutrition-filters", newNutritionFilters);
};

// 事件發射函數
const emitFilters = () => {
  // 🔧 清空營養導航（與特色篩選互斥）
  // 清空營養標籤選中狀態
  emit("update-nutrition-tab", "");

  // 清空所有營養篩選
  const clearedNutritionFilters = { ...localNutritionFilters.value };
  Object.keys(clearedNutritionFilters).forEach((key) => {
    clearedNutritionFilters[key] = false;
  });
  localNutritionFilters.value = clearedNutritionFilters;
  emit("update-nutrition-filters", clearedNutritionFilters);
  console.log("✅ 已清空營養導航");

  // 發送特色篩選更新
  emit("update-filters", { ...localFilters.value });
};

let priceEmitTimeout = null;
const DEBOUNCE_MS = 400;

const validateAndEmitPriceRange = () => {
  try {
    // 只驗證並更新本地狀態，不 emit 事件
    if (localPriceRange.value[0] > localPriceRange.value[1]) {
      localPriceRange.value[0] = localPriceRange.value[1];
    }
    // 不再自動觸發 API 請求，等待用戶點擊「套用篩選」按鈕
    console.log("價格滑桿拉動:", localPriceRange.value);
  } catch (error) {
    console.error("價格滑桿錯誤:", error);
  }
};

const emitPriceRange = () => {
  // 點擊「套用篩選」按鈕時，立即發送價格區間並觸發 API 請求
  emit("update-price-range", [...localPriceRange.value]);
};

onUnmounted(() => {
  if (priceEmitTimeout) {
    clearTimeout(priceEmitTimeout);
    priceEmitTimeout = null;
  }
});
</script>

<style scoped>
.filter-sidebar {
  width: 100%;
}

.filter-section {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 16px;
  margin-bottom: 20px;
}

.filter-title {
  color: #2e7d32;
  font-size: 18px;
  margin-top: 0;
  margin-bottom: 16px;
  font-weight: 500;
}

.filter-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* 多選框樣式 */
.checkbox-item {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.checkbox-item input[type="checkbox"] {
  margin-right: 8px;
  width: 18px;
  height: 18px;
  accent-color: #2196f3;
}

.checkbox-label {
  font-size: 14px;
}

/* 價格滑桿樣式 */
.price-range {
  margin-bottom: 16px;
}

.price-display {
  text-align: center;
  font-size: 15px;
  font-weight: 500;
  color: #333;
  margin-bottom: 20px;
}

.slider-container {
  position: relative;
  height: 50px;
  padding: 20px 10px 10px 10px;
}

.slider-container input[type="range"] {
  position: absolute;
  width: calc(100% - 20px);
  left: 10px;
  height: 5px;
  background: none;
  pointer-events: none;
  -webkit-appearance: none;
  appearance: none;
  top: 30px;
  z-index: 2;
}

.slider-container input[type="range"]::-webkit-slider-thumb {
  height: 16px;
  width: 16px;
  border-radius: 50%;
  background: #2196f3;
  cursor: pointer;
  pointer-events: auto;
  -webkit-appearance: none;
  margin-top: -5.5px;
  box-shadow: 0 2px 4px rgba(33, 150, 243, 0.3);
  border: none;
}

.slider-container input[type="range"]::-moz-range-thumb {
  height: 16px;
  width: 16px;
  border-radius: 50%;
  background: #2196f3;
  cursor: pointer;
  pointer-events: auto;
  border: none;
  box-shadow: 0 2px 4px rgba(33, 150, 243, 0.3);
  margin-top: -5.5px;
}

.slider-track {
  position: absolute;
  top: 30px;
  left: 10px;
  height: 5px;
  width: calc(100% - 20px);
  background: #e0e0e0;
  border-radius: 3px;
  z-index: 1;
}

.slider-fill {
  position: absolute;
  top: 30px;
  height: 5px;
  background: rgba(33, 150, 243, 0.3);
  border-radius: 3px;
  z-index: 1;
}

.apply-btn {
  width: 100%;
  background-color: #2e7d32;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 0;
  font-size: 16px;
  cursor: pointer;
}

/* 營養需求導航 */
.nutrition-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 12px;
}

.nutrition-tab {
  padding: 8px 16px;
  background: #f8f8f8;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  border: 1px solid #f0f0f0;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 400;
  user-select: none;
  color: #333;
}

.nutrition-tab:hover {
  background: #e8f5e9;
  border-color: #e8f5e9;
}

.nutrition-tab.active {
  background: #2e7d32 !important;
  color: white !important;
  border-color: #2e7d32 !important;
}
</style>
