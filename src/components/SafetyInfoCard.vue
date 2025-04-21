<template>
  <Card title="🔒 食安資訊列表">
    <ul>
      <li v-for="item in foodSafetyItems" :key="item.date">
        {{ item.date }} - {{ item.title }}
      </li>
    </ul>
  </Card>
</template>

<script setup>
import { foodSafetyItems } from '@/data/consumerDashboardData.js'
import Card from './Card.vue'
</script>
