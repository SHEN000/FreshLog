<template>
    <div class="auth-page">
        <div class="auth-card">
            <div class="logo-section">
                <img src="@/assets/logo.png" alt="Logo" class="logo" />
                <h1>忘記密碼</h1>
                <p class="subtitle">
                    輸入註冊信箱，我們會寄送驗證碼給您
                </p>
            </div>

            <form @submit.prevent="resetPassword" class="form">
                <!-- 1. Email 階段: step===1 時顯示 -->
                <div class="form-group">
                    <div class="input-container">
                        <input type="email" v-model="email" placeholder="請輸入註冊Email" />
                    </div>
                    <!-- Email 格式錯誤時顯示紅字提醒 -->
                    <p v-if="email.trim() !== '' && !isEmailValid" class="input-error">
                        ！請輸入正確的電子郵件格式
                    </p>
                    <!-- 取得驗證碼按鈕: 僅 step===1 時顯示，且 Email 格式通過才可點 -->
                    <button v-if="step === 1" type="button" class="submit-btn" @click="requestCode"
                        :disabled="!canRequestCode">取得驗證碼</button>
                </div>

                <!-- 2. 驗證碼階段: step>=2 時顯示 -->
                <div class="form-group" v-show="step >= 2">
                    <!-- 倒數計時提示: 僅在 step===2 時顯示 -->
                    <p v-if="step === 2" class="hint-text timer">
                        請於 {{ countdown }} 秒內輸入驗證碼
                    </p>

                    <div class="verification-group">
                        <input type="text" v-model="code" placeholder="驗證碼" class="verification-input" />
                        <button type="button" class="resend-btn" @click="resendCode"
                            :disabled="!canResend">重新寄送</button>
                    </div>

                    <!-- 長度不足時 -->
                    <p v-if="code.trim() !== '' && !isCodeValid" class="input-error">
                        驗證碼須為6位數
                    </p>
                    <!-- 確認驗證碼按鈕: 僅 step===2 時顯示，且 code 長度與同意條款通過才可點 -->
                    <button v-if="step === 2" type="button" class="submit-btn" @click="verifyCode"
                        :disabled="!canVerifyCode">
                        確認驗證碼
                    </button>
                </div>

                <!-- 3. 修改密碼階段: step>=3 時顯示 -->
                <div class="form-group" v-show="step >= 3">
                    <div class="input-container password-input-container">
                        <input :type="showNew ? 'text' : 'password'" v-model="newPassword" placeholder="密碼（至少8位含英數）" />
                        <!-- 眼睛按鈕切換顯示 -->
                        <span class="toggle-password" @click="showNew = !showNew">
                            <svg v-if="showNew" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
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
                    <p v-if="newPassword.trim() !== '' && !isPasswordValid" class="input-error">
                        密碼至少8位，且需包含英文及數字<br />
                        註:可加上特殊符號加強密碼強度
                    </p>
                </div>

                <div class="form-group" v-show="step >= 3">
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
                    <!-- 確認密碼不一致提醒 -->
                    <p v-if="confirmPassword !== '' && !isConfirmMatch" class="input-error">
                        確認密碼需與密碼相同
                    </p>
                </div>

                <!-- 「確認修改」按鈕: 僅 step===3 且條件通過才可點 -->
                <button v-show="step === 3" type="submit" class="submit-btn" :disabled="!canReset">
                    確認修改
                </button>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onBeforeUnmount } from 'vue'

import { useRouter } from 'vue-router'

const router = useRouter()

// 控制流程階段，：1=Email, 2=驗證碼, 3=修改密碼
const step = ref(1)

// 欄位綁定
const email = ref('')
const code = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

// Email 格式驗證
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const isEmailValid = computed(() => emailPattern.test(email.value.trim()))

// 驗證碼長度6
const isCodeValid = computed(() => code.value.trim().length === 6)

// 密碼顯示切換
const showNew = ref(false)
const showConfirm = ref(false)

