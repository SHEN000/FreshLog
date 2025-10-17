<template>
  <div class="main-info-card">
    <!-- 手機版用的當季推薦徽章 -->
    <div class="mobile-badge">
      <img src="@/assets/season-badge.png" alt="當季推薦" />
    </div>

    <div class="left">
      <img :src="$img(veggie.image)" alt="蔬菜圖片" class="veggie-image" />
    </div>

    <div class="center">
      <div class="title-line">
        <h2 class="name">{{ veggie.name }}</h2>
        <span class="english-name">{{ veggie.nameEn }}</span>
        <button class="favorite-button" @click="toggleFavorite">
          <img :src="isFavorite ? redHeart : grayHeart" alt="收藏" class="heart-icon" />
        </button>
      </div>

      <div class="sub-info">{{ veggie.cookingSuggestions }}</div>

      <div class="price-warning">
        <div class="price-badge">最新均價：${{ veggie.displayPrice }}</div>
      </div>

      <!-- 動態警示文字 -->
      <div v-if="adviceText" :class="[
        'warning-text',
        diffPercent <= -20 ? 'warning-fall'
          : diffPercent >= 20 ? 'warning-rise'
            : ''
      ]">
        {{ adviceText }}
      </div>
    </div>

    <div class="right">
      <div class="date-text">數據日期：{{ formattedDate }}</div>
      <div class="season-badge">
        <img src="@/assets/season-badge.png" alt="當季推薦" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, toRefs, onMounted, watch } from 'vue'
import { priceTrendData } from '@/data/priceTrendData.js'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/store/user'

// 收藏按鈕的灰心與紅心
import grayHeart from '@/assets/icons/heart-gray.png'
import redHeart from '@/assets/icons/heart-red.png'

const props = defineProps({
  veggie: { type: Object, required: true },
})
const { veggie } = toRefs(props)

// 存取登入狀態與路由
const userStore = useUserStore()
const router = useRouter()
const route = useRoute()

const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')

