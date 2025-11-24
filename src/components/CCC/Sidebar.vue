<template>
  <div class="filter-sidebar">
    <!-- 特色篩選區塊 -->
    <div class="filter-section">
      <h3 class="filter-title">特色篩選</h3>

      <!-- 常用篩選選項（直接顯示前5個）-->
      <div class="filter-options">
        <label class="checkbox-item">
          <input
            type="checkbox"
            v-model="localFilters.nutritious"
            @change="emitFilters"
          />
          <span class="checkbox-label">營養</span>
        </label>
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
            v-model="localFilters.eyecare"
            @change="emitFilters"
          />
          <span class="checkbox-label">護眼</span>
        </label>
        <label class="checkbox-item">
          <input
            type="checkbox"
            v-model="localFilters.vitaminC"
            @change="emitFilters"
          />
          <span class="checkbox-label">維生素C</span>
        </label>
        <label class="checkbox-item">
          <input
            type="checkbox"
            v-model="localFilters.healthy"
            @change="emitFilters"
          />
          <span class="checkbox-label">健康</span>
        </label>
      </div>

      <!-- 更多篩選選項（下拉選單）-->
      <div class="more-filters">
        <button
          class="more-filters-toggle"
          @click="toggleMoreFilters"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <span>更多篩選</span>
          <svg
            class="toggle-icon"
            :class="{ 'open': showMoreFilters }"
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M3 5l3 3 3-3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>

        <!-- 展開的篩選選項 -->
        <div class="more-filters-panel" :class="{ 'show': showMoreFilters }">
          <div class="filter-options">
            <label class="checkbox-item">
              <input
                type="checkbox"
                v-model="localFilters.heatClearing"
                @change="emitFilters"
              />
              <span class="checkbox-label">清熱</span>
            </label>
            <label class="checkbox-item">
              <input
                type="checkbox"
                v-model="localFilters.sweet"
                @change="emitFilters"
              />
              <span class="checkbox-label">香甜</span>
            </label>
            <label class="checkbox-item">
              <input
                type="checkbox"
                v-model="localFilters.highProtein"
                @change="emitFilters"
              />
              <span class="checkbox-label">高蛋白</span>
            </label>
            <label class="checkbox-item">
              <input
                type="checkbox"
                v-model="localFilters.aromatic"
                @change="emitFilters"
              />
              <span class="checkbox-label">香氣</span>
            </label>
            <label class="checkbox-item">
              <input
                type="checkbox"
                v-model="localFilters.lowCalorie"
                @change="emitFilters"
              />
              <span class="checkbox-label">低熱量</span>
            </label>
            <label class="checkbox-item">
              <input
                type="checkbox"
                v-model="localFilters.coolingSummer"
                @change="emitFilters"
              />
              <span class="checkbox-label">消暑</span>
            </label>
            <label class="checkbox-item">
              <input
                type="checkbox"
                v-model="localFilters.calcium"
                @change="emitFilters"
              />
              <span class="checkbox-label">補鈣</span>
            </label>
            <label class="checkbox-item">
              <input
                type="checkbox"
                v-model="localFilters.highFiber"
                @change="emitFilters"
              />
              <span class="checkbox-label">高纖維</span>
            </label>
            <label class="checkbox-item">
              <input
                type="checkbox"
                v-model="localFilters.thirstQuenching"
                @change="emitFilters"
              />
              <span class="checkbox-label">解渴</span>
            </label>
            <label class="checkbox-item">
              <input
                type="checkbox"
                v-model="localFilters.beauty"
                @change="emitFilters"
              />
              <span class="checkbox-label">美容</span>
            </label>
            <label class="checkbox-item">
              <input
                type="checkbox"
                v-model="localFilters.summer"
                @change="emitFilters"
              />
              <span class="checkbox-label">夏季</span>
            </label>
            <label class="checkbox-item">
              <input
                type="checkbox"
                v-model="localFilters.allSeason"
                @change="emitFilters"
              />
              <span class="checkbox-label">四季</span>
            </label>
          </div>
        </div>
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
});

