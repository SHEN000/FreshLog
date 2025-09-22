<template>
  <header class="header">
    <div class="header-inner" :class="{ searching: isMobile && mobileSearchMode }">
      <RouterLink to="/" class="logo">
        <img src="/logo.png" alt="logo" />
      </RouterLink>

      <!-- 桌機標題 -->
      <h1 class="site-title desktop-only">食價登錄&nbsp;&nbsp;FreshLog</h1>

      <!-- 手機標題（當進入搜尋模式時可隱藏，這裡用 CSS 控制） -->
      <h1 class="site-title mobile-only" :class="{ 'hidden-when-search': mobileSearchMode }">食價登錄</h1>


      <div v-if="!isMobile" class="nav-links">
        <RouterLink v-if="isConsumer" to="/" :class="{ active: isActive('/') }" class="nav-item">首頁</RouterLink>

        <RouterLink v-if="isConsumer" to="/ai-recommendation" :class="{ active: isActive('/ai-recommendation') }"
          class="nav-item">蔬菜列表</RouterLink>

        <RouterLink v-if="isConsumer" to="/veggie/F001" :class="{ active: isActive('/veggie/F001') }" class="nav-item">
          蔬菜內頁</RouterLink>

        <RouterLink v-if="isConsumer" to="/recipes" :class="{ active: isActive('/recipes') }" class="nav-item">食譜列表
        </RouterLink>

        <RouterLink v-if="isConsumer" to="/ai-recommendation/R001"
          :class="{ active: isActive('/ai-recommendation/R001') }" class="nav-item">食譜內頁</RouterLink>

        <!-- 農民相關連結 -->
        <!-- <RouterLink v-if="isFarmer" to="/" :class="{ active: isActive('/') }" class="nav-item">首頁</RouterLink>
        <RouterLink v-if="isFarmer" to="/farmer/crop-dashboard" :class="{ active: isActive('/farmer/crop-dashboard') }"
          class="nav-item">農民儀表板</RouterLink> -->
      </div>

      <!-- 桌機搜尋 -->
      <div class="search-container desktop-only" ref="searchWrap">
        <input v-model="keyword" type="text" placeholder="搜尋蔬果或食譜名稱 ...." class="search-input"  @focus="onFocus" @input="onType"
          @compositionstart="onCompStart" @compositionend="onCompEnd" @keydown.down.prevent="move(1)"
          @keydown.up.prevent="move(-1)" @keydown.enter.prevent="onEnter" aria-label="站內搜尋" />
        <img :src="magnifierIcon" class="search-icon" alt="搜尋" />

        <!-- 下拉清單（桌機） -->
        <ul v-if="showDropdown" class="search-dd" role="listbox">
          <template v-if="suggestions.veggies.length">
            <li class="search-dd__group">蔬果</li>
            <li v-for="(s, i) in suggestions.veggies" :key="'veg@' + s.id + i" class="search-dd__item"
              :class="{ active: i === activeIndex }" role="option" @mousedown.prevent="applyAndGo(s, 'veggie')"
              @mouseenter="activeIndex = i">{{ s.label }}</li>
          </template>

          <li v-if="suggestions.veggies.length && suggestions.recipes.length" class="search-dd__divider"></li>

          <template v-if="suggestions.recipes.length">
            <li class="search-dd__group">食譜</li>
            <li v-for="(s, i) in suggestions.recipes" :key="'rec@' + s.id + i" class="search-dd__item"
              :class="{ active: (i + suggestions.veggies.length) === activeIndex }" role="option"
              @mousedown.prevent="applyAndGo(s, 'recipe')" @mouseenter="activeIndex = i + suggestions.veggies.length">{{
                s.label }}</li>
          </template>

          <li v-if="!flatList.length" class="search-dd__empty">沒有相符項目</li>
        </ul>
      </div>


      <!-- 手機搜尋icon，點擊開啟搜尋模式 -->
      <button class="mobile-search-btn mobile-only" @click="openMobileSearch" v-if="!mobileSearchMode">
        <img :src="magnifierIcon" class="search-icon" alt="搜尋" />
      </button>

      <!-- 手機搜尋 -->

      <div v-if="isMobile && mobileSearchMode" class="search-container mobile-only mobile-search" role="search"
        ref="searchWrap">
        <input ref="mobileSearchInputRef" v-model="keyword" type="text" class="search-input"
          placeholder="搜尋蔬果或食譜名稱 ...."  @focus="onFocus" @input="onType" @compositionstart="onCompStart" @compositionend="onCompEnd"
          @keydown.down.prevent="move(1)" @keydown.up.prevent="move(-1)" @keydown.enter.prevent="onEnter"
          aria-label="站內搜尋(手機)" />
        <img :src="magnifierIcon" class="search-icon" alt="搜尋" />
        <button class="mobile-clear-btn" @click="closeMobileSearch" aria-label="關閉搜尋">✕</button>


        <!-- 下拉清單（手機） -->
        <ul v-if="showDropdown" class="search-dd" role="listbox">
          <template v-if="suggestions.veggies.length">
            <li class="search-dd__group">蔬果</li>
            <li v-for="(s, i) in suggestions.veggies" :key="'m-veg@' + s.id + i" class="search-dd__item"
              :class="{ active: i === activeIndex }" role="option" @mousedown.prevent="applyAndGo(s, 'veggie')"
              @mouseenter="activeIndex = i">{{ s.label }}</li>
          </template>

          <li v-if="suggestions.veggies.length && suggestions.recipes.length" class="search-dd__divider"></li>

          <template v-if="suggestions.recipes.length">
            <li class="search-dd__group">食譜</li>
            <li v-for="(s, i) in suggestions.recipes" :key="'m-rec@' + s.id + i" class="search-dd__item"
              :class="{ active: (i + suggestions.veggies.length) === activeIndex }" role="option"
              @mousedown.prevent="applyAndGo(s, 'recipe')" @mouseenter="activeIndex = i + suggestions.veggies.length">{{
              s.label }}</li>
          </template>

          <li v-if="!flatList.length" class="search-dd__empty">沒有相符項目</li>
        </ul>
      </div>

      <RouterLink v-if="!isLoggedIn && !(isMobile && mobileSearchMode)" to="/member/login" class="auth-button">註冊/登入
      </RouterLink>
      <RouterLink v-else-if="!(isMobile && mobileSearchMode)" to="/member/profile" class="profile-button">
        <img src="@/assets/user-icon-white.png" alt="user" class="auth-icon" />
        <span>個人中心</span>
      </RouterLink>

      <!-- 手機版三條線 -->
      <button v-if="!mobileSearchMode" class="menu-icon mobile-only" @click="toggleMenu">☰</button>
    </div>

    <!-- 手機版展開選單 -->
    <div class="mobile-dropdown" v-if="showMenu && isMobile && !mobileSearchMode">
      <RouterLink v-if="isConsumer" to="/" :class="{ active: isActive('/') }" class="nav-item">首頁</RouterLink>

      <RouterLink v-if="isConsumer" to="/ai-recommendation" :class="{ active: isActive('/ai-recommendation') }"
        class="nav-item">蔬菜列表</RouterLink>

      <RouterLink v-if="isConsumer" to="/veggie/F001" :class="{ active: isActive('/veggie/F001') }" class="nav-item">
        蔬菜內頁</RouterLink>

      <RouterLink v-if="isConsumer" to="/recipes" :class="{ active: isActive('/recipes') }" class="nav-item">食譜列表
      </RouterLink>

      <RouterLink v-if="isConsumer" to="/ai-recommendation/R001"
        :class="{ active: isActive('/ai-recommendation/R001') }" class="nav-item">食譜內頁</RouterLink>

      <!-- 農民相關連結 -->
      <!-- <RouterLink v-if="isFarmer" to="/" :class="{ active: isActive('/') }" class="nav-item">首頁</RouterLink>
      <RouterLink v-if="isFarmer" to="/farmer/crop-dashboard" :class="{ active: isActive('/farmer/crop-dashboard') }"
        class="nav-item">農民儀表板</RouterLink> -->
    </div>
  </header>
