<template>
  <div class="category-tags-container">
    <div class="tags-wrapper">
      <button
        v-for="tag in categoryTags"
        :key="tag.id"
        :class="['category-tag', { active: activeCategory === tag.id }]"
        :style="{
          '--tag-color': tag.color,
          backgroundColor:
            activeCategory === tag.id ? tag.color : 'transparent',
          borderColor: tag.color,
          color: activeCategory === tag.id ? 'white' : tag.color,
        }"
        @click="selectCategory(tag.id)"
      >
        {{ tag.label }}
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  categoryTags: {
    type: Array,
    required: true,
  },
  activeCategory: {
    type: String,
    default: "all",
  },
});

const emit = defineEmits(["category-change"]);

const selectCategory = (categoryId) => {
  emit("category-change", categoryId);
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
  border: 2px solid;
  border-radius: 25px;
  background: transparent;
  cursor: pointer;
  font-size: 15px;
  font-weight: 500;
  transition: all 0.3s ease;
  white-space: nowrap;
  user-select: none;
}

.category-tag:hover {
  background-color: var(--tag-color) !important;
  color: white !important;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.category-tag.active {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
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
