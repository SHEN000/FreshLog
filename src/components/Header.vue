<template>
  <header class="header">
    <div class="header-inner">
      <RouterLink to="/" class="logo">
        <img src="/logo.png" alt="logo" />
      </RouterLink>

      <h1 class="site-title">食價登錄&nbsp;&nbsp;FreshLog</h1>

      <div v-if="!isMobile" class="nav-links">
        <RouterLink
          v-if="isConsumer"
          to="/"
          :class="{ active: isActive('/') }"
          class="nav-item"
          >首頁</RouterLink
        >
        <RouterLink
          v-if="isConsumer"
          to="/veggie/001"
          :class="{ active: isActive('/veggie/001') }"
          class="nav-item"
        >
          蔬菜內頁
        </RouterLink>
        <RouterLink
          v-if="isConsumer"
          to="/ai-recommendation"
          :class="{ active: isActive('/ai-recommendation') }"
          class="nav-item"
          >蔬菜資訊</RouterLink
        >
        <RouterLink
          v-if="isConsumer"
          to="/veggie"
          :class="{ active: isActive('/veggie') }"
          class="nav-item"
          >蔬菜資訊
        </RouterLink>
        <RouterLink
          v-if="isConsumer"
          to="/foodsafety"
          :class="{ active: isActive('/foodsafety') }"
          class="nav-item"
        >
          食安資訊
        </RouterLink>
        <RouterLink
          v-if="isFarmer"
          to="/farmer/crop-dashboard"
          :class="{ active: isActive('/farmer/crop-dashboard') }"
          class="nav-item"
          >農民儀表板</RouterLink
        >
      </div>

      <div class="search-container">
        <input
          type="text"
          placeholder="搜尋蔬果名稱、類別或營養成分..."
          class="search-input"
        />
        <img :src="magnifierIcon" class="search-icon" alt="搜尋" />
      </div>

      <RouterLink v-if="!isLoggedIn" to="/member/login" class="auth-button"
        >註冊/登入</RouterLink
      >
      <RouterLink v-else to="/member/profile" class="profile-button">
        <img src="@/assets/user-icon-white.png" alt="user" class="auth-icon" />
        個人中心
      </RouterLink>

      <!-- 手機版三條線 -->
      <button class="menu-icon" @click="toggleMenu" v-if="isMobile">☰</button>
    </div>

    <!-- 手機版展開選單 -->
    <div class="mobile-dropdown" v-if="showMenu && isMobile">
      <RouterLink
        v-if="isConsumer"
        to="/"
        :class="{ active: isActive('/') }"
        class="nav-item"
        >首頁</RouterLink
      >
      <RouterLink
        v-if="isConsumer"
        to="/veggie/001"
        :class="{ active: isActive('/veggie/001') }"
        class="nav-item"
      >
        蔬菜內頁
      </RouterLink>
      <RouterLink
        v-if="isConsumer"
        to="/ai-recommendation"
        :class="{ active: isActive('/ai-recommendation') }"
        class="nav-item"
      >
        AI 智慧推薦</RouterLink
      >
      <RouterLink
        v-if="isConsumer"
        to="/veggie"
        :class="{ active: isActive('/veggie') }"
        class="nav-item"
        >蔬菜資訊
      </RouterLink>
      <RouterLink
        v-if="isConsumer"
        to="/foodsafety"
        :class="{ active: isActive('/foodsafety') }"
        class="nav-item"
      >
        食安資訊</RouterLink
      >
      <RouterLink
        v-if="isFarmer"
        to="/farmer/crop-dashboard"
        :class="{ active: isActive('/farmer/crop-dashboard') }"
        class="nav-item"
        >農民儀表板</RouterLink
      >
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed, watch } from "vue";
import { useRoute, RouterLink, useRouter } from "vue-router";
import { useUserStore } from "@/store/user";
import magnifierIcon from "@/assets/magnifier-icon.png";

// 取得使用者狀態
const userStore = useUserStore();
const router = useRouter();
const route = useRoute();

// 是否登入
const isLoggedIn = computed(() => userStore.isAuthenticated);

// 使用者角色
const userRole = computed(() => userStore.userRole);
const isConsumer = computed(() => userRole.value === "consumer");
const isFarmer = computed(() => userRole.value === "farmer");

// 畫面狀態
const showMenu = ref(false);
const isMobile = ref(window.innerWidth <= 768); // 判斷是否為行動裝置（768px 為界線）

// 控制選單展開
function toggleMenu() {
  showMenu.value = !showMenu.value;
}

// 當跳轉頁面後自動關閉選單
function closeMenu() {
  showMenu.value = false;
}

// 控制點擊外部區域關閉選單
function handleClickOutside(event) {
  const menu = document.querySelector(".mobile-dropdown");
  const button = document.querySelector(".menu-icon");
  if (
    menu &&
    !menu.contains(event.target) &&
    button &&
    !button.contains(event.target)
  ) {
    showMenu.value = false;
  }
}

