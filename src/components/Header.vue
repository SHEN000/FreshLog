<template>
    <header class="header">
        <!-- 左側 LOGO + 標題 + 搜尋 -->
        <div class="left-section">
            <RouterLink to="/" class="logo">
                <img src="/logo.png" alt="logo" />
            </RouterLink>
            <!-- 只有在非手機裝置顯示標題 -->
            <h1 class="site-title" v-if="!isMobile">食價登錄</h1>
            <input type="text" placeholder="搜尋..." class="search-input" />
        </div>

        <!-- 右側選單 -->
        <div class="right-section">
            <!-- PC版主選單：依角色顯示功能連結 -->
            <nav class="nav-links" v-if="!isMobile">
                <RouterLink v-if="isConsumer" to="/veggie" :class="{ active: isActive('/veggie') }" class="nav-item">
                    蔬菜資訊</RouterLink>
                <RouterLink v-if="isConsumer" to="/foodsafety" :class="{ active: isActive('/foodsafety') }"
                    class="nav-item">食安資訊</RouterLink>
                <RouterLink v-if="isConsumer" to="/recipes" :class="{ active: isActive('/recipes') }" class="nav-item">
                    食譜清單</RouterLink>
                <RouterLink v-if="isConsumer && isLoggedIn" to="/member/follows"
                    :class="{ active: isActive('/member/follows') }" class="nav-item">我的追蹤</RouterLink>
                <RouterLink v-if="isFarmer" to="/farmer/crop-dashboard"
                    :class="{ active: isActive('/farmer/crop-dashboard') }" class="nav-item">農民儀表板</RouterLink>
            </nav>

            <!-- 登入/註冊 或 會員中心 -->
            <div class="user-section">
                <RouterLink v-if="!isLoggedIn" to="/member/login" class="auth-button">登入</RouterLink>
                <!-- <RouterLink v-if="!isLoggedIn" to="/member/register" class="auth-button">註冊</RouterLink> -->
                <RouterLink v-else to="/member/profile"  :class="{ active: isActive('/member/profile'), 'nav-item': true }"
                >會員中心</RouterLink>
            </div>

            <!-- 三條線 menu icon（PC版/手機版通用） -->
            <button class="menu-icon" @click="toggleMenu" v-if="isMobile || !isMobile">☰</button>
        </div>

        <!-- PC版三條線展開的額外項目（目前為靜態） -->
        <div class="pc-dropdown" v-if="showMenu && !isMobile">
            <a href="#" class="nav-item">項目 1</a>
            <a href="#" class="nav-item">項目 2</a>
            <a href="#" class="nav-item">項目 3</a>
            <a href="#" class="nav-item">項目 4</a>
            <a href="#" class="nav-item">項目 5</a>
        </div>

        <!-- 手機版展開選單 -->
        <div class="mobile-dropdown" v-if="showMenu && isMobile">
            <RouterLink v-if="isConsumer" to="/veggie" :class="{ active: isActive('/veggie') }" class="nav-item">蔬菜資訊
            </RouterLink>
            <RouterLink v-if="isConsumer" to="/foodsafety" :class="{ active: isActive('/foodsafety') }"
                class="nav-item">食安資訊</RouterLink>
            <RouterLink v-if="isConsumer" to="/recipes" :class="{ active: isActive('/recipes') }" class="nav-item">食譜清單
            </RouterLink>
            <RouterLink v-if="isConsumer && isLoggedIn" to="/member/follows"
                :class="{ active: isActive('/member/follows') }" class="nav-item">我的追蹤</RouterLink>
            <RouterLink v-if="isFarmer" to="/farmer/crop-dashboard"
                :class="{ active: isActive('/farmer/crop-dashboard') }" class="nav-item">農民儀表板</RouterLink>
        </div>
    </header>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'
