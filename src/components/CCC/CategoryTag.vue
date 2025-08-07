<template>
  <div class="food-category-section">
    <div class="category-left">食物分類</div>
    <div class="category-center">
      <button
        v-for="category in categories"
        :key="category.id"
        class="category-btn"
        :class="{ active: activeCategory === category.id }"
        @click="$emit('set-category', category.id)"
      >
        {{ category.name }}
      </button>
    </div>
    <!-- 新增排序下拉選單 -->
    <div class="category-right">
      <div class="sort-section" v-if="sortOptions && sortOptions.length > 0">
        <span>產季：</span>
        <select
          :value="currentSort"
          @change="$emit('sort-change', $event.target.value)"
          class="sort-select"
        >
          <option
            v-for="option in sortOptions"
            :key="option.value || option.code"
            :value="option.value || option.code"
          >
            {{ option.label }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  categories: Array,
  activeCategory: String,
  sortOptions: Array, // 新增
  currentSort: String, // 新增
});

defineEmits(["set-category", "sort-change"]); // 新增 sort-change
</script>

<style scoped>
/* 分類選項樣式 */
.food-category-section {
  display: flex;
  padding-bottom: 15px;
  margin-bottom: 25px;
  align-items: center;
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 4px;
}

.category-left {
  font-weight: bold;
  margin-right: 20px;
  padding: 8px 0;
  min-width: 80px;
  color: #555;
}

.category-center {
  display: flex;
  gap: 10px;
  flex: 1;
  overflow-x: auto;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

.category-center::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

.category-btn {
  background: none;
  border: 1px solid #ddd;
  padding: 8px 16px;
  cursor: pointer;
  border-radius: 4px;
  white-space: nowrap;
  transition: all 0.2s ease;
  color: #333;
}

.category-btn:hover {
  background-color: #2e7d32; /* 綠色底色 - Hover 狀態 */
  color: white;
  border-color: #2e7d32;
}

.category-btn.active {
  background-color: #1976d2; /* 藍色底色 - 當前選中 */
  color: white;
  border-color: #1976d2;
}

/* 新增右側排序區域 */
.category-right {
  margin-left: 20px;
}

.sort-section {
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
}

.sort-section span {
  font-size: 14px;
  color: #555;
}

.sort-select {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  outline: none;
  background: white;
  font-size: 14px;
  cursor: pointer;
  min-width: 120px;
}

.sort-select:focus {
  border-color: #1976d2;
}

/* 手機版適配 */
@media (max-width: 768px) {
  .food-category-section {
    flex-wrap: wrap;
  }

  .category-left {
    width: 100%;
    margin-bottom: 10px;
  }

  .category-center {
    width: 100%;
    overflow-x: auto;
    padding-bottom: 8px;
  }

  .category-right {
    width: 100%;
    margin-left: 0;
    margin-top: 10px;
    justify-content: flex-end;
  }
}
</style>
