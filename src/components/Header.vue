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
      <button class="mobile-search-btn mobile-only" @click="toggleMobileSearch">
        <img :src="magnifierIcon" class="search-icon" alt="搜尋" />
      </button>

      <!-- 手機搜尋 -->
      <div
        v-if="isMobile && mobileSearchMode"
        class="search-container mobile-only mobile-search"
        role="search"
        ref="searchWrap"
      >
        <input
          ref="mobileSearchInputRef"
          v-model="keyword"
          type="text"
          class="search-input"
          placeholder="搜尋蔬果或食譜名稱 ...."
          @focus="onFocus"
          @input="onType"
          @compositionstart="onCompStart"
          @compositionend="onCompEnd"
          @keydown.down.prevent="move(1)"
          @keydown.up.prevent="move(-1)"
          @keydown.enter.prevent="onEnter"
          aria-label="站內搜尋(手機)"
        />
        <img :src="magnifierIcon" class="search-icon" alt="搜尋" />
        <button
          class="mobile-clear-btn"
          @click="closeMobileSearch"
          aria-label="關閉搜尋"
        >
          ✕
        </button>

        <!-- 下拉清單（手機） -->
        <ul v-if="showDropdown" class="search-dd" role="listbox">
          <template v-if="suggestions.veggies.length">
            <li class="search-dd__group">蔬果</li>
            <li
              v-for="(s, i) in suggestions.veggies"
              :key="'m-veg@' + s.id + i"
              class="search-dd__item"
              :class="{ active: i === activeIndex }"
              role="option"
              @mousedown.prevent="applyAndGo(s, 'veggie')"
              @mouseenter="activeIndex = i"
            >
              {{ s.label }}
            </li>
          </template>

          <li
            v-if="suggestions.veggies.length && suggestions.recipes.length"
            class="search-dd__divider"
          ></li>

          <template v-if="suggestions.recipes.length">
            <li class="search-dd__group">食譜</li>
            <li
              v-for="(s, i) in suggestions.recipes"
              :key="'m-rec@' + s.id + i"
              class="search-dd__item"
              :class="{
                active: i + suggestions.veggies.length === activeIndex,
              }"
              role="option"
              @mousedown.prevent="applyAndGo(s, 'recipe')"
              @mouseenter="activeIndex = i + suggestions.veggies.length"
            >
              {{ s.label }}
            </li>
          </template>

          <li v-if="!flatList.length" class="search-dd__empty">沒有相符項目</li>
        </ul>
      </div>

      <RouterLink
        v-if="!isLoggedIn && !(isMobile && mobileSearchMode)"
        to="/member/login"
        class="auth-button"
        >註冊/登入
      </RouterLink>
      <RouterLink
        v-else-if="!(isMobile && mobileSearchMode)"
        to="/member/profile"
        class="profile-button"
      >
        <img src="@/assets/user-icon-white.png" alt="user" class="auth-icon" />
        <span>個人中心</span>
      </RouterLink>

      <!-- 手機版三條線 -->
      <button
        v-if="!mobileSearchMode"
        class="menu-icon mobile-only"
        @click="toggleMenu"
      >
        ☰
      </button>
    </div>

    <!-- 手機版展開選單 -->
    <div
      class="mobile-dropdown"
      v-if="showMenu && isMobile && !mobileSearchMode"
    >
      <RouterLink
        v-if="isConsumer"
        to="/"
        :class="{ active: isActive('/') }"
        class="nav-item"
        >首頁</RouterLink
      >

      <RouterLink
        v-if="isConsumer"
        to="/ai-recommendation"
        :class="{ active: isActive('/ai-recommendation') }"
        class="nav-item"
        >蔬菜列表</RouterLink
      >

      <RouterLink
        v-if="isConsumer"
        to="/veggie/F001"
        :class="{ active: isActive('/veggie/F001') }"
        class="nav-item"
      >
        蔬菜內頁</RouterLink
      >

      <RouterLink
        v-if="isConsumer"
        to="/recipes"
        :class="{ active: isActive('/recipes') }"
        class="nav-item"
        >食譜列表
      </RouterLink>

      <RouterLink
        v-if="isConsumer"
        to="/ai-recommendation/R001"
        :class="{ active: isActive('/ai-recommendation/R001') }"
        class="nav-item"
        >食譜內頁</RouterLink
      >

      <!-- 農民相關連結 -->
      <!-- <RouterLink v-if="isFarmer" to="/" :class="{ active: isActive('/') }" class="nav-item">首頁</RouterLink>
      <RouterLink v-if="isFarmer" to="/farmer/crop-dashboard" :class="{ active: isActive('/farmer/crop-dashboard') }"
        class="nav-item">農民儀表板</RouterLink> -->
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed, nextTick } from "vue";
import { useRoute, RouterLink, useRouter } from "vue-router";
import { useUserStore } from "@/store/user";
import magnifierIcon from "@/assets/magnifier-icon.png";
import indexData from "@/data/searchIndex.js";