import { useRoute, RouterLink, useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'

// 取得使用者狀態
const userStore = useUserStore()
const router = useRouter()
const route = useRoute()

// 是否登入
const isLoggedIn = computed(() => userStore.isAuthenticated)

// 使用者角色
const userRole = computed(() => userStore.userRole)
const isConsumer = computed(() => userRole.value === 'consumer')
const isFarmer = computed(() => userRole.value === 'farmer')

// 畫面狀態
const showMenu = ref(false)
const isMobile = ref(window.innerWidth <= 768) // 判斷是否為行動裝置（768px 為界線）

// 控制選單展開
function toggleMenu() {
    showMenu.value = !showMenu.value
}

// 判斷裝置寬度
function handleResize() {
    isMobile.value = window.innerWidth <= 768
}

// 設定使用者角色並儲存到 localStorageuser-section 
const setRole = (role) => {
    userStore.setUserRole(role)
    localStorage.setItem('userRole', role)
}

// 登入後導回登入前頁面
const login = () => {
    isLoggedIn.value = true
    if (!userRole.value) userRole.value = 'consumer'

    const redirectPath = localStorage.getItem('redirectAfterLogin')
    if (redirectPath) {
        router.push(redirectPath)
        localStorage.removeItem('redirectAfterLogin')
    } else {
        router.push('/')
    }
}

// 判斷目前頁面
const isActive = (path) => {
    return route.path === path
}

// 登出並清除所有登入資訊
const logout = () => {
    isLoggedIn.value = false
    localStorage.removeItem('userToken')
    localStorage.removeItem('userRole')
    localStorage.removeItem('redirectAfterLogin')
    userStore.logout()
    router.push('/') // 登出後導向首頁
}

// 記錄登入前位置與角色、控制 body scroll
onMounted(() => {
    // 確保每次進入頁面都會從 localStorage 讀取角色並更新狀態
    const storedRole = localStorage.getItem('userRole');
    if (storedRole && storedRole !== userStore.userRole) {
        userStore.setUserRole(storedRole);  // 設定使用者角色
    }

    // 尚未登入時記錄頁面路徑
    if (!isLoggedIn.value) {
        const currentPath = router.currentRoute.value.fullPath;
        if (!currentPath.startsWith('/member/login')) {
            localStorage.setItem('redirectAfterLogin', currentPath);
        }
    }

    // 監聽視窗縮放
    window.addEventListener('resize', handleResize)
})

// 移除 resize 監聽
onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize)
})

// 當角色變化時（例如從選擇視窗選擇完畢），恢復畫面捲動
watch(userRole, (newRole) => {
    if (newRole) {
        document.body.style.overflow = 'auto'
    }
})
</script>


<style scoped>
/* 最外層 header 容器，左右排列並置中對齊，支援多行換行 */
.header {
    display: flex;
    justify-content: space-between; /* 左右兩側分開排列 */
    align-items: center; /* 垂直置中 */
    padding: 10px 16px;
    background-color: #f9f9f1;
    position: relative; /* 為 dropdown 定位做基礎 */
    flex-wrap: wrap; /* 小螢幕時允許換行 */
}

/* 左側 LOGO + 標題 + 搜尋欄 */
.left-section {
    display: flex;
    gap: 12px;
    align-items: center;
}

/* LOGO 圖片大小固定 */
.logo img {
    width: 40px;
    height: 40px;
}

/* 網站標題樣式 */
.site-title {
    font-size: 20px;
    font-weight: bold;
    color: #333;
}

/* 搜尋框樣式 */
.search-input {
    height: 20px;
    flex-grow: 1; /* 在剩餘空間自動擴展 */
    max-width: 120px;
    padding: 4px 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

/* 右側功能區域（選單 + 登入） */
.right-section {
    display: flex;
    align-items: center;
    gap: 12px;
}

/* PC版主選單連結列 */
.nav-links {
    display: flex;
    gap: 12px;
}

/* 共用導覽項目樣式 */
.nav-item {
    text-decoration: none;
    color: #333;
    padding: 8px 12px;
    border-radius: 4px;
    font-size: 16px;
    transition: background-color 0.3s ease;
}

/* 滑鼠移入或目前頁面：背景變淡灰 */
.nav-item:hover,
.nav-item.active {
    background-color: #f0f0f0;
}

/* 登入按鈕樣式 */
.auth-button {
    background-color: #59c2b9;
    color: white;
    padding: 8px 16px;
    border-radius: 4px;
    font-size: 16px;
    text-decoration: none;
    transition: background-color 0.3s ease;
}

.auth-button:hover {
    background-color: #59c2b9;
}

/* 三條線 icon 按鈕 */
.menu-icon {
    background: none;
    border: none;
    font-size: 30px;
    cursor: pointer;
    display: block;
}

/* PC版 dropdown 選單（靜態設計） */
.pc-dropdown {
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

.pc-dropdown a {
    text-decoration: none;
    color: #333;
    padding: 8px 12px;
    border-radius: 4px;
}

.pc-dropdown a:hover {
    background-color: #f0f0f0;
}

/* 手機版 dropdown 選單 */
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
</style>