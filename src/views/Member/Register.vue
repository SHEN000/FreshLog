<template>
  <div class="auth-container">
    <h2>註冊</h2>

    <!-- 註冊表單 -->
    <form @submit.prevent="handleRegister">
      <div class="form-group">
        <label for="email">電子郵件</label>
        <input type="email" id="email" v-model="email" required placeholder="請輸入電子郵件" />
      </div>

      <div class="form-group">
        <label for="password">密碼</label>
        <input type="password" id="password" v-model="password" required placeholder="請輸入密碼" />
      </div>

      <div class="form-group">
        <label for="confirmPassword">確認密碼</label>
        <input type="password" id="confirmPassword" v-model="confirmPassword" required placeholder="請再次輸入密碼" />
      </div>

      <div class="form-group">
        <button type="submit" class="submit-btn">註冊</button>
      </div>

      <div class="form-group">
        <p>已經有帳戶了？<RouterLink to="/member/login">登入</RouterLink>
        </p>
      </div>
    </form>

    <!-- 錯誤訊息顯示區塊 -->
    <div v-if="errorMessage" class="error-message">
      <p>{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'

const userStore = useUserStore()

// 表單欄位與錯誤訊息
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const errorMessage = ref('')

// 使用路由
const router = useRouter()

// 註冊邏輯處理
function handleRegister() {
  // 驗證密碼與確認密碼是否一致
  if (password.value !== confirmPassword.value) {
    errorMessage.value = '密碼與確認密碼不一致'
    return
  }

  // 假設註冊成功
  localStorage.setItem('userToken', 'sample-token')


  // 設定登入狀態
  userStore.setIsAuthenticated(true)

  // 登入成功後跳轉邏輯（與 Login.vue 相同）
  const redirectPath = localStorage.getItem('redirectAfterLogin')
  if (redirectPath) {
    localStorage.removeItem('redirectAfterLogin')
    router.push(redirectPath)
  } else {
    const selectedRole = localStorage.getItem('userRole') || 'consumer'
    if (selectedRole === 'farmer') {
      router.push('/farmer/crop-dashboard')
    } else {
      router.push('/veggie')
    }
  }
}
</script>

<style scoped>
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

.form-group {
  margin-bottom: 15px;
}

input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

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

.error-message {
  color: red;
  text-align: center;
}
</style>