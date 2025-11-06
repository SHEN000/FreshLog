<template>
  <div class="category-tags-container">
    <div class="tags-wrapper">
      <!-- 固定的分類按鈕 -->
      <button
        v-for="tag in categoryTags"
        :key="tag.id"
        :class="['category-tag', { active: activeCategory === tag.id }]"
        @click="selectCategory(tag.id)"
      >
        {{ tag.label }}
      </button>

      <!-- 自選按鈕（帶下拉選單） -->
      <div
        class="custom-dropdown"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
      >
        <button
          :class="['category-tag', 'custom-tag', { active: isCustomCategoryActive }]"
        >
          自選 ▼
        </button>

        <!-- 下拉選單 -->
        <div v-if="showDropdown && filteredCategoryOptions.length > 0" class="dropdown-menu">
          <button
            v-for="(category, index) in filteredCategoryOptions"
            :key="index"
            class="dropdown-item"
            @click="selectCustomCategory(category)"
          >
            {{ category }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  categoryTags: {
    type: Array,
    required: true,
  },
  activeCategory: {
    type: String,
    default: "all",
  },
  categoryOptions: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["category-change"]);

const showDropdown = ref(false);
let hideTimeout = null; // 用於延遲隱藏的計時器

// 判斷是否選中了自選分類
const isCustomCategoryActive = computed(() => {
  return props.activeCategory.startsWith("custom:");
});

// 過濾掉已經在預設按鈕中的分類選項
const filteredCategoryOptions = computed(() => {
  // 取得所有預設分類的中文名稱
  const defaultCategoryLabels = props.categoryTags.map(tag => tag.label);

  // 過濾掉已經存在於預設分類中的選項
  return props.categoryOptions.filter(category => {
    return !defaultCategoryLabels.includes(category);
  });
});

// 鼠標移入時顯示選單
const handleMouseEnter = () => {
  // 清除可能存在的隱藏計時器
  if (hideTimeout) {
    clearTimeout(hideTimeout);
    hideTimeout = null;
  }
  showDropdown.value = true;
};

// 鼠標移出時延遲隱藏選單
const handleMouseLeave = () => {
  // 設定延遲 200ms 後隱藏
  hideTimeout = setTimeout(() => {
    showDropdown.value = false;
  }, 200);
};

const selectCategory = (categoryId) => {
  emit("category-change", categoryId);
};

const selectCustomCategory = (categoryName) => {
  // 將分類名稱轉換為 ID（直接使用分類名稱）
  emit("category-change", `custom:${categoryName}`);
  showDropdown.value = false;

  // 清除計時器
  if (hideTimeout) {
    clearTimeout(hideTimeout);
    hideTimeout = null;
  }
};
</script>

<style scoped>
.category-tags-container {
  margin-bottom: 24px;
}

.tags-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

.category-tag {
  padding: 10px 18px;
  border: 2px solid #2e7d32;
  border-radius: 25px;
  background: transparent;
  color: #2e7d32;
  cursor: pointer;
  font-size: 15px;
  font-weight: 500;
  transition: all 0.3s ease;
  white-space: nowrap;
  user-select: none;
}

.category-tag:hover {
  background-color: #1976d2 !important;
  border-color: #1976d2 !important;
  color: white !important;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.category-tag.active {
  background-color: #1976d2;
  border-color: #1976d2;
  color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

/* 自選按鈕下拉選單 */
.custom-dropdown {
  position: relative;
  display: inline-block;
}

.custom-tag {
  /* 繼承 category-tag 的樣式 */
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 4px); /* 按鈕下方4px */
  left: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 150px;
  max-height: 300px;
  overflow-y: auto;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
}

/* 用偽元素創建按鈕和選單之間的不可見橋接區域 */
.dropdown-menu::before {
  content: "";
  position: absolute;
  top: -8px; /* 向上延伸8px，覆蓋按鈕和選單之間的間隙 */
  left: 0;
  right: 0;
  height: 8px;
  background: transparent;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dropdown-item {
  display: block;
  width: 100%;
  padding: 10px 16px;
  text-align: left;
  background: transparent;
  border: none;
  color: #333;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.dropdown-item:hover {
  background-color: #1976d2;
  color: white;
}

.dropdown-item:first-child {
  border-radius: 8px 8px 0 0;
}

.dropdown-item:last-child {
  border-radius: 0 0 8px 8px;
}

/* 響應式調整 */
@media (max-width: 768px) {
  .tags-wrapper {
    gap: 6px;
  }

  .category-tag {
    padding: 6px 12px;
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .tags-wrapper {
    justify-content: center;
  }

  .category-tag {
    padding: 6px 10px;
    font-size: 12px;
  }
}
</style>
