<template>
  <div class="member-container">
    <h2>會員中心</h2>

    <!-- 尚未登入時的顯示區塊 -->
    <div v-if="!isLoggedIn" class="not-logged-in">
      <p>您尚未登入，請先登入以查看您的會員資料。</p>
      <RouterLink to="/member/login" class="btn-login">登入</RouterLink>
    </div>

    <!-- 登入後的顯示區塊 -->
    <div v-else class="logged-in">
      <h3>歡迎回來，{{ username }}！</h3>
      <p>您目前的角色是：{{ userRole }}</p>
      <button @click="handleLogout" class="btn-logout">登出</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

// 判斷是否登入（根據 localStorage 中是否有 userToken）
const isLoggedIn = computed(() => !!localStorage.getItem('userToken'))

// 從 localStorage 讀取使用者資料（角色與名稱）
const userRole = computed(() => localStorage.getItem('userRole') || '未設定')
const username = computed(() => localStorage.getItem('username') || '使用者')

// 登出功能
function handleLogout() {
  localStorage.removeItem('userToken') // 清除登入狀態
  localStorage.removeItem('username')
  window.location.reload()  // 重新加載頁面，更新狀態
}
</script>

<style scoped>
/* 外層容器：卡片樣式 */
.member-container {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

h2 {
  margin-bottom: 20px;
}

/* 狀態區塊 */
.not-logged-in,
.logged-in {
  margin-top: 20px;
}

/* 提示文字顏色 */
.not-logged-in p {
  color: #777;
}

/* 登入 / 登出 按鈕共用樣式 */
.btn-login,
.btn-logout {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.btn-login:hover,
.btn-logout:hover {
  background-color: #0056b3;
}

.logged-in h3 {
  color: #333;
}
</style>
