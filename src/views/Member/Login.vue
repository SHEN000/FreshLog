<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="logo-section">
        <img src="@/assets/logo.png" alt="Logo" class="logo" />
        <h1>登入食價登錄FRESHLOG</h1>
      </div>

      <div class="tabs">
        <button class="tab active">登入</button>
        <RouterLink to="/member/register" class="tab">註冊</RouterLink>
      </div>

      <!-- 登入表單 -->
      <form @submit.prevent="handleLogin" class="form">
        <!-- 帳號 -->
        <div class="form-group">
          <div class="input-container">
            <input type="text" v-model="account" placeholder="帳號" />
          </div>
        </div>

        <!-- 密碼 + 眼睛 -->
        <div class="form-group">
          <div class="input-container">
            <input :type="showPassword ? 'text' : 'password'" v-model="password" placeholder="密碼" />
            <span class="toggle-password" @click="showPassword = !showPassword">
              <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                  d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-5.05 0-9.29-3.18-11-8a10.94 10.94 0 0 1 5.06-6.26M1 1l22 22" />
              </svg>
            </span>
          </div>
        </div>

        <div class="extra-options">
          <label><input type="checkbox" /> 保持登入狀態</label>
          <RouterLink to="/member/forgot-password" class="forgot">忘記密碼？</RouterLink>
        </div>

        <button type="submit" class="submit-btn" :disabled="!canSubmit">登入 蔬界！</button>

        <p class="join-text">
          不是會員？<RouterLink to="/member/register">快來加入我們的蔬菜大家庭🍅</RouterLink>
        </p>

        <div class="join-divider"></div>

        <div class="divider">或者，如果您使用 Google 建立帳號</div>

        <button class="google-btn">
          <img src="@/assets/google-icon.png" alt="Google" />
          繼續使用Google
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user' // 使用 Pinia 管理登入狀態與角色

const userStore = useUserStore()

// 建立 router 實例以便導頁
const router = useRouter()

// 雙向綁定：帳號、密碼
const password = ref('')
const account = ref('')

// 控制密碼顯示／隱藏
const showPassword = ref(false)


// 按鈕啟用條件：帳號 & 密碼都有輸入
const canSubmit = computed(() => {
  return account.value.trim() !== '' && password.value.trim() !== ''
})

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
/* 整頁背景與置中設定 */
.auth-page {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 50px 0px;
}

/* 卡片容器樣式 */
.auth-card {
  background: white;
  padding: 32px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  max-width: 370px;
  width: 100%;
  text-align: center;
}

.logo-section {
  margin-bottom: 20px;
}

.logo {
  width: 100px;
  margin-bottom: 8px;
}

h1 {
  font-size: 20px;
  color: #2e7d32;
  margin: 0;
}

/* 上方切換分頁樣式 */
.tabs {
  display: flex;
  justify-content: center;
  margin: 12px 0 20px;
  gap: 70px;
}

.tab {
  padding: 6px 20px;
  border: none;
  background: transparent;
  border-radius: 10px 10px 0px 0px;
  font-size: 16px;
  font-weight: bold;
  color: #333;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
}

.tab::after {
  content: none;
}

/* 登入分頁為 active 狀態 */
.tab.active {
  background-color: #e6f4ec;
  color: #2e7d32;
}

.tab.active::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 3px;
  background-color: #2e7d32;
  border-radius: 2px;
}

/* 表單群組間距 */
.form-group {
  margin-bottom: 30px;
}

/* 共用 input 樣式 */
.input-container {
  position: relative;
  width: 100%;
}

.input-container input {
  width: 100%;
  height: 44px;
  padding: 10px 14px;
  padding-right: 42px;
  border: 2px solid #2e7d32;
  border-radius: 6px;
  box-sizing: border-box;
  outline: none;
  font-size: 16px;
  background: #fff;
  transition: background .2s, border-color .2s;
}

.input-container input:focus {
  background: #e6f4ec;
  border-color: #388e3c;
}

.input-container input::placeholder {
  color: #8bbd8d;
  opacity: 1;
}

/* 密碼切換 icon */
.toggle-password {
  position: absolute;
  top: 50%;
  right: 14px;
  transform: translateY(-50%);
  cursor: pointer;
  display: flex;
  align-items: center;
  z-index: 2;
}

.toggle-password svg {
  width: 20px;
  height: 20px;
  stroke: #2e7d32;
  fill: none;
  opacity: .7;
}

.toggle-password:hover svg {
  opacity: 1;
}

label {
  font-size: 14px;
  margin-bottom: 4px;
  display: inline-block;
  color: #000;
}

/* 保持登入 & 忘記密碼區 */
.extra-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  margin-bottom: 30px;
}

.extra-options label {
  display: flex;
  align-items: center;
  margin: 0;
  gap: 6px;
  white-space: nowrap; /* 防止換行 */
}

.forgot {
  color: #2e7d32;
  text-decoration: none;
}

/* 按鈕 */
.submit-btn {
  background-color: #2e7d32;
  color: white;
  padding: 10px;
  width: 100%;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  margin-bottom: 10px;
}

/* 按鈕不可用時：灰底、不可點 */
.submit-btn:disabled {
  background-color: #BDBDBD;
  cursor: not-allowed;
  color: #fff;
}

/* Google */
.google-btn {
  margin-top: 12px;
  width: 100%;
  padding: 10px;
  border: 2px solid #2e7d32;
  border-radius: 6px;
  background-color: #FFF;
  display: flex;
  align-items: center;
  position: relative;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  font-weight: bold;
  color: #2e7d32;
  transition: background-color 0.2s ease;
  font-size: 16px;
}

.google-btn:hover {
  background-color: #f1fef2;
}

.google-btn img {
  position: absolute;
  left: 16px;
  width: 20px;
  height: 20px;
}

/* 分隔線與提示 */
.divider {
  font-size: 16px;
  color: #000;
}

.join-text {
  font-size: 13px;
  margin-top: 16px;
  color: #000;
  font-weight: 500;
  margin-top: 10px;
  font-weight: bold;
}

.join-text a {
  color: #000;
  text-decoration: underline;
}

.join-divider {
  border-top: 2px solid #ccc;
  margin: 20px 0 10px;
}

/* 響應式切換 */
@media (max-width: 768px) {
  .auth-page {
    padding: 20px 0px;
  }
}
</style>