</template>

<script setup>

import { ref, onMounted, onBeforeUnmount, computed, nextTick } from 'vue'
import { useRoute, RouterLink, useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import magnifierIcon from '@/assets/magnifier-icon.png'
import indexData from '@/data/searchIndex.js' 

const userStore = useUserStore()
const route = useRoute()
const router = useRouter()

const isLoggedIn = computed(() => userStore.isAuthenticated)
const userRole = computed(() => userStore.userRole)
const isConsumer = computed(() => userRole.value === 'consumer')
const isFarmer = computed(() => userRole.value === 'farmer')

// 手機搜尋模式 + 關鍵字 + ref
const mobileSearchMode = ref(false)
const mobileKeyword = ref('')
const mobileSearchInputRef = ref(null)

const showMenu = ref(false)
const isMobile = ref(window.innerWidth <= 768)

/** 共同 keyword：桌機與手機都用同一個字串 */
const keyword = ref('')
/** 下拉清單狀態 */
const searchWrap = ref(null)
const dropdownOpen = ref(false)
const isComposing = ref(false)
const activeIndex = ref(-1)

const norm = s => (s || '').toString().toLowerCase().replace(/\s+/g, '').trim()

/** 建立建議清單（蔬果在上、食譜在下） */
const suggestions = computed(() => {
  const key = norm(keyword.value)
  if (!key) return { veggies: [], recipes: [] }

  const seen = new Set()

  const v = indexData.veggies
    .flatMap(vg => {
      const hits =
        norm(vg.name).includes(key) ? [vg.name] :
        (vg.aliases || []).filter(a => norm(a).includes(key))
      return hits.map(label => ({ id: vg.id, label, type: 'veggie' }))
    })
    .filter(s => !seen.has(s.label) && (seen.add(s.label), true))

  const r = indexData.recipes
    .flatMap(rc => {
      const hits =
        norm(rc.name).includes(key) ? [rc.name] :
        (rc.aliases || []).filter(a => norm(a).includes(key))
      return hits.map(label => ({ id: rc.id, label, type: 'recipe' }))
    })
    .filter(s => !seen.has(s.label) && (seen.add(s.label), true))

  return {
    veggies: v.slice(0, 5),
    recipes: r.slice(0, 5)
  }
})

/** 平展清單 */
const flatList = computed(() => [...suggestions.value.veggies, ...suggestions.value.recipes])

/** 是否顯示下拉 */
const showDropdown = computed(() =>
  dropdownOpen.value && keyword.value.length > 0
)

// 輸入中即時開啟與重設高亮
function onType(e) {
  if (e?.target) keyword.value = e.target.value 
  dropdownOpen.value = true
  activeIndex.value = flatList.value.length ? 0 : -1
}

// 聚焦就顯示
function onFocus() {
  if (keyword.value.length > 0) dropdownOpen.value = true
}

// IME 組字流程
function onCompStart() { isComposing.value = true }
function onCompEnd(e) {
  isComposing.value = false
  keyword.value = e.target?.value ?? keyword.value
  dropdownOpen.value = true
  activeIndex.value = flatList.value.length ? 0 : -1
}
function move (step) {
  const n = flatList.value.length
  if (!n) return
  activeIndex.value = (activeIndex.value + step + n) % n
}
function onEnter () {
  if (activeIndex.value < 0) return
  const item = flatList.value[activeIndex.value]
  if (!item) return
  applyAndGo(item, item.type)
}


/* 點選或 Enter 後導頁 */
function applyAndGo (item, type) {
  dropdownOpen.value = false
  const path = type === 'veggie' ? `/veggie/${item.id}` : `/ai-recommendation/${item.id}`
  // 清空輸入＋（手機）關閉搜尋模式
  const isM = isMobile.value && mobileSearchMode.value
  keyword.value = ''
  if (isM) closeMobileSearch()
  router.push(path)
}


/* 點擊外部關閉清單 */
function onClickOutside (e) {
  if (!searchWrap.value) return
  if (!searchWrap.value.contains(e.target)) dropdownOpen.value = false
}
onMounted(() => document.addEventListener('click', onClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', onClickOutside))

/* 開啟/關閉手機搜尋 */
const openMobileSearch = async () => {
  mobileSearchMode.value = true
  showMenu.value = false
  await nextTick()
  activeIndex.value = -1
  dropdownOpen.value = false
  const el = mobileSearchInputRef.value
  if (el) el.focus()
}
const closeMobileSearch = () => {
  mobileSearchMode.value = false
  keyword.value = ''
  dropdownOpen.value = false
  activeIndex.value = -1
}

const toggleMenu = () => { showMenu.value = !showMenu.value }
const closeMenu = () => { showMenu.value = false }


const isActive = (path) => route.path === path

const handleResize = () => {
  isMobile.value = window.innerWidth <= 768
  if (!isMobile.value) {
    mobileSearchMode.value = false
    mobileKeyword.value = ''
  }
}

const handleClickOutside = (event) => {
  const menu = document.querySelector('.mobile-dropdown')
  const button = document.querySelector('.menu-icon')
  if (menu && !menu.contains(event.target) && button && !button.contains(event.target)) {
    showMenu.value = false
  }
}

// 手機搜尋相關函數
const toggleMobileSearch = () => {
  mobileSearchMode.value = !mobileSearchMode.value;
  if (mobileSearchMode.value) {
    nextTick(() => {
      mobileSearchInputRef.value?.focus();
    });
  } else {
    keyword.value = "";
  }
};

const closeMobileSearch = () => {
  mobileSearchMode.value = false;
  keyword.value = "";
  dropdownOpen.value = false;
};

const onFocus = () => {
  dropdownOpen.value = true;
};

const onType = () => {
  if (!isComposing.value) {
    dropdownOpen.value = true;
    activeIndex.value = -1;
  }
};

const onCompStart = () => {
  isComposing.value = true;
};

const onCompEnd = () => {
  isComposing.value = false;
  onType();
};

const move = (direction) => {
  const total = flatList.value.length;
  if (total === 0) return;

  activeIndex.value = Math.max(
    0,
    Math.min(total - 1, activeIndex.value + direction)
  );
};

const onEnter = () => {
  if (activeIndex.value >= 0 && flatList.value[activeIndex.value]) {
    const item = flatList.value[activeIndex.value];
    applyAndGo(item, item.type);
  }
};

const applyAndGo = (item, type) => {
  keyword.value = "";
  dropdownOpen.value = false;

  if (type === "veggie") {
    router.push(`/veggie/${item.id}`);
  } else if (type === "recipe") {
    router.push(`/ai-recommendation/${item.id}`);
  }

  if (mobileSearchMode.value) {
    closeMobileSearch();
  }
};

onMounted(() => {



  window.addEventListener('resize', handleResize)
  document.addEventListener('click', handleClickOutside)
  router.afterEach(closeMenu)

  // 每次路徑跳轉後自動關閉選單與手機搜尋
  router.afterEach(() => {
    closeMenu()
    closeMobileSearch()
  })
})


onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.header {
  width: 100%;
  background-color: #ffffff;
  padding: 10px 0;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  max-width: 1320px;
  margin: 0 auto;
  padding: 0 12px;
  gap: 10px;
  box-sizing: border-box;
}

.logo img {
  width: 48px;
  height: 40px;
}

.site-title {
  font-size: 22px;
  font-weight: bold;
  color: #2e7d32;
}

.search-container {
  display: flex;
  align-items: center;
  background: #ffffff;
  border: 1px solid #ccc;
  border-radius: 9999px;
  padding: 4px 12px;
  width: 100%;


  max-width: 260px;
  box-sizing: border-box;
  position: relative;
}

.search-input {
  flex-grow: 1;
  border: none;
  outline: none;
  font-size: 14px;
  padding: 6px 8px;
  background: transparent;
}

.search-icon {
  width: 16px;
  height: 16px;
  margin-left: 8px;
}

.nav-links {
  display: flex;
  gap: 20px;
  flex-grow: 1;


  justify-content: left;

  @media (max-width: 768px) {
    .nav-links {
      display: none;
    }
  }

}

.nav-item {
  text-decoration: none;
  color: #333;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

.nav-item:hover,
.nav-item.active {
  background-color: #f0f0f0;
}

.profile-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background-color: #2e7d32;
  color: white;
  padding: 8px 20px;
  border-radius: 9999px;


  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  transition: background-color 0.3s ease;
  border: none;
  cursor: pointer;


  min-width: 80px;
}

.profile-button:hover {
  background-color: #27682b;
}

.auth-icon {
  width: 20px;
  height: 20px;
}

.auth-button {
  background-color: #2e7d32;
  color: white;
  padding: 8px 16px;
  border-radius: 9999px;
  font-size: 14px;
  text-decoration: none;
  transition: background-color 0.3s ease;
}

.auth-button:hover {
  background-color: #2e7d32;
}

.menu-icon {
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  display: block;
}

.mobile-dropdown {
  position: absolute;
  top: 60px;
  right: 10px;
  background: white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.mobile-dropdown a.active {
  background-color: #e0e0e0;
  border-radius: 4px;
}


.region-wrapper {
  position: relative;
  display: inline-block;
  width: 100px;
}


.desktop-only {
  display: flex;
}

.mobile-only {
  display: none;
}



/* 下拉清單 */
.search-dd{
  position: absolute;
  left: 0;
  right: 0;
  top: calc(100% + 6px);
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 8px 18px rgba(0,0,0,.06);
  z-index: 1000;
  max-height: 260px;
  overflow: auto;
  margin: 6px 0 0;
  padding: 6px 0;
  list-style: none;
}

.search-dd__group{
  padding: 8px 12px 4px;
  font-size: 12px;
  font-weight: 700;
  color: #475569;
}

.search-dd__divider{
  height: 1px;
  margin: 6px 0;
  background: #e5e7eb;
}

.search-dd__item{
  padding: 10px 12px;
  cursor: pointer;
}
.search-dd__item:hover,
.search-dd__item.active{
  background: #f4f7f5;
}

.search-dd__empty{
  padding: 10px 12px;
  color: #94a3b8;
}

@media (max-width: 768px) {
  .header {
    --m-search-min: 180px;
    --m-search-ideal: 70vw;
    --m-search-max: 250px;
  }

  .header-inner.searching {
    display: grid;
    grid-template-columns: auto max-content 1fr;
    align-items: center;
    column-gap: 8px;
  }

  /* 指定各元素所在欄位 */
  .header-inner.searching .logo {
    grid-column: 1;
  }

  .header-inner.searching .site-title.mobile-only {
    grid-column: 2;
    display: inline-flex !important;
    white-space: nowrap;
  }

  .header-inner.searching .mobile-search {
    grid-column: 3;
  }

  /* 手機搜尋欄：打開並吃滿右側欄位（不受桌機 max-width 限制） */
  .header-inner.searching .search-container.mobile-search {
    position: relative;
    display: inline-flex !important;
    width: 100%;
    max-width: 100%;
    min-width: 0;
    gap: 0;
    padding-right: 72px;
    overflow: visible; 
  }

  /* 清單顯示在頁面內容之上 */
  .search-dd {
    z-index: 2000;  
  }

  /* 輸入框：避免被 icon 蓋住 */
  .header-inner.searching .search-container.mobile-search .search-input {
    padding-right: 72px;
  }

  /* 放大鏡固定在右內側（X 的左邊） */
  .header-inner.searching .search-container.mobile-search .search-icon {
    position: absolute;
    right: 38px;
    top: 50%;
    transform: translateY(-50%);
    margin: 0;
    pointer-events: none;
  }

  /* X 固定在最右內側，保持可點擊 */
  .header-inner.searching .search-container.mobile-search .mobile-clear-btn {
    position: absolute;
    right: 1px;
    top: 50%;
    transform: translateY(-50%);
    width: 28px;
    height: 28px;
    display: grid;
    place-items: center;
    border: none;
    background: transparent;
    border-radius: 9999px;
    cursor: pointer;
    line-height: 1;
    padding: 0;
  }

  /* X 按下的觸覺反饋 */
  .header-inner.searching .search-container.mobile-search .mobile-clear-btn:active {
    background: rgba(0, 0, 0, .06);
  }

  /* 若你之前有定義 .hidden-when-search 讓標題隱藏，也能保險覆蓋一下 */
  .header-inner.searching .site-title.mobile-only.hidden-when-search {
    display: inline-flex !important;
  }

  /* X 按鈕（獨立新增，不會影響原樣式） */
  .mobile-clear-btn {
    border: none;
    background: transparent;
    font-size: 18px;
    line-height: 1;
    padding: 0 4px;
    cursor: pointer;
    color: #666;
  }

  /* 隱藏桌面元素 */

  .desktop-only {
    display: none !important;
  }



  /* 顯示手機元素 */

  .mobile-only {
    display: inline-flex !important;
    align-items: center;
  }


  /* 隱藏桌面版 nav-links、搜尋框 */
  .nav-links {
    display: none !important;
  }

  /* 手機 LOGO 縮小 */

  .logo img {
    width: 36px !important;
    height: auto !important;
  }

  .site-title.mobile-only {
    font-size: 18px !important;
    margin: 0 !important;
  }

  .mobile-search-btn {
    margin-left: auto;
  }

  .auth-button.mobile-only,
  .profile-button.mobile-only {
    padding: 6px 12px !important;
    font-size: 14px !important;
    margin-left: 8px;
  }

  .menu-icon.mobile-only {
    font-size: 24px !important;
    margin-left: 8px;
    color: #686868;
  }
}
</style>
