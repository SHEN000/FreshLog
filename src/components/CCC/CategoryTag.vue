<template>
  <div class="food-category-section">
    <div class="category-left">食物分類</div>
    <div class="category-center">
      <!-- 🔧 包裝「其他」按鈕和下拉選單在同一個容器 -->
      <div
        v-for="category in categories"
        :key="category.id"
        :class="{'other-container': category.id === 'other'}"
        @mouseenter="category.id === 'other' ? handleMouseEnter() : null"
        @mouseleave="category.id === 'other' ? handleMouseLeave() : null"
      >
        <button
          type="button"
          class="category-btn"
          :class="{ active: activeCategory === category.id, 'other-btn': category.id === 'other' }"
          @click="handleCategoryClick(category)"
        >
          {{ category.name }}
          <span v-if="category.id === 'other'" class="dropdown-arrow">▼</span>
        </button>

        <!-- 🆕 其他分類下拉選單 - 放在同一個容器內 -->
        <div
          v-if="category.id === 'other'"
          v-show="showOtherDropdown"
          class="other-dropdown"
        >
        <template v-if="otherCategories && otherCategories.length > 0">
          <button
            type="button"
            v-for="subCat in otherCategories"
            :key="subCat"
            class="other-dropdown-item"
            @click="handleOtherCategoryClick(subCat)"
          >
            {{ subCat }}
          </button>
        </template>
        <template v-else>
          <div style="padding: 20px; text-align: center; color: #999;">
            載入中... (若長時間沒資料，請檢查 Console)
          </div>
        </template>
        </div>
      </div>
    </div>
    <!-- 新增排序下拉選單 -->
    <div class="category-right">
      <div class="sort-section">
        <span class="sort-label">排序：</span>
        <div class="sort-dropdown-wrapper" v-if="sortOptions && sortOptions.length > 0">
          <select
            :value="currentSort"
            @change="$emit('sort-change', $event.target.value)"
            class="sort-select"
          >
            <!-- 🔧 確保有選項時才顯示 -->
            <option
              v-for="option in sortOptions"
              :key="option.value || option.code"
              :value="option.value || option.code"
            >
              {{ option.label }}
            </option>
          </select>
          <span class="current-sort-text">{{ currentSortLabel }}</span>
        </div>
        <span v-else class="current-sort-text">{{ currentSortLabel }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';

const props = defineProps({
  categories: Array,
  activeCategory: String,
  sortOptions: Array,
  currentSort: String,
  otherCategories: Array, // 🆕 其他分類列表
});

const emit = defineEmits(["set-category", "sort-change", "set-subcategory"]);

const showOtherDropdown = ref(false);
let hideTimeout = null;

// 🔧 監控 otherCategories 變化
watch(() => props.otherCategories, (newVal) => {
  console.log('📂 CategoryTag 收到 otherCategories:', newVal?.length, '個');
}, { immediate: true });

// 🔧 計算當前選中的排序選項文字
const currentSortLabel = computed(() => {
  if (!props.sortOptions || props.sortOptions.length === 0) {
    return '產季由近到遠'; // 預設文字
  }
  const currentOption = props.sortOptions.find(
    option => (option.value || option.code) === props.currentSort
  );
  return currentOption?.label || '產季由近到遠';
});

const handleCategoryClick = (category) => {
  if (category.id === 'other') {
    // 點擊「其他」也可以切換顯示
    showOtherDropdown.value = !showOtherDropdown.value;
    console.log('🔧 點擊「其他」按鈕，showOtherDropdown:', showOtherDropdown.value, 'category:', category);
  } else {
    showOtherDropdown.value = false;
    console.log('🔧 emit set-category', category.id);
    emit('set-category', category.id);
  }
};

const handleMouseEnter = () => {
  if (hideTimeout) clearTimeout(hideTimeout);
  showOtherDropdown.value = true;
  console.log('🔧 滑鼠移入「其他」，showOtherDropdown:', showOtherDropdown.value);
};

const handleMouseLeave = () => {
  // 延遲隱藏
  hideTimeout = setTimeout(() => {
    showOtherDropdown.value = false;
    console.log('🔧 隱藏選單');
  }, 200);
};

const handleOtherCategoryClick = (subCategory) => {
  if (hideTimeout) clearTimeout(hideTimeout);
  showOtherDropdown.value = false;
  console.log('🔧 emit set-subcategory', subCategory);
  emit('set-subcategory', subCategory);
};
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
  overflow-x: visible; /* 🔧 改為 visible，確保下拉選單不被裁切 */
  overflow-y: visible; /* 🔧 改為 visible */
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  position: relative; /* 🔧 加入 relative 定位 */
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

/* 🔧 其他按鈕的容器 */
.other-container {
  position: relative;
  display: flex;
  flex-direction: column;
}

.category-btn.other-btn {
  position: relative;
}

.dropdown-arrow {
  margin-left: 4px;
  font-size: 10px;
}

/* 🆕 其他分類下拉選單樣式 */
.other-dropdown {
  position: absolute;
  top: calc(100% + 5px);
  left: 0;
  background: white;
  border: 2px solid #4caf50;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  max-height: 500px;
  overflow-y: auto;
  z-index: 99999;
  /* 🔧 RWD 寬度設計：根據螢幕大小自動調整 */
  min-width: 400px;
  max-width: 600px;
  width: max-content;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); /* 🔧 自動調整列數 */
  gap: 10px;
  padding: 20px;
}