// 判斷裝置寬度
function handleResize() {
  isMobile.value = window.innerWidth <= 768;
}

// 設定使用者角色並儲存到 localStorageuser-section
const setRole = (role) => {
  userStore.setUserRole(role);
  localStorage.setItem("userRole", role);
};

// 登入後導回登入前頁面
const login = () => {
  isLoggedIn.value = true;
  if (!userRole.value) userRole.value = "consumer";

  const redirectPath = localStorage.getItem("redirectAfterLogin");
  if (redirectPath) {
    router.push(redirectPath);
    localStorage.removeItem("redirectAfterLogin");
  } else {
    router.push("/");
  }
};

// 判斷目前頁面
const isActive = (path) => {
  return route.path === path;
};

// 登出並清除所有登入資訊
const logout = () => {
  isLoggedIn.value = false;
  localStorage.removeItem("userToken");
  localStorage.removeItem("userRole");
  localStorage.removeItem("redirectAfterLogin");
  userStore.logout();
  router.push("/"); // 登出後導向首頁
};

// 記錄登入前位置與角色、控制 body scroll
onMounted(() => {
  // 確保每次進入頁面都會從 localStorage 讀取角色並更新狀態
  const storedRole = localStorage.getItem("userRole");
  if (storedRole && storedRole !== userStore.userRole) {
    userStore.setUserRole(storedRole); // 設定使用者角色
  }

  // 尚未登入時記錄頁面路徑
  if (!isLoggedIn.value) {
    const currentPath = router.currentRoute.value.fullPath;
    if (!currentPath.startsWith("/member/login")) {
      localStorage.setItem("redirectAfterLogin", currentPath);
    }
  }

  // 監聽視窗縮放
  window.addEventListener("resize", handleResize);

  // 監聽點擊外部關閉選單
  document.addEventListener("click", handleClickOutside);

  // 每次路徑跳轉後自動關閉選單
  router.afterEach(() => {
    closeMenu();
  });
});

// 移除 resize 監聽
onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
});

// 當角色變化時（例如從選擇視窗選擇完畢），恢復畫面捲動
watch(userRole, (newRole) => {
  if (newRole) {
    document.body.style.overflow = "auto";
  }
});
</script>

<style scoped>
.header {
  width: 100%;
  background-color: #ffffff;
  padding: 10px 0;

  position: sticky;
  /* 固定Header */
  top: 0;
  /* 從視窗頂端0px的位置開始黏住 */
  z-index: 1000;
  /* 讓它蓋在其他內容上面，不會被擋住 */
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 24px;
  gap: 20px;
  /* 每個項目間距都一致 */
  box-sizing: border-box;
}

/* 左側 LOGO + 標題 */
.logo-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* LOGO 圖片大小固定 */
.logo img {
  width: 48px;
  height: 40px;
}

/* 網站標題樣式 */
.site-title {
  font-size: 22px;
  font-weight: bold;
  color: #2e7d32;
}

/* 搜尋框樣式 */
.search-container {
  display: flex;
  align-items: center;
  background: #ffffff;
  border: 1px solid #ccc;
  border-radius: 9999px;
  /* 超大圓角 */
  padding: 4px 12px;
  width: 100%;
  max-width: 300px;
  /* 可以依需求調整 */
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

/* 放大鏡icon設定 */
.search-icon {
  width: 16px;
  /* 圖片大小 */
  height: 16px;
  margin-left: 8px;
  /* 與輸入框之間的距離 */
}

/* PC版主選單連結列 */
.nav-links {
  display: flex;
  gap: 10px;
  flex-grow: 1;
  justify-content: center;
  /* 置中排列 */

  @media (max-width: 768px) {
    .nav-links {
      display: none;
    }
  }
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

/* 搜尋、下拉、會員區 */
.actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* 會員中心樣式 */
.profile-button {
  display: inline-flex;
  align-items: center;
  /* 垂直置中 */
  justify-content: center;
  /* 水平置中 */

  gap: 8px;
  /* icon和文字之間的距離 */

  background-color: #2e7d32;
  color: white;

  padding: 8px 20px;
  border-radius: 9999px;
  /* 超圓角 */

  font-size: 16px;
  font-weight: 500;

  text-decoration: none;
  transition: background-color 0.3s ease;
  border: none;
  cursor: pointer;

  min-width: 90px;
  /* 按鈕最小寬度 */
}

.profile-button:hover {
  background-color: #27682b;
  /* hover時再深一點 */
}

.auth-icon {
  width: 20px;
  height: 20px;
}

/* 登入按鈕樣式 */
.auth-button {
  background-color: #2e7d32;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 16px;
  text-decoration: none;
  transition: background-color 0.3s ease;
}

.auth-button:hover {
  background-color: #2e7d32;
}

/* 三條線 icon 按鈕 */
.menu-icon {
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  display: block;
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

.region-wrapper {
  position: relative;
  display: inline-block;
  width: 100px;
  /* 可以依需要調整寬度 */
}
</style>
