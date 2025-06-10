<template>
  <div class="pagination">
    <button
      class="pagination-btn prev"
      :disabled="currentPage === 1"
      @click="$emit('prev-page')"
    >
      上一頁
    </button>
    <div class="page-numbers">
      <button
        v-for="page in totalPages"
        :key="page"
        class="page-number"
        :class="{ active: currentPage === page }"
        @click="$emit('go-to-page', page)"
      >
        {{ page }}
      </button>
    </div>
    <button
      class="pagination-btn next"
      :disabled="currentPage === totalPages"
      @click="$emit('next-page')"
    >
      下一頁
    </button>
  </div>
</template>

<script setup>
defineProps({
  currentPage: Number,
  totalPages: Number,
});

defineEmits(["prev-page", "next-page", "go-to-page"]);
</script>

<style scoped>
/* 分頁控制 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 30px 0;
}

.pagination-btn {
  padding: 8px 16px;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  color: #333;
  cursor: pointer;
  border-radius: 4px;
}

.pagination-btn:disabled {
  color: #ccc;
  cursor: not-allowed;
}

.pagination-btn.prev {
  margin-right: 10px;
}

.pagination-btn.next {
  margin-left: 10px;
}

.page-numbers {
  display: flex;
  gap: 5px;
}

.page-number {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: none;
  cursor: pointer;
}

.page-number.active {
  background-color: #1976d2;
  color: white;
  border-color: #1976d2;
}

/* 手機版適配 */
@media (max-width: 768px) {
  .pagination {
    flex-wrap: wrap;
    gap: 10px;
  }
}
</style>