function getAuthHeader() {
  const raw = localStorage.getItem('userToken') || ''
  if (!raw) return ''
  return `Bearer ${raw.replace(/^Bearer\s+/, '')}` // 避免重複的 Bearer
}
function getUserId() {
  return userStore.userId || Number(localStorage.getItem('userId')) || null
}
/** 先從 props 拿，拿不到就從路由 /veggie/:id 拿 */
function getFoodId() {
  const fromProp =
    veggie.value?.foodId ??
    veggie.value?.id ??
    veggie.value?.code ??
    null
  const fromRoute =
    route.params.id ||                                  // 你的路由用的是 :id
    route.query.foodId ||                               // 備用：?foodId=F001
    (route.path.match(/\/veggie\/([^/?#]+)/)?.[1]) ||   // 萬一路徑有變，用正則撈
    null
  return fromProp ?? fromRoute
}

function asAuth(token) {
  return token && token.includes('.') ? `Bearer ${token}` : token
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
    headers.set('token', auth.replace(/^Bearer\s+/, ''))
    headers.set('X-Auth-Token', auth.replace(/^Bearer\s+/, ''))
  }

  const res = await fetch(url, {
    method,
    headers,
    credentials: 'include',            
    body: body ? JSON.stringify(body) : undefined,
  })

  const text = await res.text()
  const data = text ? JSON.parse(text) : {}

  if (!res.ok) {
    const err = new Error(data?.message || `HTTP ${res.status}`)
    err.status = res.status
    throw err
  }
  return data
}

// 兩個實際呼叫
const favAdd = (foodId, userId) => apiFetch('POST', `/api/memberUser/favorites/food/${encodeURIComponent(foodId)}`, { query: { userId } })
const favRemove = (foodId, userId) => apiFetch('DELETE', `/api/memberUser/favorites/food/${encodeURIComponent(foodId)}`, { query: { userId } })

const CODE_OK = new Set(['0000', '0', 0])
const CODE_ALREADY_FAV = '2001'
const CODE_NOT_FOUND = '2002'

// 用清單端點初始化 / 同步收藏狀態
async function favStatus(foodId, userId) {
  // 修正：加入必填的 subCategory 參數
  const resp = await apiFetch(
    'GET',
    '/api/memberUser/favorites/food',
    { query: { subCategory: 'ALL', userId } }
  )
  console.log('🔍 檢查收藏狀態 API 回應:', resp)

  const raw  = resp?.data?.items ?? resp?.data ?? resp?.items ?? []
  const list = Array.isArray(raw) ? raw : []

  const isFav = list.some(it => {
    if (typeof it === 'string') return it === String(foodId)
    const v = it?.foodId ?? it?.value ?? it?.id
    return String(v) === String(foodId)
  })
  console.log(`✅ 蔬菜 ${foodId} 收藏狀態:`, isFav ? '已收藏' : '未收藏')
  return isFav
}

function addFavOK(resp) {
  const c = String(resp?.code ?? '')
  const m = String(resp?.message ?? '')
  // 加入收藏：0000 或 已收藏過(2001) 都視為成功
  return CODE_OK.has(c) || c === CODE_ALREADY_FAV || /success|成功|ok/i.test(m)
}

function removeFavOK(resp) {
  const c = String(resp?.code ?? '')
  const m = String(resp?.message ?? '')
  // 取消收藏：0000 或 不存在(2002) 都視為成功
  return CODE_OK.has(c) || c === CODE_NOT_FOUND || /success|成功|ok|移除|刪除/i.test(m)
}

// 把數據日期字串轉成 YYYY/MM/DD
const formattedDate = computed(() => {
  const raw = veggie.value.date
  if (!raw) return ''
  const d = new Date(raw)
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}/${mm}/${dd}`
})

// 初始值用 props 的 isFavorite 當「預設」，之後會被伺服器狀態覆蓋
const isFavorite = ref(!!veggie.value?.isFavorite)

// 防止連點
const favBusy = ref(false)


// 動時同步一次；之後只要登入狀態或路由/食材變了也重查
async function syncFavoriteFromServer() {
  if (!userStore.isAuthenticated) return
  const userId = getUserId()
  const foodId = getFoodId()
  if (!userId || !foodId) return
  const exists = await favStatus(foodId, userId)
  if (exists === true)  isFavorite.value = true
  if (exists === false) isFavorite.value = false
}

onMounted(syncFavoriteFromServer)
watch(
  [() => userStore.isAuthenticated, () => route.fullPath, () => veggie.value?.id ?? veggie.value?.foodId],
  syncFavoriteFromServer
)

async function toggleFavorite () {
  if (!userStore.isAuthenticated) {
    localStorage.setItem('redirectAfterLogin', route.fullPath)
    router.push('/member/login')
    return
  }
  if (favBusy.value) return
  favBusy.value = true

  const userId = getUserId()
  const foodId = getFoodId()
  if (!userId) { alert('找不到使用者資訊，請重新登入後再試。'); router.push('/member/login'); favBusy.value = false; return }
  if (!foodId) { alert('找不到食材 ID，無法收藏。'); favBusy.value = false; return }

  const prev = isFavorite.value
  isFavorite.value = !prev 

  try {
    if (!prev) {
      const resp = await favAdd(foodId, userId)
      console.log('📥 加入收藏 API 回應:', resp)
      if (!addFavOK(resp)) throw new Error(resp?.message || '加入收藏失敗')
      isFavorite.value = true
      alert('✅ 已加入收藏！')
    } else {
      const resp = await favRemove(foodId, userId)
      console.log('📥 取消收藏 API 回應:', resp)
      if (!removeFavOK(resp)) throw new Error(resp?.message || '移除收藏失敗')
      isFavorite.value = false
      alert('✅ 已取消收藏！')
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

// 取 30 天趨勢資料
const trend30 = computed(() => priceTrendData['30days'])

// 當前價格：最後一筆
const currentPrice = computed(() => {
  const a = trend30.value
  return a.length ? a[a.length - 1].price : NaN
})
// 一週前價格：往前 7 筆
const weekAgoPrice = computed(() => {
  const a = trend30.value
  const idx = a.length - 1 - 7
  return idx >= 0 ? a[idx].price : NaN
})

// 漲跌百分比
const diffPercent = computed(() => {
  const p0 = weekAgoPrice.value
  const p1 = currentPrice.value
  if (!p0) return NaN
  return ((p1 - p0) / p0) * 100
})

// 警示文字：±20% 才顯示
const adviceText = computed(() => {
  const d = diffPercent.value
  if (isNaN(d)) return ''
  if (d >= 20) return '價格飆漲超過 20%，建議選購替代品'
  if (d <= -20) return '價格超跌超過 20%，建議多加購買'
  return ''
})
</script>

<style scoped>
.main-info-card {
  display: flex;
  align-items: center;
  background: white;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  gap: 20px;
  position: relative;
}

/* PC版 */

/* 左側：圖片區塊固定寬度 */
.left {
  flex: 0 0 120px;
}

/* 蔬菜圖片 */
.veggie-image {
  width: 80%;
  height: auto;
  border-radius: 12px;
  background: #f0f8f0;
  padding: 15px;
}

/* 中間：主要文字資訊區 */
.center {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* 標題列：名稱 + 英文名 + 收藏按鈕 */
.title-line {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 中文名稱 */
.name {
  font-size: 22px;
  font-weight: 700;
  margin: 0;
}

/* 英文名稱 */
.english-name {
  font-size: 18px;
  font-weight: 700;
}

/* 收藏按鈕樣式 */
.favorite-button {
  background: #fff;
  border: 1.5px solid #ddd;
  border-radius: 50%;
  padding: 4px;
  width: 26px;
  height: 26px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.favorite-button:hover {
  border-color: #aaa;
}

/* 收藏圖示 */
.heart-icon {
  width: 13px;
  height: 13px;
  margin: 0;
  display: block;
}

.sub-info {
  font-size: 16px;
  color: #666;
}


/* 價格與警示列 */
.price-warning {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

/* 均價標籤 */
.price-badge {
  background: #ff9800;
  color: white;
  font-size: 14px;
  font-weight: bold;
  padding: 6px 16px;
  border-radius: 999px;
  display: inline-block;
}

/* 警示文字 */
.warning-text {
  font-weight: bold;
  font-size: 14px;
}

/* 新增：超跌 20% 時的文字顏色 */
.warning-fall {
  color: #8d6eff;
}

/* 新增：超漲 20% 時的文字顏色 */
.warning-rise {
  color: #ff5a5a;
}

/* 右側：桌機版顯示數據日期與徽章 */
.right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}

/* 當季徽章大小 */
.season-badge img {
  width: 100px;
}

/* 數據日期文字 */
.date-text {
  font-size: 14px;
  color: #888;
}

/* PC隱藏元素(手機版的徽章) */
.mobile-badge,
.mobile-show {
  display: none;
}


/* 手機版 */
@media (max-width: 768px) {

  /* 隱藏桌機版右側日期 */
  .date-text {
    display: none;
  }

  .main-info-card {
    flex-direction: row;
    align-items: flex-start;
    flex-wrap: wrap;
    padding: 16px;
    position: relative;
  }

  /* 圖片區縮小 */
  .left {
    width: 100px;
    flex: none;
  }

  .veggie-image {
    width: 100px;
  }

  .center {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .title-line {
    justify-content: flex-start;
  }

  .right {
    display: none;
  }

  /* 顯示手機版用徽章 */
  .mobile-badge {
    display: block;
    position: absolute;
    top: -30px;
    right: -20px;
    z-index: 10;
  }

  .mobile-badge img {
    width: 70px;
  }

  .mobile-show {
    display: inline;
  }

  .price-warning {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  .date-text {
    display: none;
  }

  .sub-info {
    font-size: 14px;
    color: #666;
  }

  .name {
    font-size: 22px;
    font-weight: 700;
    margin: 0;
  }

  .price-badge {
    background: #ff9800;
    color: white;
    font-size: 14px;
    font-weight: bold;
    padding: 6px 16px;
    border-radius: 999px;
    display: inline-block;
  }


  /* 警示文字 */
  .warning-text {
    font-weight: bold;
    font-size: 14px;
  }

  /* 新增：超跌 20% 時的文字顏色 */
  .warning-fall {
    color: #8d6eff;
  }

  /* 新增：超漲 20% 時的文字顏色 */
  .warning-rise {
    color: #ff5a5a;
  }

  .veggie-image {
    width: 90%;
    height: auto;
    border-radius: 12px;
    background: #f0f8f0;
    padding: 10px;
  }
}
</style>
