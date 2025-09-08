<template>
  <div class="recipe-filter-sidebar">
    <!-- 特色篩選 -->
    <div class="filter-section">
      <h3 class="filter-title">特色篩選</h3>
      <div class="filter-options">
        <label
          v-for="option in localFilters.features"
          :key="option.id"
          class="filter-option"
        >
          <input
            type="checkbox"
            :checked="option.checked"
            @change="updateFeatureFilter(option.id, $event.target.checked)"
          />
          <span class="option-label">{{ option.label }}</span>
        </label>
      </div>
    </div>

    <!-- 料理時間 -->
    <div class="filter-section">
      <h3 class="filter-title">料理時間</h3>
      <div class="filter-options">
        <label
          v-for="option in localFilters.cookTime"
          :key="option.id"
          class="filter-option"
        >
          <input
            type="checkbox"
            :checked="option.checked"
            @change="updateCookTimeFilter(option.id, $event.target.checked)"
          />
          <span class="option-label">{{ option.label }}</span>
        </label>
      </div>
    </div>

    <!-- 難易度 -->
    <div class="filter-section">
      <h3 class="filter-title">難易度</h3>
      <div class="filter-options">
        <label
          v-for="option in localFilters.difficulty"
          :key="option.id"
          class="filter-option"
        >
          <input
            type="checkbox"
            :checked="option.checked"
            @change="updateDifficultyFilter(option.id, $event.target.checked)"
          />
          <span class="option-label">{{ option.label }}</span>
        </label>
      </div>
    </div>

    <!-- 套用篩選按鈕 -->
    <button class="apply-filter-btn" @click="applyFilters">套用篩選</button>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  filters: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["update-filters"]);

// 本地篩選狀態
const localFilters = ref({
  features: [...props.filters.features],
  cookTime: [...props.filters.cookTime],
  difficulty: [...props.filters.difficulty],
});

// 監聽 props 變化
watch(
  () => props.filters,
  (newFilters) => {
    localFilters.value = {
      features: [...newFilters.features],
      cookTime: [...newFilters.cookTime],
      difficulty: [...newFilters.difficulty],
    };
  },
  { deep: true }
);

// 更新特色篩選
const updateFeatureFilter = (id, checked) => {
  const option = localFilters.value.features.find((f) => f.id === id);
  if (option) {
    option.checked = checked;

    // 如果選擇"全部"，取消其他選項
    if (id === "all" && checked) {
      localFilters.value.features.forEach((f) => {
        if (f.id !== "all") f.checked = false;
      });
    } else if (id !== "all" && checked) {
      // 如果選擇其他選項，取消"全部"
      const allOption = localFilters.value.features.find((f) => f.id === "all");
      if (allOption) allOption.checked = false;
    }
  }
};

// 更新料理時間篩選
const updateCookTimeFilter = (id, checked) => {
  const option = localFilters.value.cookTime.find((c) => c.id === id);
  if (option) {
    option.checked = checked;
  }
};

// 更新難易度篩選
const updateDifficultyFilter = (id, checked) => {
  const option = localFilters.value.difficulty.find((d) => d.id === id);
  if (option) {
    option.checked = checked;
  }
};

// 套用篩選
const applyFilters = () => {
  emit("update-filters", {
    features: [...localFilters.value.features],
    cookTime: [...localFilters.value.cookTime],
    difficulty: [...localFilters.value.difficulty],
  });
};
</script>

<style scoped>
.recipe-filter-sidebar {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 24px;
  width: 100%;
  min-width: 280px;
}

.filter-section {
  margin-bottom: 24px;
}

.filter-section:last-of-type {
  margin-bottom: 20px;
}

.filter-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
  border-bottom: 2px solid #4caf50;
  padding-bottom: 6px;
  white-space: nowrap;
}

.filter-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-option {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 4px 0;
}

.filter-option input[type="checkbox"] {
  margin-right: 8px;
  width: 16px;
  height: 16px;
  accent-color: #4caf50;
}

.option-label {
  font-size: 15px;
  color: #555;
  user-select: none;
  white-space: nowrap;
}

.filter-option:hover .option-label {
  color: #4caf50;
}

.apply-filter-btn {
  width: 100%;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 12px 16px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.apply-filter-btn:hover {
  background-color: #45a049;
}

.apply-filter-btn:active {
  background-color: #3d8b40;
}

/* 響應式調整 */
@media (max-width: 768px) {
  .recipe-filter-sidebar {
    padding: 16px;
  }

  .filter-title {
    font-size: 15px;
  }

  .option-label {
    font-size: 13px;
  }
}
</style>