// 密碼限制：至少 8 字元，含英文與數字，允許特殊符號
const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/
const isPasswordValid = computed(() =>
    passwordPattern.test(newPassword.value)
)

// 確認密碼需與 newPassword 相同
const isConfirmMatch = computed(() =>
    confirmPassword.value === newPassword.value
)


// 倒數計時
const countdown = ref(60)
let timer = null

// 按鈕可用條件
const canRequestCode = computed(() => isEmailValid.value)
const canVerifyCode = computed(() => isCodeValid.value)
const canResend = computed(() => step.value === 2)
const canReset = computed(() =>
    isPasswordValid.value &&
    isConfirmMatch.value
)

// 倒數計時啟動函式
function startCountdown() {
    countdown.value = 60
    clearInterval(timer)
    timer = setInterval(() => {
        if (countdown.value > 0) {
            countdown.value--
        } else {
            clearInterval(timer)
        }
    }, 1000)
}

// 請求驗證碼
function requestCode() {
    // TODO: 呼叫「取得驗證碼」API...
    step.value = 2
    startCountdown()
}

// 重新寄送驗證碼
function resendCode() {
    // TODO: 呼叫「重新寄送」API...
    code.value = ''
    countdown.value = 60
    startCountdown()
}

// 驗證碼確認
function verifyCode() {
    // TODO: 驗證 code
    // 成功後：
    clearInterval(timer)
    step.value = 3
}

// 重設密碼，並顯示提示後導回登入
async function resetPassword() {
    try {
        // TODO: 呼叫「重設密碼」API，await API 回傳
        // 假設 API 成功：
        alert('密碼重設成功！請重新登入。')
        router.push('/member/login')
    } catch (err) {
        // API 失敗時可顯示錯誤
        console.error(err)
        alert('重設失敗，請稍後再試。')
    }
}

// 離開頁面前清除計時器
onBeforeUnmount(() => {
    clearInterval(timer)
})
</script>

<style scoped>
.auth-page {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 50px 0;
}

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

.subtitle {
    font-size: 14px;
    color: #000;
    margin-top: 8px;
}

.hint-text {
    font-size: 13px;
    color: #000;
    margin-top: 4px;
}

.input-error {
    color: red;
    font-size: 13px;
    margin-top: 4px;
    text-align: left;
}

.timer {
    text-align: right;
    color: red;
    font-size: 13px;
}

.form-group {
    margin-bottom: 30px;
}

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

.submit-btn {
    background-color: #2e7d32;
    color: #fff;
    padding: 10px;
    width: 100%;
    border: none;
    border-radius: 6px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    margin-top: 8px;
}

.submit-btn:disabled {
    background-color: #BDBDBD;
    cursor: not-allowed;
    color: #fff;
}

.verification-group {
    display: flex;
    width: 100%;
    align-items: flex-end;
}

.verification-group {
    display: flex;
    width: 100%;
    border: 2px solid #2e7d32;
    border-radius: 6px;
    overflow: hidden;
    height: 44px;
}

.verification-input {
    flex: 1;
    border: none;
    border-radius: 0;
    height: 100%;
    padding: 0 12px;
    font-size: 16px;
    box-sizing: border-box;
    outline: none;
}

.verification-input::placeholder {
    color: #8bbd8d;
    opacity: 1;
}

.verification-input:focus {
    background: #e6f4ec;
}

.resend-btn {
    background-color: #2e7d32;
    color: #fff;
    border: none;
    border-radius: 0;
    padding: 0 14px;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.resend-btn:disabled {
    background-color: #BDBDBD;
    cursor: not-allowed;
    color: #fff;
}


.input-container .resend-btn {
    position: static;
    top: auto;
    right: auto;
    transform: none;
}

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
    opacity: .7;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
}

.toggle-password:hover svg {
    opacity: 1;
}

/* 響應式切換 */
@media (max-width: 768px) {
    .auth-page {
        padding: 20px 0px;
    }
}
</style>
