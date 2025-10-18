<template>
  <div class="header-container">
    <!-- 動態漸層背景 -->
    <div class="header-bg" :style="{ background: gradientStyle }"></div>

    <div class="header-gradient">
      <!-- 標題 + 收藏 -->
      <div class="header-title-row">
        <h1 class="header-title">{{ title }}</h1>
        <button class="favorite-button" @click="toggleFavorite" aria-label="收藏食譜">
          <img :src="isFavorite ? redHeart : grayHeart" alt="收藏" class="heart-icon" />
        </button>
      </div>

      <p class="header-desc">{{ desc }}</p>
      <div class="header-info">
        <span class="info-item">
          <img src="@/assets/icons/recipetime.png" alt="時間" class="icon" />
          {{ cookTimeMinutes }}分鐘
        </span>
        <span class="info-item">
          <img src="@/assets/icons/quantity.png" alt="份量" class="icon" />
          {{ servings }}
        </span>
        <span class="info-item">
          <img src="@/assets/icons/difficulty.png" alt="難度" class="icon" />
          {{ difficulty }}
        </span>
      </div>
    </div>
    <img :src="$img(image)" alt="食譜圖片" class="header-image" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'  
import { useUserStore } from '@/store/user'         
import grayHeart from '@/assets/icons/heart-gray.png' 
import redHeart from '@/assets/icons/heart-red.png'  

const props = defineProps({
  id: [String, Number], 
  title: String,
  desc: String,
  image: String,
  cookTimeMinutes: { type: [Number, String], default: null },
  servings: { type: [Number, String], default: null },
  difficulty: String,
  gradientColors: { type: Array, default: () => [] }
})

// 產生背景用的 CSS
const gradientStyle = computed(() => {
  const colors = props.gradientColors || []
  if (colors.length < 2) return ''
  // e.g. ["#f00","#0f0"] => "linear-gradient(to right, #f00, #0f0)"
  return `linear-gradient(to right, ${props.gradientColors.join(', ')})`
})

// 處理漸層 CSS 字串（for desktop & mobile）
function generateGradientCSS() {
  const [c1, c2, c3] = props.gradientColors
  const transparent = 'rgba(255, 102, 0, 0)'

  const desktopGradient = `linear-gradient(90deg, ${c1} 0%, ${c2} 20%, ${c3} 60%, ${transparent} 100%)`
  const mobileGradient = `linear-gradient(to bottom, ${c1} 0%, ${c2} 30%, ${c3} 65%, ${transparent} 100%)`

  // 寫入 CSS 變數供 ::before 使用
  document.documentElement.style.setProperty('--recipe-header-gradient-pc', desktopGradient)
  document.documentElement.style.setProperty('--recipe-header-gradient-mobile', mobileGradient)
}

onMounted(() => {
  generateGradientCSS()
})

onUnmounted(() => {
  // 可選：離開頁面時清掉變數
  document.documentElement.style.removeProperty('--recipe-header-gradient-pc')
  document.documentElement.style.removeProperty('--recipe-header-gradient-mobile')
})

/* 收藏*/
const userStore = useUserStore()
const router = useRouter()
const route = useRoute()

const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')