/* 🔧 平板尺寸 */
@media (max-width: 1024px) {
  .other-dropdown {
    min-width: 350px;
    max-width: 500px;
    grid-template-columns: repeat(3, 1fr); /* 3 列 */
  }
}

/* 🔧 手機尺寸 */
@media (max-width: 768px) {
  .other-dropdown {
    min-width: 280px;
    max-width: 90vw; /* 使用視窗寬度的 90% */
    grid-template-columns: repeat(2, 1fr); /* 2 列 */
    left: 50%;
    transform: translateX(-50%); /* 置中對齊 */
  }
}

@media (max-width: 480px) {
  .other-dropdown {
    min-width: 250px;
    max-width: 95vw;
    grid-template-columns: 1fr; /* 1 列 */
  }
}

.other-dropdown-item {
  background: white;
  border: 1px solid #e0e0e0;
  padding: 10px 14px;
  text-align: center; /* 🔧 置中對齊 */
  cursor: pointer;
  border-radius: 6px;
  font-size: 14px;
  color: #333;
  white-space: nowrap;
  transition: all 0.2s ease;
  overflow: hidden;
  text-overflow: ellipsis;
}

.other-dropdown-item:hover {
  background-color: #e8f5e9;
  border-color: #2e7d32;
  color: #2e7d32;
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(46, 125, 50, 0.2);
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

.sort-label {
  font-size: 14px;
  color: #555;
  font-weight: 500;
}

/* 🔧 下拉選單包裝器 */
.sort-dropdown-wrapper {
  position: relative;
  display: inline-block;
}

/* 🔧 當前選中的文字顯示 */
.current-sort-text {
  display: inline-block;
  padding: 8px 32px 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  font-size: 14px;
  color: #333;
  min-width: 150px;
  cursor: pointer;
  position: relative;
  white-space: nowrap;
  pointer-events: auto; /* 允許事件，以便透明 select 能捕獲點擊 */
}

/* 🔧 箭頭圖示 */
.current-sort-text::after {
  content: '▼';
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 10px;
  color: #666;
}

/* 🔧 select 覆蓋在文字上方，設為透明 */
.sort-select {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  z-index: 10;
}

/* 🔧 hover 效果 */
.sort-dropdown-wrapper:hover .current-sort-text {
  border-color: #1976d2;
  background-color: #f5f5f5;
}

/* 🔧 focus 效果（當下拉選單打開時）*/
.sort-dropdown-wrapper:has(.sort-select:focus) .current-sort-text {
  border-color: #1976d2;
  box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.1);
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
