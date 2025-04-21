<template>
  <div class="select-wrapper">
    <!-- 遮罩層 -->
    <div class="overlay" v-if="isOverlayVisible"></div>

    <!-- 文字與按鈕，位於遮罩層上 -->
    <div class="buttons-container">
      <h2>請選擇你的身分</h2>
      <button @click="selectRole('consumer')">我是消費者</button>
      <button @click="selectRole('farmer')">我是農民</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/store/user' // 使用者狀態管理（Pinia）
import { useRouter } from 'vue-router' // Vue Router 路由導向

const userStore = useUserStore()
const router = useRouter()

const isOverlayVisible = ref(true)  // 控制遮罩顯示

// 使用者選擇角色後執行的邏輯
const selectRole = (role) => {
  userStore.setUserRole(role) // 儲存選擇角色到 Pinia 狀態
  isOverlayVisible.value = false // 選擇後隱藏遮罩
  router.push('/') // 導向至首頁
}
</script>

<style scoped>
/* 外層容器：全螢幕高度 + 垂直置中 */
.select-wrapper {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
}

/* 按鈕與標題容器 */
.buttons-container {
  z-index: 20;  /* 顯示在遮罩之上 */
  position: relative;
  text-align: center; /* 置中文字與按鈕 */
}

/* 按鈕樣式 */
button {
  margin: 10px;
  padding: 12px 24px;
  font-size: 18px;
}

/* 半透明遮罩層 */
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* 半透明遮罩 */
  z-index: 10; /* 確保遮罩層的 z-index 高於 Header */
}

/* 標題樣式 */
h2 {
  font-size: 24px;
  color: white;
  margin-bottom: 20px;
}
</style>
