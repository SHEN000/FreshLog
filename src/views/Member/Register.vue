<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="logo-section">
        <img src="@/assets/logo.png" alt="Logo" class="logo" />
        <h1>登入食價登錄FRESHLOG</h1>
      </div>

      <div class="tabs">
        <RouterLink to="/member/login" class="tab">登入</RouterLink>
        <button class="tab active">註冊</button>
      </div>

      <!-- 註冊流程 -->
      <form @submit.prevent="step === 1 ? verifyCode() : handleRegister()" class="form">
        <!-- STEP 1：Email → 驗證碼 → 同意條款 → 確認 -->
        <div v-if="step === 1">
          <!-- 1. Email 輸入 + 取得驗證碼按鈕 -->
          <div class="form-group">
            <div class="input-container">
              <input type="email" v-model="email" placeholder="請輸入電子郵件" />
            </div>
            <!-- 若 email 不空且格式錯誤，顯示紅字提醒 -->
            <p v-if="email.trim() !== '' && !isEmailValid" class="input-error">
              ！請輸入正確的電子郵件格式
            </p>
          </div>
          <!-- 取得驗證碼按鈕，僅在尚未發送過時顯示 -->
          <div class="form-group">
            <button v-if="!codeSent" type="button" class="submit-btn" @click="requestCode" :disabled="!canRequestCode">
              獲取驗證碼
            </button>
          </div>

          <!-- 2. 驗證碼區塊（按下獲取後才顯示）-->
          <template v-if="codeSent">
            <!-- 倒數計時文字 -->
            <p class="timer">請於 {{ countdown }} 秒內輸入驗證碼</p>

            <!-- 驗證碼 + 重新寄送 -->
            <div class="form-group horizontal-group">
              <div class="input-container">
                <input type="text" v-model="code" placeholder="請輸入6位數驗證碼" />
              </div>
              <button type="button" class="resend-btn" @click="resendCode" :disabled="!canResendCode">重新寄送</button>
            </div>

            <p v-if="code.trim() !== '' && !isCodeValid" class="input-error">
              驗證碼須為6位數
            </p>

            <div class="form-group">
              <label class="terms">
                <input type="checkbox" v-model="agreed" />
                我同意條款和條件
              </label>
            </div>

            <div class="form-group">
              <button type="submit" class="submit-btn" :disabled="!canVerifyCode">
                確認
              </button>
            </div>
          </template>
        </div>

        <!-- STEP 2：帳號 / 密碼 / 確認密碼 → 註冊 -->
        <div v-else>
          <!-- 帳號 -->
          <div class="form-group">
            <div class="input-container">
              <input type="text" v-model="account" placeholder="帳號" />
            </div>
            <!-- 長度不足 8 字元提醒 -->
            <p v-if="account.trim() !== '' && account.trim().length < 8" class="input-error">
              帳號至少 8 個字元
            </p>
            <!-- 含有非法字元（非英數）提醒 -->
            <p v-else-if="account.trim() !== '' && !accountPattern.test(account.trim())" class="input-error">
              帳號只能使用英文字母或數字
            </p>
          </div>
          <!-- 密碼 -->
          <div class="form-group">
            <div class="input-container password-input-container">
              <input :type="showPassword ? 'text' : 'password'" v-model="password" placeholder="密碼（至少8位含英數）" />
              <!-- 眼睛按鈕切換顯示 -->
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
            <!-- 密碼強度 / 格式檢查提醒 -->
            <p v-if="password !== '' && !isPasswordValid" class="input-error">
              密碼至少8位，且需包含英文及數字<br/>
              註:可加上特殊符號加強密碼強度
            </p>
          </div>
          <!-- 確認密碼 + 切換顯示 -->
          <div class="form-group">
            <div class="input-container password-input-container">
              <input :type="showConfirm ? 'text' : 'password'" v-model="confirmPassword" placeholder="確認密碼" />
              <!-- 眼睛按鈕切換顯示 -->
              <span class="toggle-password" @click="showConfirm = !showConfirm">
                <svg v-if="showConfirm" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-5.05 0-9.29-3.18-11-8a10.94 10.94 0 0 1 5.06-6.26M1 1l22 22" />
                </svg>
              </span>
            </div>
            <!-- 確認密碼與原密碼不一致提醒 -->
            <p v-if="confirmPassword !== '' && !isConfirmMatch" class="input-error">
              確認密碼需與密碼相同
            </p>
          </div>

          <div class="form-group">
            <button type="submit" class="submit-btn" :disabled="!canRegister">
              註冊
            </button>
          </div>
        </div>
      </form>

      <p class="join-text">
        已有帳號了？<RouterLink to="/member/login">登入蔬界 ✏️</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'