const emit = defineEmits([
  "update-filters",
  "update-price-range",
]);

// 本地狀態
const localFilters = ref({ ...props.filters });
const localPriceRange = ref(
  Array.isArray(props.priceRange) && props.priceRange.length >= 2
    ? [...props.priceRange]
    : [0, 200]
);

// 更多篩選選項的展開狀態
const showMoreFilters = ref(false);

// 切換更多篩選選項
const toggleMoreFilters = () => {
  showMoreFilters.value = !showMoreFilters.value;
};

// 計算滑桿填充樣式（考慮 10px padding）
const sliderFillStyle = computed(() => {
  const min = 0;
  const max = 200;

  // 安全檢查：確保 localPriceRange 是有效的陣列且包含數字
  if (!localPriceRange.value || localPriceRange.value.length < 2) {
    return {
      left: '10px',
      right: '10px',
    };
  }

  const left = Number(localPriceRange.value[0]) || 0;
  const right = Number(localPriceRange.value[1]) || 200;

  const leftPercent = ((left - min) / (max - min)) * 100;
  const rightPercent = ((max - right) / (max - min)) * 100;

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
    if (Array.isArray(newRange) && newRange.length >= 2) {
      localPriceRange.value = [...newRange];
    }
  }
);

// 事件發射函數
const emitFilters = () => {
  emit("update-filters", { ...localFilters.value });
};

let priceEmitTimeout = null;
const DEBOUNCE_MS = 400;

const validateAndEmitPriceRange = () => {
  try {
    // 安全檢查
    if (!localPriceRange.value || localPriceRange.value.length < 2) {
      localPriceRange.value = [0, 200];
      return;
    }

    // 確保數值是有效的數字
    const left = Number(localPriceRange.value[0]);
    const right = Number(localPriceRange.value[1]);

    if (isNaN(left) || isNaN(right)) {
      localPriceRange.value = [0, 200];
      return;
    }

    // 只驗證並更新本地狀態，不 emit 事件
    if (left > right) {
      localPriceRange.value[0] = right;
    }

    // 不再自動觸發 API 請求，等待用戶點擊「套用篩選」按鈕
    console.log("價格滑桿拉動:", localPriceRange.value);
  } catch (error) {
    console.error("價格滑桿錯誤:", error);
    localPriceRange.value = [0, 200];
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

.apply-btn:hover {
  background-color: #1b5e20;
}

.apply-btn:active {
  background-color: #145a1a;
}

/* 更多篩選選項 */
.more-filters {
  margin-top: 16px;
}

.more-filters-toggle {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 16px;
  background-color: #fff;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  cursor: pointer;
  transition: all 0.3s ease;
}

.more-filters-toggle:hover {
  background-color: #f5f5f5;
  border-color: #2e7d32;
}

.more-filters-toggle:active {
  background-color: #e8f5e9;
}

/* 切換圖標動畫 */
.more-filters-toggle .toggle-icon {
  transition: transform 0.3s ease;
}

.more-filters-toggle .toggle-icon.open {
  transform: rotate(180deg);
}

/* 篩選面板 */
.more-filters-panel {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.4s ease-out;
  background-color: #f8f9fa;
  border-radius: 8px;
  margin-top: 10px;
}

.more-filters-panel.show {
  max-height: 1000px;
  transition: max-height 0.5s ease-in;
  padding: 12px;
}

.more-filters-panel .filter-options {
  gap: 10px;
}

/* 手機版樣式調整 */
@media (max-width: 768px) {
  .filter-sidebar {
    padding: 0;
    box-shadow: none;
    background-color: transparent;
  }

  .filter-section {
    margin-bottom: 20px;
  }

  .filter-title {
    font-size: 16px;
    margin-bottom: 12px;
  }

  .checkbox-label {
    font-size: 14px;
  }

  .apply-btn {
    padding: 14px 0;
    font-size: 16px;
  }

  .more-filters-toggle {
    padding: 12px 16px;
    font-size: 15px;
  }
}
</style>
