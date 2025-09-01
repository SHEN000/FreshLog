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

        <!-- 驗證碼：圖片在輸入框外側 -->
        <div class="form-group">
          <div class="captcha-row">
            <div class="input-container captcha-input">
              <input type="text" v-model="captcha" placeholder="輸入驗證碼" maxlength="6"
                @keydown.enter.prevent="handleLogin" />
            </div>

            <!-- 可以調整寬度 -->
            <img :src="captchaImgUrl" class="captcha-img" alt="驗證碼" title="看不清？點擊更換" @click="loadCaptcha"
              draggable="false" :style="{ width: captchaImgWidth }" 
            />
          </div>
          <p v-if="captchaError" class="captcha-error">{{ captchaError }}</p>
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'

const userStore = useUserStore()
const router = useRouter()

const account = ref('')
const password = ref('')
const showPassword = ref(false)

/* 驗證碼 */
const captcha = ref('')
const captchaImgUrl = ref('')
const captchaError = ref('')
const captchaImgWidth = ref('110px')  // 可以自由調整圖片寬度

// 後端位址
const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || ''

async function apiGet(path) {
  const res = await fetch(`${API_BASE}${path}`, { credentials: 'include' })
  // 可能回 JSON 或影像資料，這裡先讓呼叫端判斷
  return res
}
async function apiPost(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body)
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`)
  return data
}

/** 取得驗證碼（Swagger: GET /api/captcha/auth/captcha） */
async function loadCaptcha() {
  try {
    captchaError.value = ''
    const res = await apiGet('/api/captcha/auth/captcha')

    const ct = res.headers.get('content-type') || ''
    if (ct.includes('application/json')) {
      // 多數後端會回 { data: "<base64>" } 或 { captcha: "<base64>" } …
      const json = await res.json()
      const b64 =
        json?.data ||
        json?.captcha ||
        json?.image ||
        json?.base64 ||
        Object.values(json).find(v => typeof v === 'string')

      if (!b64) throw new Error('驗證碼格式不正確')
      captchaImgUrl.value = b64.startsWith('data:image')
        ? b64
        : `data:image/png;base64,${b64}`
    } else {
      // 若直接回圖片（少見），轉為 blob URL 顯示
      const blob = await res.blob()
      captchaImgUrl.value = URL.createObjectURL(blob)
    }
  } catch (e) {
    console.error(e)
    captchaImgUrl.value = ''
    captchaError.value = '驗證碼載入失敗，請點圖重新載入'
  }
}
onMounted(loadCaptcha)

/* 三欄皆必填（不變） */
const canSubmit = computed(() =>
  account.value.trim() !== '' &&
  password.value.trim() !== '' &&
  captcha.value.trim() !== ''
)

/** 串接登入（Swagger: POST /api/user/login）
 *  Body: { userName, userPassword, captcha }
 *  回傳：data.token / data.userId / data.userName
 */
async function handleLogin() {
  if (!account.value.trim() || !password.value.trim()) return
  if (!captcha.value.trim()) {
    captchaError.value = '請輸入驗證碼'
    return
  }
  captchaError.value = ''

  try {
    const resp = await apiPost('/api/user/login', {
      userName: account.value.trim(),
      userPassword: password.value,
      captcha: captcha.value.trim(),
    })

    // 若後端以 code 表示結果（即使 HTTP 200），在這裡攔
    const bizCode = `${resp?.code ?? ''}`
    const bizOk =
      !bizCode ||                
      bizCode === '6001' ||       
      /^2/.test(bizCode) ||       
      resp?.success === true

    if (!bizOk) {
      throw new Error(resp?.message || '登入失敗')
    }

    const token = resp?.data?.token || resp?.token
    if (!token) throw new Error(resp?.message || '登入回應缺少 token')

    // 登入後流程
    localStorage.setItem('userToken', token)
    const selectedRole = localStorage.getItem('userRole') || 'consumer'
    userStore.setUserRole(selectedRole)
    userStore.setIsAuthenticated(true)

    const redirectPath = localStorage.getItem('redirectAfterLogin')
    if (redirectPath) {
      localStorage.removeItem('redirectAfterLogin')
      router.push(redirectPath)
    } else {
      router.push(selectedRole === 'farmer' ? '/farmer/crop-dashboard' : '/veggie')
    }
  } catch (err) {
    // 以 alert 顯示錯誤，並刷新驗證碼
    alert(err.message || '登入失敗，請重試')
    captcha.value = ''
    await loadCaptcha()
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

h1 {
  font-size: 20px;
  color: #2e7d32;
  margin: 0;
}

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
  border-radius: 10px 10px 0 0;
  font-size: 16px;
  font-weight: bold;
  color: #333;
  position: relative;
  cursor: pointer;
  transition: .3s;
  text-decoration: none;
}

.tab::after {
  content: none;
}

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

/* 表單群組 */
.form-group {
  margin-bottom: 30px;
}

/* 共用 input */
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

/* 驗證碼輸入框樣式 */
.captcha-row { display: flex; align-items: center; gap: 10px; }

.captcha-input {
  flex: 0 0 160px;
  /* max-width: 210px; */
}

.captcha-img {
  height: 44px;  /* 保持與輸入框一致的高度 */
  border-radius: 6px;
  box-shadow: 0 0 0 2px #2e7d32 inset;
  background: #fff;
  cursor: pointer;
  user-select: none;
}

.captcha-error {
  margin: 6px 2px 0;
  font-size: 12px;
  color: #b91c1c;
  text-align: left;
}

/* 保持登入 & 忘記密碼 */
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
  white-space: nowrap;
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
  transition: background-color .2s;
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
  margin-top: 10px;
  color: #000;
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


/* 手機版一致留白（避免貼邊） */
@media (max-width: 768px) {
  .auth-page {
    padding: 20px 0;     /* 兩頁一致 */
  }
  .auth-card {
    padding: 32px;       /* 手機內距稍小一點看起來更緊湊 */
    width: calc(100% - 48px); /* 更嚴謹，確保左右各 24px */
  }
}
</style>
