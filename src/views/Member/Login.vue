<template>
  <div class="auth-container">
    <h2>登入</h2>

    <!-- 登入表單 -->
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="email">電子郵件</label>
        <input type="email" id="email" v-model="email" placeholder="請輸入電子郵件" />
      </div>
      <div class="form-group">
        <label for="password">密碼</label>
        <input type="password" id="password" v-model="password" placeholder="請輸入密碼" />
      </div>
      <div class="form-group">
        <button type="submit" class="submit-btn">登入</button>
      </div>
      <div class="form-group">
        <p>還沒有帳戶？<RouterLink to="/member/register">註冊</RouterLink></p>
      </div>
    </form>

    <!-- 錯誤訊息顯示 -->
    <div v-if="errorMessage" class="error-message">
      <p>{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user' // 使用 Pinia 管理登入狀態與角色

const userStore = useUserStore()

// 表單輸入值（email 與 password）
const email = ref('')
const password = ref('')

// 錯誤訊息（目前尚未實作驗證，只是預留）
const errorMessage = ref('')

// 建立 router 實例以便導頁
const router = useRouter()

// 登入邏輯
function handleLogin() {
  // 假登入流程

  // 存入模擬 Token 至 localStorage
  localStorage.setItem('userToken', 'sample-token');
  
   // 儲存使用者角色（若尚未選擇，預設為 consumer）
  const selectedRole = localStorage.getItem('userRole') || 'consumer';
  userStore.setUserRole(selectedRole);  
  
  // 更新 Pinia 狀態為已登入
  userStore.setIsAuthenticated(true);

  // 導頁：若之前有記錄欲導向頁面就前往，否則依角色跳首頁
  const redirectPath = localStorage.getItem('redirectAfterLogin');
  if (redirectPath) {
    localStorage.removeItem('redirectAfterLogin');
    router.push(redirectPath);
  } else {
    if (selectedRole === 'farmer') {
      router.push('/farmer/crop-dashboard'); // 導向農民首頁
    } else {
      router.push('/veggie'); // 導向消費者首頁
    }
  }
}
</script>


<style scoped>
/* 登入表單容器樣式（置中 + 白底卡片風格） */
.auth-container {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
}

/* 表單欄位間距 */
.form-group {
  margin-bottom: 15px;
}

/* 輸入框樣式 */
input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

/* 提交按鈕樣式 */
.submit-btn {
  width: 100%;
  padding: 10px;
  background-color: #59c2b9;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.submit-btn:hover {
  background-color: #59c2b9;
}

/* 錯誤訊息樣式 */
.error-message {
  color: red;
  text-align: center;
}
</style>
