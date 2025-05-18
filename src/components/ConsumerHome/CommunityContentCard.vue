<template>
  <Card title="👥 社群共創內容">
    <ul>
      <li v-for="post in communityPosts" :key="post.id">
        <strong>{{ post.author }}</strong>：{{ post.message }}
      </li>
    </ul>
  </Card>
</template>

<script setup>
import { communityPosts } from '@/data/consumerDashboardData.js'
import Card from './Card.vue'
</script>