function getAuthHeader() {
  const raw = localStorage.getItem('userToken') || ''
  return raw ? `Bearer ${raw.replace(/^Bearer\s+/, '')}` : ''
}
function getUserId() {
  return userStore.userId || Number(localStorage.getItem('userId')) || null
}
function getRecipeId() {
  return props.id
      ?? route.params.id
      ?? route.query.recipeId
      ?? (route.path.match(/\/recipe\/([^/?#]+)/)?.[1])
      ?? null
}
async function apiFetch(method, path, { query, body } = {}) {
  const q = query ? `?${new URLSearchParams(query).toString()}` : ''
  const url = `${API_BASE}${path}${q}`

  const headers = new Headers()
  headers.set('Accept', 'application/json')
  if (body) headers.set('Content-Type', 'application/json')

  const auth = getAuthHeader()
  if (auth) {
    headers.set('Authorization', auth)
    headers.set('token',      auth.replace(/^Bearer\s+/, ''))
    headers.set('X-Auth-Token', auth.replace(/^Bearer\s+/, ''))
  }

  const res  = await fetch(url, { method, headers, credentials: 'include', body: body ? JSON.stringify(body) : undefined })
  const text = await res.text()
  const data = text ? JSON.parse(text) : {}
  if (!res.ok) {
    const err = new Error(data?.message || `HTTP ${res.status}`)
    err.status = res.status
    throw err
  }
  return data
}

/* 呼叫食譜收藏的端點 */
const favAdd    = (recipeId, userId) => apiFetch('POST',   `/api/memberUser/favorites/recipe/${encodeURIComponent(recipeId)}`, { query: { userId } })
const favRemove = (recipeId, userId) => apiFetch('DELETE', `/api/memberUser/favorites/recipe/${encodeURIComponent(recipeId)}`, { query: { userId } })

/* 回傳碼判斷 */
const CODE_OK          = new Set(['0000', '0', 0])
const CODE_ALREADY_FAV = '2001'
const CODE_NOT_FOUND   = '2002'
const addFavOK    = (r) => CODE_OK.has(String(r?.code ?? '')) || String(r?.code ?? '') === CODE_ALREADY_FAV || /success|成功|ok/i.test(String(r?.message ?? ''))
const removeFavOK = (r) => CODE_OK.has(String(r?.code ?? '')) || String(r?.code ?? '') === CODE_NOT_FOUND   || /success|成功|ok|移除|刪除/i.test(String(r?.message ?? ''))

/* 用「清單」端點同步收藏狀態（可跨裝置） */
const FAVORITES_CATEGORY = 'ALL'

async function favStatus(recipeId, userId) {
  const resp = await apiFetch('GET', '/api/memberUser/favorites/recipe', { query: { userId, category: FAVORITES_CATEGORY } })
  const raw  = resp?.data?.items ?? resp?.data ?? resp?.items ?? []
  const list = Array.isArray(raw) ? raw : []
  return list.some(it => {
    if (typeof it === 'string') return it === String(recipeId)
    const v = it?.recipeId ?? it?.value ?? it?.id
    return String(v) === String(recipeId)
  })
}

/* 狀態 + 防重點擊 */
const isFavorite = ref(false)
const favBusy    = ref(false)

/* 初次掛載與登入/路由改變時，同步伺服器收藏狀態 */
async function syncFavoriteFromServer() {
  if (!userStore.isAuthenticated) return
  const uid = getUserId()
  const rid = getRecipeId()
  if (!uid || !rid) return
  const exists = await favStatus(rid, uid)
  if (exists === true)  isFavorite.value = true
  if (exists === false) isFavorite.value = false
}
onMounted(syncFavoriteFromServer)
watch([() => userStore.isAuthenticated, () => route.fullPath, () => props.id], syncFavoriteFromServer)

/* 點擊切換 */
async function toggleFavorite() {
  if (!userStore.isAuthenticated) {
    localStorage.setItem('redirectAfterLogin', route.fullPath)
    router.push('/member/login')
    return
  }
  if (favBusy.value) return
  favBusy.value = true

  const uid  = getUserId()
  const rid  = getRecipeId()
  if (!uid)  { alert('找不到使用者資訊，請重新登入後再試。'); favBusy.value = false; router.push('/member/login'); return }
  if (!rid)  { alert('找不到食譜 ID，無法收藏。'); favBusy.value = false; return }

  const prev = isFavorite.value
  isFavorite.value = !prev

  try {
    if (!prev) {
      const resp = await favAdd(rid, uid)
      if (!addFavOK(resp)) throw new Error(resp?.message || '加入收藏失敗')
      isFavorite.value = true
    } else {
      const resp = await favRemove(rid, uid)
      if (!removeFavOK(resp)) throw new Error(resp?.message || '移除收藏失敗')
      isFavorite.value = false
    }
  } catch (err) {
    isFavorite.value = prev
    if (err?.status === 401) {
      alert('請先登入再使用收藏功能')
      localStorage.setItem('redirectAfterLogin', route.fullPath)
      router.push('/member/login')
    } else {
      alert(err?.message || '操作失敗，請稍後再試')
    }
  } finally {
    favBusy.value = false
  }
}
</script>

<style scoped>
/* 最外層容器 */
.header-container {
  position: relative;
  display: flex;
  align-items: stretch;
  border-radius: 24px;
  overflow: hidden;
  width: 100%;
  min-height: 150px;
  background: #ccc;
}

/* 動態背景漸層層 */
.header-bg {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}

/* 漸層背景：使用 CSS 變數動態注入 */
.header-container::before {
  content: "";
  position: absolute;
  inset: 0;
  background: var(--recipe-header-gradient-pc);
  /* default PC 漸層 */
  z-index: 1;
}

/* 文字 */
.header-gradient {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 32px 40px;
  background: transparent;
  color: #fff;
  position: relative;
  z-index: 2;
  /* 確保文字在元素之上 */
}

/* 標題本體：移除下邊距、可截斷 */
.header-title {
  margin: 0;                  /* 移除下邊距，避免造成不對齊 */
  line-height: 1.2;
  min-width: 0;               /* 讓 ellipsis 生效 */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;    /* 長標題以 … 截斷 */
}

/* 標題 + 收藏：同列且垂直置中 */
.header-title-row {
  display: flex;
  align-items: center;   /* 與蔬菜內頁一致：垂直置中 */
  gap: 8px;
  margin-bottom: 12px;   /* 原本 h1 的下間距移到這裡 */
  flex-wrap: nowrap;     /* 避免愛心被擠到下一行 */
}

/* 描述文字 */
.header-desc {
  font-size: 1.1rem;
  margin-bottom: 28px;
  opacity: 0.93;
  font-size: 16px;
}

/* 資訊列：時間、份量、難度 */
.header-info {
  display: flex;
  gap: 28px;
  font-size: 1rem;
  align-items: center;
  margin-top: 8px;
  font-size: 16px;
}

/* 每個資訊項目 */
.header-info span {
  display: flex;
  align-items: center;
  gap: 6px;
}

/* 右側圖片 */
.header-image {
  flex: 1;
  object-fit: cover;
  width: 100%;
  min-width: 250px;
  max-width: 400px;
  position: relative;
  z-index: 0;
  /* 圖片最底層 */
  border-top-right-radius: 24px;
  border-bottom-right-radius: 24px;
}

/* 收藏按鈕（與 VeggieMainInfoCard 一致：白色圓底、灰框） */
.favorite-button {
  background: #fff;
  border: 1.5px solid #ddd;
  border-radius: 50%;
  padding: 4px;
  width: 36px;
  height: 36px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.favorite-button:hover {
  border-color: #aaa;
}

/* 心形 icon 尺寸一致 */
.heart-icon {
  width: 18px;
  height: 18px;
  display: block;
}

/* 手機版樣式調整 */
@media (max-width: 768px) {
  .header-container {
    flex-direction: column;
    border-radius: 16px;
  }

  .header-gradient {
    padding: 24px 16px;
    border-radius: 0;
  }

  .header-image {
    border-radius: 0 0 16px 16px;
    min-width: 120px;
    max-width: 100%;
    height: 180px;
  }

  /* 漸層改為上下方向 */
  .header-container::before {
    background: var(--recipe-header-gradient-mobile);
    /* mobile 漸層 */
  }

  .header-title-row {
    gap: 8px;
  }
}
</style>
