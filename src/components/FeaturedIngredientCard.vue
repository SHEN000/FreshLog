<template>
  <Card title="🍅 本日/本週精選食材">
    <ul>
      <li v-for="item in featuredIngredients" :key="item.name">
        {{ item.name }} <span>（{{ item.tag }}）</span>
      </li>
    </ul>
  </Card>
</template>

<script setup>
import { featuredIngredients } from '@/data/consumerDashboardData.js'
import Card from './Card.vue'
</script>