const userStore = useUserStore()
const router = useRouter()

// 後端位址
const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || ''

// 控制流程階段，1=發送驗證碼，2=進入帳密設定
const step = ref(1)

// STEP1 欄位綁定：email、code（驗證碼）、同意條款
const email = ref('')
const code = ref('')
const agreed = ref(false)
const codeSent = ref(false) // 驗證碼是否已寄出

const countdown = ref(60)
let timer = null
const isLoading = ref(false)

// 驗證 Email 格式
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const isEmailValid = computed(() => emailPattern.test(email.value.trim()))

// 驗證 code 長度是否為 6
const isCodeValid = computed(() => code.value.trim().length === 6)

// STEP2 欄位綁定：帳號、密碼、密碼顯示切換
const account = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirm = ref(false)

// 帳號限制：至少 8 字元且僅英數
const accountPattern = /^[A-Za-z0-9]+$/
const isAccountValid = computed(() => {
  const v = account.value.trim()
  return v.length >= 8 && accountPattern.test(v)
})

// 密碼限制：至少 8 字元，含英文與數字，允許特殊符號
const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/
const isPasswordValid = computed(() => passwordPattern.test(password.value))

// 確認密碼必須與 password 相符
const isConfirmMatch = computed(() => confirmPassword.value === password.value)

// 按鈕可用條件
const canRequestCode = computed(() => isEmailValid.value && !isLoading.value)
const canResendCode = computed(() => step.value === 1 && !isLoading.value)
const canVerifyCode = computed(() =>
  step.value === 1 &&
  code.value.trim().length === 6 &&
  agreed.value &&
  !isLoading.value
)
const canRegister = computed(() =>
  step.value === 2 &&
  isAccountValid.value &&
  isPasswordValid.value &&
  isConfirmMatch.value &&
  !isLoading.value
)

// 倒數計時
function startCountdown() {
  clearInterval(timer)
  countdown.value = 300
  timer = setInterval(() => {
    if (countdown.value > 0) countdown.value--
    else clearInterval(timer)
  }, 1000)
}
onBeforeUnmount(() => clearInterval(timer))

async function apiPost(path, { query, body } = {}) {
  const q = query
    ? '?' + new URLSearchParams(query).toString()
    : ''
  const url = `${API_BASE}${path}${q}`
  const res = await fetch(url, {
    method: 'POST',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data?.message || `HTTP ${res.status}`)
  }
  return data
}

// Step1：發送／重新寄送驗證碼
async function requestCode() {
  if (!isEmailValid.value) return
  isLoading.value = true
  try {
    const resp = await apiPost('/api/user/send-register-code', {
      query: { email: email.value.trim() }
    })

    const biz = String(resp?.code ?? '')

    // 已註冊的信箱（你的後端回 6006）
    if (biz === '6006') {
      alert(resp?.message || '電子郵件已被註冊，請改用其他信箱或直接登入')
      return  // 不進入倒數、不顯示輸入驗證碼
    }

    // 其他情況視為成功：開始倒數、顯示輸入驗證碼區塊
    codeSent.value = true
    startCountdown()
  } catch (err) {
    alert(err.message || '發送驗證碼失敗，請稍後再試')
  } finally {
    isLoading.value = false
  }
}

async function resendCode() {
  code.value = ''
  await requestCode()
}

// Step1：確認驗證碼成功後進入註冊
async function verifyCode() {
  if (!canVerifyCode.value) return
  isLoading.value = true
  try {
    const resp = await apiPost('/api/user/verify-code', {
      body: { email: email.value.trim(), code: code.value.trim() }
    })
    const codeStr = String(resp?.code ?? '')

    // 後端明確錯誤碼
    if (codeStr === '6007') {
      alert(resp?.message || '驗證碼錯誤或已過期')
      code.value = ''       // 清空再輸入
      return
    }

    // 成功條件
    const success =
      codeStr === '0004' || codeStr === '200' ||
      resp?.data === true ||
      /成功/.test(resp?.message ?? '') || /成功/.test(String(resp?.data ?? ''))

    if (!success) {
      alert(resp?.message || '驗證失敗')
      return
    }

    clearInterval(timer)
    step.value = 2
  } catch (err) {
    alert(err.message || '驗證失敗，請稍後再試')
  } finally {
    isLoading.value = false
  }
}

