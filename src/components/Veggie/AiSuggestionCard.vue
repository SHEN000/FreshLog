<template>
  <div class="ai-suggestion-card">

    <div class="suggestion-section">
      <h2 class="card-title">AI智慧推薦</h2>
    </div>

    <div class="suggestion-section">
      <div class="icon">
        <img src="@/assets/icons/timing.png" alt="最佳購買時機" />
      </div>
      <div class="info">
        <h3>最佳購買時機</h3>
        <p>{{ aiSuggestion.bestBuyTiming || '暫無建議' }}</p>
      </div>
    </div>

    <div class="suggestion-section">
      <div class="icon">
        <img src="@/assets/icons/alternative.png" alt="同等替代選擇" />
      </div>
      <div class="info">
        <h3>同等替代選擇</h3>
        <p>{{ aiSuggestion.alternative || '暫無建議' }}</p>
      </div>
    </div>

    <div class="suggestion-section">
      <div class="icon">
        <img src="@/assets/icons/location.png" alt="最佳購買地點" />
      </div>
      <div class="info">
        <h3>最佳購買地點</h3>
        <p>{{ aiSuggestion.bestMarket || '暫無建議' }}</p>
      </div>
    </div>

    <div class="notice-section">
      <p>均價超跌通知</p>
      <div class="notification-setting">
        <label class="switch">
          <input type="checkbox" :checked="isNotificationOn" @change="handleNotificationToggle" />
          <span class="slider"></span>
        </label>
      </div>
    </div>

    <div class="price-edit-row">
      <div class="price-setting">
        設定理想價格:
        <!-- 若有設定則顯示價錢，否則顯示「未設定」 -->
        <span v-if="idealPrice !== null">${{ idealPrice }}/公斤</span>
        <span v-else>未設定</span>
      </div>
      <button class="edit-button" @click="onEditClick">修改</button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'

// 建立 router 以供跳轉登入使用
const router = useRouter()
// 取得使用者登入狀態
const userStore = useUserStore()

// 從父元件接收 aiSuggestion 物件
const { aiSuggestion = {} } = defineProps({
  aiSuggestion: { type: Object, default: () => ({}) }
})

// localStorage 的 key
const STORAGE_NOTIFY_KEY = 'notify_over_drop'
const STORAGE_IDEAL_KEY = 'ideal_price'

// 均價超跌通知 開關 狀態
const isNotificationOn = ref(false)

// 如果已登入，從 localStorage 讀取使用者之前的設定
if (userStore.isAuthenticated) {
  try {
    isNotificationOn.value = JSON.parse(localStorage.getItem(STORAGE_NOTIFY_KEY)) === true
  } catch {
    isNotificationOn.value = false
  }
}

// 監聽登入狀態改變，同步更新開關狀態
watch(
  () => userStore.isAuthenticated,
  loggedIn => {
    if (loggedIn) {
      try {
        isNotificationOn.value = JSON.parse(localStorage.getItem(STORAGE_NOTIFY_KEY)) === true
      } catch {
        isNotificationOn.value = false
      }
      // 若登出，則關閉通知
    } else {
      isNotificationOn.value = false
    }
  }
)

// 處理通知開關切換
function handleNotificationToggle(event) {
  // 未登入則跳轉到登入頁，並強制切回關閉
  if (!userStore.isAuthenticated) {
    router.push('/member/login')
    isNotificationOn.value = false
    return
  }
  // 已登入則更新並存入 localStorage
  const val = event.target.checked
  isNotificationOn.value = val
  localStorage.setItem(STORAGE_NOTIFY_KEY, JSON.stringify(val))
  // TODO: 同步後端 API 呼叫
}

// 理想價格 狀態
const idealPrice = ref(null)

// 登入時，從 localStorage 讀取之前的理想價格
if (userStore.isAuthenticated) {
  const saved = localStorage.getItem(STORAGE_IDEAL_KEY)
  const num = saved !== null ? parseFloat(saved) : NaN
  idealPrice.value = !isNaN(num) ? num : null
}

// 監聽登入狀態改變，同步更新理想價格狀態
watch(
  () => userStore.isAuthenticated,
  loggedIn => {
    if (loggedIn) {
      const saved = localStorage.getItem(STORAGE_IDEAL_KEY)
      const num = saved !== null ? parseFloat(saved) : NaN
      idealPrice.value = !isNaN(num) ? num : null
    } else {
      idealPrice.value = null
    }
  }
)

// 「修改」按鈕 點擊邏輯
function onEditClick() {
  // 未登入則跳轉登入頁
  if (!userStore.isAuthenticated) {
    router.push('/member/login')
    return
  }
  // 已登入則 prompt 輸入新價格
  const input = prompt(
    '請輸入理想價格（元/公斤）',
    idealPrice.value != null ? idealPrice.value : ''
  )
  if (input == null) return // 使用者取消
  const num = Number(input)
  if (!isNaN(num) && num >= 0) {
    const round = Math.round(num * 100) / 100
    idealPrice.value = round
    // 儲存到 localStorage
    localStorage.setItem(STORAGE_IDEAL_KEY, round.toString())
    // TODO: 同步後端 API 呼叫
  } else {
    alert('請輸入有效的數字。')
  }
}
</script>

<style scoped>
/* 卡片最外層容器 */
.ai-suggestion-card {
  background-color: #f3f8fb;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.card-title {
  font-size: 20px;
  font-weight: bold;
  color: #2e7d32;
  margin-bottom: 8px;
}

.suggestion-section {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  border-bottom: 1px solid #d9d9d9;
  padding-bottom: 12px;
}

.suggestion-section:last-of-type {
  border-bottom: none;
}

.icon img {
  width: 32px;
  height: 32px;
}

.info h3 {
  font-size: 16px;
  font-weight: bold;
  margin: 0 0 4px 0;
}

.info p {
  font-size: 14px;
  color: #555;
  margin: 0;
}

/* 通知開關 */
.notice-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 16px;
  margin-top: 16px;
}

/* 增加滑鼠手勢提示 */
.notification-setting {
  cursor: pointer;
}

.switch {
  position: relative;
  display: inline-block;
  width: 42px;
  height: 24px;
}

.switch input {
  position: absolute;
  opacity: 0;
  width: 42px;
  height: 24px;
  pointer-events: none;
}

.slider {
  position: absolute;
  cursor: pointer;
  background-color: #ccc;
  border-radius: 24px;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  transition: 0.4s;
}

.slider::before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  border-radius: 50%;
  transition: 0.4s;
}

.switch input:checked+.slider {
  background-color: #2e7d32;
}

.switch input:checked+.slider::before {
  transform: translateX(18px);
}

/* 理想價格 編輯區 */
.price-edit-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 8px;
  flex-wrap: wrap;
}

.price-setting {
  font-size: 16px;
  color: #333;
}

.edit-button {
  padding: 6px 16px;
  background-color: #2e7d32;
  color: white;
  border: none;
  border-radius: 24px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color .3s;
}

.edit-button:hover {
  background-color: #27682b;
}
</style>
