<template>
  <Card title="📰 蔬食時事新聞">
    <ul>
      <li v-for="item in vegNews" :key="item.date">
        <a :href="item.link" target="_blank">{{ item.date }} - {{ item.title }}</a>
      </li>
    </ul>
  </Card>
</template>

<script setup>
import { vegNews } from '@/data/consumerDashboardData.js'
import Card from './Card.vue'
</script>
