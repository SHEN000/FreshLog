<template>
  <header class="header">
    <div class="header-inner">
      <RouterLink to="/" class="logo">
        <img src="/logo.png" alt="logo" />
      </RouterLink>

      <!-- 桌機標題 -->
      <h1 class="site-title desktop-only">食價登錄&nbsp;&nbsp;FreshLog</h1>

      <!-- 手機標題 -->
      <h1 class="site-title mobile-only">食價登錄</h1>

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
          to="/recipes"
          :class="{ active: isActive('/recipes') }"
          class="nav-item"
          >食譜列表</RouterLink
        >

        <RouterLink
          v-if="isConsumer"
          to="/veggie/F001"
          :class="{ active: isActive('/veggie/F001') }"
          class="nav-item"
          >蔬菜內頁</RouterLink
        >
        <RouterLink
          v-if="isConsumer"
          to="/ai-recommendation"
          :class="{ active: isActive('/ai-recommendation') }"
          class="nav-item"
          >AI智慧推薦</RouterLink
        >
        <RouterLink
          v-if="isConsumer"
          to="/ai-recommendation/R001"
          :class="{ active: isActive('/ai-recommendation/R001') }"
          class="nav-item"
          >食譜內頁</RouterLink
        >

        <!-- 農民相關連結 -->
        <RouterLink
          v-if="isFarmer"
          to="/"
          :class="{ active: isActive('/') }"
          class="nav-item"
          >首頁</RouterLink
        >
        <RouterLink
          v-if="isFarmer"
          to="/farmer/crop-dashboard"
          :class="{ active: isActive('/farmer/crop-dashboard') }"
          class="nav-item"
          >農民儀表板</RouterLink
        >
      </div>

      <div class="search-container desktop-only">
        <input
          type="text"
          placeholder="搜尋蔬果名稱、類別或營養成分..."
          class="search-input"
        />
        <img :src="magnifierIcon" class="search-icon" alt="搜尋" />
      </div>

      <!-- 手機搜尋icon -->
      <button class="mobile-search-btn mobile-only">
        <img :src="magnifierIcon" class="search-icon" alt="搜尋" />
      </button>

      <RouterLink v-if="!isLoggedIn" to="/member/login" class="auth-button"
        >註冊/登入</RouterLink
      >
      <RouterLink v-else to="/member/profile" class="profile-button">
        <img :src="userIcon" alt="user" class="auth-icon" />
        <span>個人中心</span>
      </RouterLink>

      <!-- 手機版三條線 -->
      <button class="menu-icon mobile-only" @click="toggleMenu">☰</button>
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

      <!--手機版食譜列表連結 -->
      <RouterLink
        v-if="isConsumer"
        to="/recipes"
        :class="{ active: isActive('/recipes') }"
        class="nav-item"
        >食譜列表</RouterLink
      >

      <RouterLink
        v-if="isConsumer"
        to="/veggie"
        :class="{ active: isActive('/veggie') }"
        class="nav-item"
        >蔬菜資訊</RouterLink
      >
      <RouterLink
        v-if="isConsumer"
        to="/veggie/F001"
        :class="{ active: isActive('/veggie/F001') }"
        class="nav-item"
        >蔬菜內頁</RouterLink
      >
      <RouterLink
        v-if="isConsumer"
        to="/ai-recommendation"
        :class="{ active: isActive('/ai-recommendation') }"
        class="nav-item"
        >AI 智慧推薦</RouterLink
      >
      <RouterLink
        v-if="isConsumer"
        to="/ai-recommendation/R001"
        :class="{ active: isActive('/ai-recommendation/R001') }"
        class="nav-item"
        >食譜內頁</RouterLink
      >
      <RouterLink
        v-if="isConsumer"
        to="/foodsafety"
        :class="{ active: isActive('/foodsafety') }"
        class="nav-item"
        >食安資訊</RouterLink
      >

      <!-- 農民相關連結 -->
      <RouterLink
        v-if="isFarmer"
        to="/"
        :class="{ active: isActive('/') }"
        class="nav-item"
        >首頁</RouterLink
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
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import { useRoute, RouterLink, useRouter } from "vue-router";
import { useUserStore } from "@/store/user";
import magnifierIcon from "@/assets/magnifier-icon.png";
import userIcon from "@/assets/user-icon-white.png";

const userStore = useUserStore();
const router = useRouter();
const route = useRoute();

const isLoggedIn = computed(() => userStore.isAuthenticated);
const userRole = computed(() => userStore.userRole);
const isConsumer = computed(() => userRole.value === "consumer");
const isFarmer = computed(() => userRole.value === "farmer");

const showMenu = ref(false);
const isMobile = ref(window.innerWidth <= 768);

const toggleMenu = () => {
  showMenu.value = !showMenu.value;
};
const closeMenu = () => {
  showMenu.value = false;
};

const isActive = (path) => route.path === path;

const handleResize = () => {
  isMobile.value = window.innerWidth <= 768;
};

const handleClickOutside = (event) => {
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
};

onMounted(() => {
  window.addEventListener("resize", handleResize);
  document.addEventListener("click", handleClickOutside);
  router.afterEach(closeMenu);

  // 監聽點擊外部關閉選單
  document.addEventListener("click", handleClickOutside);

  // 每次路徑跳轉後自動關閉選單
  router.afterEach(() => {
    closeMenu();
  });
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
  document.removeEventListener("click", handleClickOutside);
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
  max-width: 1320px;
  margin: 0 auto;
  padding: 0 12px;
  gap: 10px;
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
  max-width: 280px;
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
  min-width: 120px;
}

.profile-button:hover {
  background-color: #27682b;
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
  border-radius: 9999px;
  font-size: 14px;
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

.desktop-only {
  display: flex;
}
.mobile-only {
  display: none;
}

@media (max-width: 768px) {
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
  .nav-links,
  .search-container {
    display: none !important;
  }

  /* 手機版：從左到右原始排列 */
  .header-inner {
    justify-content: flex-start !important;
    padding: 0 12px !important;
    gap: 10px !important;
  }

  /* 手機 LOGO 縮小 */
  .logo img {
    width: 36px !important;
    height: auto !important;
  }

  /* 手機標題字型 */
  .site-title.mobile-only {
    font-size: 18px !important;
    margin: 0 !important;
  }

  /* 手機：將放大鏡按鈕往右群組推 */
  .mobile-search-btn {
    background: none;
    border: none;
    padding: 0;
    margin-left: auto;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
  }

  /* 手機 註冊/登入 & 會員中心 按鈕 */
  .auth-button.mobile-only,
  .profile-button.mobile-only {
    padding: 6px 12px !important;
    font-size: 14px !important;
    margin-left: 8px;
  }

  /* 手機 三條線 */
  .menu-icon.mobile-only {
    font-size: 24px !important;
    margin-left: 8px;
    color: #686868;
  }
}
</style>
