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
        <div class="price-labels">
          <span>NT${{ localPriceRange[0] }}</span>
          <span>NT${{ localPriceRange[1] }}</span>
        </div>
        <div class="slider-container">
          <input
            type="range"
            min="0"
            max="200"
            v-model.number="localPriceRange[0]"
            @input="validateAndEmitPriceRange"
          />
          <input
            type="range"
            min="0"
            max="200"
            v-model.number="localPriceRange[1]"
            @input="validateAndEmitPriceRange"
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
          @click="$emit('update-nutrition-tab', tab.id)"
        >
          {{ tab.name }}
        </div>
      </div>
      <div class="nutrition-content">
        <div v-if="activeNutritionTab === 'vitaminA'" class="nutrition-items">
          <div class="nutrition-item">
            <label class="checkbox-item">
              <input
                type="checkbox"
                v-model="localNutritionFilters.vitaminA"
                @change="emitNutritionFilters"
              />
              <span class="checkbox-label">維生素A</span>
            </label>
          </div>
        </div>
        <div v-if="activeNutritionTab === 'vitaminC'" class="nutrition-items">
          <div class="nutrition-item">
            <label class="checkbox-item">
              <input
                type="checkbox"
                v-model="localNutritionFilters.vitaminC"
                @change="emitNutritionFilters"
              />
              <span class="checkbox-label">維生素C</span>
            </label>
          </div>
        </div>
        <div v-if="activeNutritionTab === 'minerals'" class="nutrition-items">
          <div class="nutrition-item">
            <label class="checkbox-item">
              <input
                type="checkbox"
                v-model="localNutritionFilters.calcium"
                @change="emitNutritionFilters"
              />
              <span class="checkbox-label">鈣</span>
            </label>
          </div>
          <div class="nutrition-item">
            <label class="checkbox-item">
              <input
                type="checkbox"
                v-model="localNutritionFilters.iron"
                @change="emitNutritionFilters"
              />
              <span class="checkbox-label">鐵</span>
            </label>
          </div>
        </div>
        <div v-if="activeNutritionTab === 'others'" class="nutrition-items">
          <div class="nutrition-item">
            <label class="checkbox-item">
              <input
                type="checkbox"
                v-model="localNutritionFilters.antioxidant"
                @change="emitNutritionFilters"
              />
              <span class="checkbox-label">抗氧化</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";

const props = defineProps({
  filters: Object,
  priceRange: Array,
  nutritionFilters: Object,
  activeNutritionTab: String,
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
  { id: "minerals", name: "礦食維他" },
  { id: "others", name: "鉀" },
];

// 計算滑桿填充樣式
const sliderFillStyle = computed(() => {
  const min = 0;
  const max = 200;
  const left = ((localPriceRange.value[0] - min) / (max - min)) * 100;
  const right = ((max - localPriceRange.value[1]) / (max - min)) * 100;
  return {
    left: left + "%",
    right: right + "%",
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

// 事件發射函數
const emitFilters = () => {
  emit("update-filters", { ...localFilters.value });
};

const validateAndEmitPriceRange = () => {
  if (localPriceRange.value[0] > localPriceRange.value[1]) {
    localPriceRange.value[0] = localPriceRange.value[1];
  }
};

const emitPriceRange = () => {
  emit("update-price-range", [...localPriceRange.value]);
};

const emitNutritionFilters = () => {
  emit("update-nutrition-filters", { ...localNutritionFilters.value });
};
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

.price-labels {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
}

.slider-container {
  position: relative;
  height: 40px;
}

.slider-container input[type="range"] {
  position: absolute;
  width: 100%;
  height: 5px;
  background: none;
  pointer-events: none;
  -webkit-appearance: none;
  appearance: none;
}

.slider-container input[type="range"]::-webkit-slider-thumb {
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #2196f3;
  cursor: pointer;
  pointer-events: auto;
  -webkit-appearance: none;
  margin-top: -8px;
}

.slider-track {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  height: 4px;
  width: 100%;
  background: #ddd;
  border-radius: 4px;
}

.slider-fill {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  height: 4px;
  background: #2196f3;
  border-radius: 4px;
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
  gap: 8px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.nutrition-tab {
  padding: 8px 16px;
  background: #f5f5f5;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

.nutrition-tab.active {
  background: #2196f3;
  color: white;
}

.nutrition-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
