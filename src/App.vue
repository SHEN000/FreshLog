<template>
  <div id="app">
    <router-view v-if="route.path === '/select-role'" />

    <!-- 其他頁面都包 Layout（含 Header + 內縮 + 留白） -->
    <Layout v-else>
      <router-view />
    </Layout>
  </div>
</template>

<script setup>
import Layout from '@/components/Layout.vue'
import Header from './components/Header.vue'
import { useRouter, useRoute } from 'vue-router'
import { onMounted } from 'vue'

const router = useRouter()
const route = useRoute()

// 進入頁面後檢查是否已有角色設定，否則導向角色選擇頁
onMounted(() => {
  const role = localStorage.getItem('userRole')

  // 如果沒設定角色，且當前頁面不是 /select-role，導向 /select-role
  if (!role && route.path !== '/select-role') {
    router.replace('/select-role')
  }
})
</script>