// Step2：註冊並跳轉  ->  POST /api/user/register
async function handleRegister() {
  if (!canRegister.value) return
  if (password.value !== confirmPassword.value) {
    alert('密碼與確認密碼不一致')
    return
  }
  isLoading.value = true
  try {
    const resp = await apiPost('/api/user/register', {
      body: {
        userName: account.value.trim(),
        userPassword: password.value,
        email: email.value.trim()
      }
    })

    // 若後端有回 token → 直接視為登入
    const token = resp?.data?.token
    if (token) {
      localStorage.setItem('userToken', token)
      userStore.setIsAuthenticated(true)
      const redirectPath = localStorage.getItem('redirectAfterLogin')
      if (redirectPath) {
        localStorage.removeItem('redirectAfterLogin')
        router.push(redirectPath)
      } else {
        const selectedRole = localStorage.getItem('userRole') || 'consumer'
        router.push(selectedRole === 'farmer' ? '/farmer/crop-dashboard' : '/veggie')
      }
      return
    }

    const biz = String(resp?.code ?? '')
    if (biz === '6003') {
      alert(resp?.message || '註冊成功')
      router.push('/member/login')  // 完成註冊導去登入
      return
    }

    // 其他非預期回應
    alert(resp?.message || '註冊結果不明，請稍後再試')
  } catch (err) {
    alert(err.message || '註冊失敗，請稍後再試')
  } finally {
    isLoading.value = false
  }
}
</script>


<style scoped>
/* 整頁背景與置中設定 */
.auth-page {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 50px 0;
}

/* 卡片容器樣式 */
.auth-card {
  background: #fff;
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

.logo-section h1 {
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
  background: transparent;
  border: none;
  border-radius: 10px 10px 0 0;
  font-size: 16px;
  font-weight: bold;
  color: #333;
  cursor: pointer;
  text-decoration: none;
  position: relative;
}

/* 註冊分頁為 active 狀態 */
.tab.active {
  background: #e6f4ec;
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
  background: #2e7d32;
  border-radius: 2px;
}

/* 表單區塊間距 */
.form-group {
  margin-bottom: 20px;
}

/* 輸入錯誤訊息 */
.input-error {
  color: red;
  font-size: 13px;
  margin-top: 4px;
  text-align: left;
}

/* 驗證碼倒數計時文字 */
.timer {
  text-align: right;
  color: red;
  font-size: 13px;
  margin-bottom: 8px;
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

/* 驗證碼 + 重新寄送 Btn */
.horizontal-group {
  display: flex;
  gap: 8px;
}

.resend-btn {
  flex-shrink: 0;
  height: 44px;
  padding: 0 16px;
  background: #2e7d32;
  color: #fff;
  border: none;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.resend-btn:disabled {
  background: #BDBDBD;
  cursor: not-allowed;
}

/* 同意條款 */
.terms {
  display: flex;
  align-items: center;
  gap: 6px;
}

/* 密碼切換 icon */
.password-input-container {
  position: relative;
}

.toggle-password {
  position: absolute;
  top: 50%;
  right: 14px;
  transform: translateY(-50%);
  cursor: pointer;
  z-index: 1;
}

.toggle-password svg {
  width: 20px;
  height: 20px;
  stroke: #2e7d32;
  fill: none;
  opacity: 0.7;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.toggle-password:hover svg {
  opacity: 1;
}

/* 按鈕 */
.submit-btn {
  width: 100%;
  height: 44px;
  background: #2e7d32;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
}

.submit-btn:disabled {
  background: #BDBDBD;
  cursor: not-allowed;
}

/* 加入會員提示 */
.join-text {
  font-size: 13px;
  margin-top: 16px;
  font-weight: bold;
  color: #000;
}

.join-text a {
  color: #2e7d32;
  text-decoration: underline;
}

/* 響應式切換 */
@media (max-width: 768px) {
  .auth-page {
    padding: 20px 0px;
  }
}
</style>
