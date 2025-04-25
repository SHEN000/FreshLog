<template>
  <Card title="📘 食譜清單列表">
    <ul>
      <li v-for="item in recipeList" :key="item.id">
        {{ item.name }}（{{ item.ingredients.join('、') }}）
      </li>
    </ul>
  </Card>
</template>

<script setup>
import { recipeList } from '@/data/consumerDashboardData.js'
import Card from './Card.vue'
</script>