const userStore = useUserStore();
const route = useRoute();
const router = useRouter();

const isLoggedIn = computed(() => userStore.isAuthenticated);
const userRole = computed(() => userStore.userRole);
const isConsumer = computed(() => userRole.value === "consumer");
const isFarmer = computed(() => userRole.value === "farmer");

// 手機搜尋模式 + 關鍵字 + ref
const mobileSearchMode = ref(false);
const mobileKeyword = ref("");
const mobileSearchInputRef = ref(null);

const showMenu = ref(false);
const isMobile = ref(window.innerWidth <= 768);

/** 共同 keyword：桌機與手機都用同一個字串 */
const keyword = ref("");
/** 下拉清單狀態 */
const searchWrap = ref(null);
const dropdownOpen = ref(false);
const isComposing = ref(false);
const activeIndex = ref(-1);

const norm = (s) =>
  (s || "").toString().toLowerCase().replace(/\s+/g, "").trim();

/** 建立建議清單（蔬果在上、食譜在下） */
const suggestions = computed(() => {
  const key = norm(keyword.value);
  if (!key) return { veggies: [], recipes: [] };

  const seen = new Set();

  const v = indexData.veggies
    .flatMap((vg) => {
      const hits = norm(vg.name).includes(key)
        ? [vg.name]
        : (vg.aliases || []).filter((a) => norm(a).includes(key));
      return hits.map((label) => ({ id: vg.id, label, type: "veggie" }));
    })
    .filter((s) => !seen.has(s.label) && (seen.add(s.label), true));

  const r = indexData.recipes
    .flatMap((rc) => {
      const hits = norm(rc.name).includes(key)
        ? [rc.name]
        : (rc.aliases || []).filter((a) => norm(a).includes(key));
      return hits.map((label) => ({ id: rc.id, label, type: "recipe" }));
    })
    .filter((s) => !seen.has(s.label) && (seen.add(s.label), true));

  return {
    veggies: v.slice(0, 5),
    recipes: r.slice(0, 5),
  };
});

/** 平展清單 */
const flatList = computed(() => [
  ...suggestions.value.veggies,
  ...suggestions.value.recipes,
]);

/** 是否顯示下拉 */
const showDropdown = computed(
  () => dropdownOpen.value && keyword.value.length > 0
);

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
  window.addEventListener("resize", handleResize);
  document.addEventListener("click", handleClickOutside);
  router.afterEach(closeMenu);
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
  max-width: 280px;
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
  gap: 10px;
  flex-grow: 1;
  justify-content: center;
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
  min-width: 120px;
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

.desktop-only {
  display: flex;
}

.mobile-only {
  display: none;
}

.mobile-search-btn {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
}

.mobile-clear-btn {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  padding: 4px;
  color: #666;
}

.mobile-search {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1001;
  background: white;
  border-bottom: 1px solid #ccc;
}

/* 搜尋下拉清單樣式 */
.search-dd {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-top: none;
  border-radius: 0 0 8px 8px;
  max-height: 300px;
  overflow-y: auto;
  z-index: 1002;
  list-style: none;
  margin: 0;
  padding: 0;
}

.search-dd__group {
  background: #f5f5f5;
  padding: 8px 12px;
  font-size: 12px;
  font-weight: bold;
  color: #666;
}

.search-dd__item {
  padding: 10px 12px;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
}

.search-dd__item:hover,
.search-dd__item.active {
  background: #f0f8ff;
}

.search-dd__divider {
  height: 1px;
  background: #ddd;
  margin: 4px 0;
}

.search-dd__empty {
  padding: 10px 12px;
  color: #999;
  font-style: italic;
}

@media (max-width: 768px) {
  .desktop-only {
    display: none !important;
  }

  .mobile-only {
    display: inline-flex !important;
    align-items: center;
  }

  .nav-links,
  .search-container:not(.mobile-search) {
    display: none !important;
  }

  .header-inner {
    justify-content: flex-start !important;
    padding: 0 12px !important;
    gap: 10px !important;
  }

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
