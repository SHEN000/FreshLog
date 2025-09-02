<template>
  <div class="ai-recommendation-section">
    <div class="section-header">
      <span class="ai-icon">🤖</span>
      <h3 class="section-title">AI 智慧推薦</h3>
    </div>

    <p class="section-description">
      根據您的飲食偏好和當季食材，為您智慧推薦最適合的料理，讓每一餐都營養又美味！
    </p>

    <div class="recommendation-grid">
      <div
        v-for="recipe in recommendedRecipes"
        :key="recipe.id"
        class="recommendation-item"
        @click="goToRecipe(recipe.id)"
      >
        <img
          :src="$img(recipe.image)"
          :alt="recipe.name"
          class="recommendation-image"
          @error="handleImageError"
        />
        <div class="recommendation-content">
          <h4 class="recommendation-title">{{ recipe.name }}</h4>
          <p class="recommendation-meta">
            難度: {{ recipe.difficulty }} | {{ recipe.cookTime }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const props = defineProps({
  recommendedRecipes: {
    type: Array,
    default: () => [],
  },
});

const router = useRouter();

const goToRecipe = (recipeId) => {
  router.push(`/ai-recommendation/${recipeId}`);
};

const handleImageError = (event) => {
  event.target.src = "/images/placeholder/recipe-placeholder.jpg";
};
</script>

<style scoped>
.ai-recommendation-section {
  background: linear-gradient(135deg, #e8f5e9 0%, #f1f8e6 100%);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
  border: 1px solid #c8e6c9;
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.ai-icon {
  font-size: 24px;
  margin-right: 8px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #2e7d32;
  margin: 0;
}

.section-description {
  font-size: 14px;
  color: #555;
  line-height: 1.5;
  margin-bottom: 16px;
}

.recommendation-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.recommendation-item {
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.recommendation-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.recommendation-image {
  width: 100%;
  height: 80px;
  object-fit: cover;
}

.recommendation-content {
  padding: 8px;
  flex: 1;
}

.recommendation-title {
  font-size: 13px;
  font-weight: 600;
  color: #333;
  margin: 0 0 4px 0;
  line-height: 1.3;
}

.recommendation-meta {
  font-size: 11px;
  color: #666;
  margin: 0;
  line-height: 1.2;
}

/* 響應式調整 */
@media (max-width: 768px) {
  .ai-recommendation-section {
    padding: 16px;
  }

  .recommendation-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }

  .recommendation-image {
    height: 70px;
  }

  .section-title {
    font-size: 16px;
  }

  .section-description {
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .recommendation-grid {
    grid-template-columns: 1fr;
  }

  .recommendation-item {
    flex-direction: row;
  }

  .recommendation-image {
    width: 80px;
    height: 60px;
    flex-shrink: 0;
  }

  .recommendation-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 8px 12px;
  }
}
</style>
