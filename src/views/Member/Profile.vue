<template>
  <div class="profile-page-wrapper">
    <div class="member-profile-page">
      <!-- 尚未登入時的顯示區塊 -->
      <div v-if="!isLoggedIn" class="not-logged-in-container">
        <div class="not-logged-in-card">
          <h2>請先登入</h2>
          <p>您尚未登入，請先登入以查看您的會員資料。</p>
          <RouterLink to="/member/login" class="btn-login">前往登入</RouterLink>
        </div>
      </div>

      <!-- 登入後的會員中心主要內容 -->
      <div v-else class="member-center-container">
        <!-- 左側選單 -->
        <div class="sidebar">
        <!-- 會員中心標題 -->
        <div class="member-center-title">
          <h1>會員中心</h1>
        </div>

        <!-- 頭像區域 -->
        <div class="avatar-section">
          <div class="avatar-circle">
            <img :src="userAvatar" alt="使用者頭像" class="user-avatar" />
          </div>
        </div>

        <!-- 選單項目 -->
        <nav class="menu-nav">
          <button
            :class="['menu-item', { active: activeTab === 'profile' }]"
            @click="setActiveTab('profile')"
          >
            個人資訊
          </button>

          <button
            :class="['menu-item', { active: activeTab === 'food-collection' }]"
            @click="setActiveTab('food-collection')"
          >
            食譜收藏
          </button>

          <button
            :class="[
              'menu-item',
              { active: activeTab === 'veggie-collection' },
            ]"
            @click="setActiveTab('veggie-collection')"
          >
            蔬菜收藏
          </button>

          <button
            :class="['menu-item', { active: activeTab === 'track-alerts' }]"
            @click="setActiveTab('track-alerts')"
          >
            到價追蹤
          </button>
        </nav>

        <!-- 登出按鈕 -->
        <div class="logout-section">
          <button class="logout-btn" @click="handleLogout">登出</button>
        </div>
      </div>

      <!-- 右側內容區域 -->
      <div class="content-area">
        <!-- 個人資訊頁面 -->
        <div v-if="activeTab === 'profile'" class="profile-content">
          <h2 class="section-title">個人資訊</h2>

          <form @submit.prevent="updateProfile" class="profile-form">
            <!-- 姓名與電話 -->
            <div class="form-row">
              <div class="form-group">
                <label for="name">姓名</label>
                <input
                  type="text"
                  id="name"
                  v-model="profileData.name"
                  class="form-input"
                  placeholder="請輸入姓名"
                />
              </div>

              <div class="form-group">
                <label for="phone">電話</label>
                <input
                  type="tel"
                  id="phone"
                  v-model="profileData.phone"
                  class="form-input"
                  placeholder="請輸入電話號碼"
                />
              </div>
            </div>

            <!-- Email -->
            <div class="form-group full-width">
              <label for="email">Email</label>
              <input
                type="email"
                id="email"
                v-model="profileData.email"
                class="form-input"
                placeholder="請輸入電子郵件"
                readonly
                disabled
              />
            </div>

            <!-- 偏好設定 -->
            <div class="form-group full-width">
              <label for="favoriteRecipeCategory">偏好食譜類別</label>
              <select
                id="favoriteRecipeCategory"
                v-model="profileData.favoriteRecipeCategory"
                class="form-select"
                @change="handleRecipeCategoryChange"
              >
                <option value="">請選擇飲食偏好</option>
                <option value="vegetarian">素食</option>
                <option value="vegan">純素</option>
                <option value="omnivore">雜食</option>
                <option value="keto">生酮飲食</option>
                <option value="low-carb">低碳水化合物</option>
              </select>
            </div>

            <!-- 蔬菜季節偏好 -->
            <div class="form-group full-width">
              <label for="favoriteFruitVeggieCategory">偏好蔬果類別</label>
              <select
                id="favoriteFruitVeggieCategory"
                v-model="profileData.favoriteFruitVeggieCategory"
                class="form-select"
                @change="handleVeggieCategoryChange"
              >
                <option value="">請選擇季節偏好</option>
                <option value="spring">春季</option>
                <option value="summer">夏季</option>
                <option value="autumn">秋季</option>
                <option value="winter">冬季</option>
                <option value="all">全年</option>
              </select>
            </div>

            <!-- 收貨地址 -->
            <div class="form-group full-width">
              <label for="address">收貨地址</label>
              <input
                type="text"
                id="address"
                v-model="profileData.address"
                class="form-input"
                placeholder="請輸入收貨地址"
              />
            </div>

            <!-- 修改密碼連結 -->
            <div class="password-link">
              <RouterLink
                to="/member/change-password"
                class="change-password-link"
              >
                修改密碼 >
              </RouterLink>
            </div>

            <!-- 儲存按鈕 -->
            <div class="form-actions">
              <button type="submit" class="save-btn" :disabled="isSaving">
                {{ isSaving ? "儲存中..." : "儲存變更" }}
              </button>
            </div>
          </form>
        </div>

        <!-- 食譜收藏頁面 -->
        <div
          v-else-if="activeTab === 'food-collection'"
          class="food-collection-content"
        >
          <h2 class="section-title">食譜收藏清單</h2>

          <!-- 引用模組化的收藏元件 -->
          <Favorites ref="favoritesRef" />
        </div>

        <!-- 蔬菜收藏頁面 -->
        <div
          v-else-if="activeTab === 'veggie-collection'"
          class="veggie-collection-content"
        >
          <h2 class="section-title">食材收藏清單</h2>

          <!-- 引用模組化的蔬菜收藏元件 -->
          <VeggieFav ref="veggieFavRef" />
        </div>

        <!-- 其他頁面內容 -->
        <div v-else class="other-content">
          <h2 class="section-title">{{ getTabTitle() }}</h2>
          <div class="coming-soon">
            <p>此功能正在開發中，敬請期待！</p>
          </div>
        </div>
      </div>
    </div>
    </div>

    <!-- Footer - 固定在底部 -->
    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/user.js";
import { memberApi } from "@/api/member.js";

// 引入模組化元件
import Favorites from "./6424/favorites.vue";
import VeggieFav from "./6424/VeggieFav.vue";
import Footer from "@/components/Footer.vue";

// 引入 logo 圖片
import logoImg from "@/assets/logo.png";

const router = useRouter();
const userStore = useUserStore();

// 登入狀態
const isLoggedIn = computed(() => userStore.isAuthenticated);
const username = computed(() => userStore.userName || "使用者");

// 當前選中的標籤
const activeTab = ref("profile");

// 儲存狀態
const isSaving = ref(false);

// 個人資料表單數據 (對應後端 MemberInfoVo schema)
const profileData = ref({
  name: "",
  phone: "",
  email: "",
  favoriteRecipeCategory: "", // 對應 foodPreference
  favoriteFruitVeggieCategory: "", // 對應 seasonPreference
  address: "",
});

// 收藏相關數據
const activeFilter = ref("all");
const collectionFilters = [
  { id: "all", label: "全部" },
  { id: "vegetarian", label: "素食" },
  { id: "hot", label: "熱門" },
  { id: "quick", label: "快炒" },
];

// 假資料 - 收藏的食譜
const collectionRecipes = ref([
  {
    id: 1,
    name: "蕃茄炒蛋",
    cookTime: "15分鐘",
    difficulty: "簡單",
    category: "quick",
    image: "/images/recipes/tomato-egg.jpg",
  },
  {
    id: 2,
    name: "蔬菜湯",
    cookTime: "30分鐘",
    difficulty: "簡單",
    category: "vegetarian",
    image: "/images/recipes/vegetable-soup.jpg",
  },
  {
    id: 3,
    name: "涼拌小黃瓜",
    cookTime: "20分鐘",
    difficulty: "普通",
    category: "vegetarian",
    image: "/images/recipes/cucumber-salad.jpg",
  },
]);

// 計算篩選後的收藏食譜
const filteredCollectionRecipes = computed(() => {
  if (activeFilter.value === "all") {
    return collectionRecipes.value;
  }
  return collectionRecipes.value.filter(
    (recipe) => recipe.category === activeFilter.value
  );
});

// 預設頭像（使用 FRESHLOG logo）
const userAvatar = ref(logoImg);

// 子元件 refs
const favoritesRef = ref(null);
const veggieFavRef = ref(null);

// 設定活動標籤
const setActiveTab = (tab) => {
  activeTab.value = tab;

  // 當切換到收藏頁面時，重新載入數據
  if (tab === "food-collection" && favoritesRef.value) {
    favoritesRef.value.loadFavorites();
  } else if (tab === "veggie-collection" && veggieFavRef.value) {
    veggieFavRef.value.loadVeggieFavorites();
  }
};

// 取得標籤標題
const getTabTitle = () => {
  const titles = {
    "food-collection": "食譜收藏",
    "veggie-collection": "蔬菜收藏",
    "track-alerts": "到價追蹤",
  };
  return titles[activeTab.value] || "個人資訊";
};

// 監聽下拉選單變化
const handleRecipeCategoryChange = (event) => {
  console.log("🔄 偏好食譜類別變更:", event.target.value);
  console.log("📋 完整 profileData:", profileData.value);
};

const handleVeggieCategoryChange = (event) => {
  console.log("🔄 偏好蔬果類別變更:", event.target.value);
  console.log("📋 完整 profileData:", profileData.value);
};

// 更新個人資料
const updateProfile = async () => {
  isSaving.value = true;

  try {
    console.log("📤 開始更新會員資料...", profileData.value);
    console.log("📤 userId:", userStore.userId);

    // 先儲存到 localStorage（即使 API 失敗也能保留資料）
    try {
      const storageKey = `userProfile_${userStore.userId}`;
      const dataToSave = JSON.stringify(profileData.value);
      localStorage.setItem(storageKey, dataToSave);
      console.log("✅ 資料已儲存到 localStorage");
      console.log("📦 儲存的 key:", storageKey);
      console.log("📦 儲存的資料:", dataToSave);

      // 驗證是否真的存進去了
      const savedData = localStorage.getItem(storageKey);
      console.log("✔️ 驗證 localStorage:", savedData ? "成功" : "失敗");
    } catch (storageError) {
      console.error("❌ localStorage 儲存失敗:", storageError);
    }

    // 準備更新資料（Email 不需要傳給後端，因為 API 不接受 email 更新）
    const updateData = {
      name: profileData.value.name,
      phone: profileData.value.phone,
      address: profileData.value.address,
      favoriteRecipeCategory: profileData.value.favoriteRecipeCategory,
      favoriteFruitVeggieCategory:
        profileData.value.favoriteFruitVeggieCategory,
    };

    // 呼叫 API 更新
    const response = await memberApi.updateMemberInfo(updateData);
    console.log("📥 API 完整回應:", response);

    // API 成功條件：code === '0000' 或 message === 'SUCCESS'
    if (
      response.data &&
      (response.data.code === "0000" || response.data.message === "SUCCESS")
    ) {
      console.log("✅ 會員資料更新成功（API + localStorage）");
      alert("個人資料更新成功！");
    } else {
      console.warn("⚠️ API 更新回應異常，但 localStorage 已儲存");
      console.warn("回應資料:", response.data);
      alert("資料已儲存（API 回應異常）");
    }
  } catch (error) {
    console.error("❌ API 更新失敗，但 localStorage 已儲存");
    console.error("錯誤詳情:", error);
    console.error("錯誤回應:", error.response?.data);
    alert("資料已儲存到本地（API 連線失敗）");
  } finally {
    isSaving.value = false;
  }
};

// 登出功能
const handleLogout = async () => {
  if (!confirm("確定要登出嗎？")) {
    return;
  }

  try {
    // 清除個人資料快取
    localStorage.removeItem(`userProfile_${userStore.userId}`);

    // 呼叫 Pinia store 的登出方法
    userStore.logout();

    // 清除本地存儲的其他相關資料
    localStorage.removeItem("redirectAfterLogin");

    // 導向登入頁面
    router.replace("/member/login");
  } catch (error) {
    console.error("登出失敗:", error);
    alert("登出失敗，請稍後再試");
  }
};

// 載入使用者資料
const loadUserData = async () => {
  try {
    console.log("📥 開始載入會員資料...");

    // 先從 localStorage 讀取（快速顯示）
    const cachedProfile = localStorage.getItem(
      `userProfile_${userStore.userId}`
    );
    if (cachedProfile) {
      profileData.value = JSON.parse(cachedProfile);
      console.log("✅ 從 localStorage 快速載入會員資料");
    }

    // 然後呼叫 API 取得最新資料（優先使用後端資料）
    try {
      const response = await memberApi.getMemberInfo();

      if (response.data && response.data.data) {
        const memberInfo = response.data.data;

        // 🔧 暫時方案：如果 API 回傳的偏好設定是 null，優先使用 localStorage 的值
        const savedPreferences = cachedProfile ? JSON.parse(cachedProfile) : {};

        profileData.value = {
          name: memberInfo.name || "",
          phone: memberInfo.phone || "",
          email: memberInfo.email || "",
          // 如果後端回傳 null，使用 localStorage 的值（後端暫時無法儲存這兩個欄位）
          favoriteRecipeCategory:
            memberInfo.favoriteRecipeCategory ||
            savedPreferences.favoriteRecipeCategory ||
            "",
          favoriteFruitVeggieCategory:
            memberInfo.favoriteFruitVeggieCategory ||
            savedPreferences.favoriteFruitVeggieCategory ||
            "",
          address: memberInfo.address || "",
        };

        // 儲存到 localStorage
        localStorage.setItem(
          `userProfile_${userStore.userId}`,
          JSON.stringify(profileData.value)
        );
        console.log("✅ 從 API 載入會員資料（偏好設定保留 localStorage 值）");
        console.log("📋 資料內容:", profileData.value);
        return;
      }
    } catch (apiError) {
      console.warn("⚠️ API 載入失敗，使用 localStorage:", apiError);
      // API 失敗時已經有 localStorage 的資料了，不需要額外處理
      if (cachedProfile) return;
    }

    // 如果沒有 localStorage，使用預設值
    if (!cachedProfile) {
      console.warn("⚠️ 沒有本地資料，使用預設值");
      profileData.value = {
        name: username.value || "",
        phone: "",
        email: "",
        favoriteRecipeCategory: "",
        favoriteFruitVeggieCategory: "",
        address: "",
      };
    }
  } catch (error) {
    console.error("❌ 載入使用者資料時發生錯誤:", error);
    // 最後的容錯處理
    const cachedProfile = localStorage.getItem(
      `userProfile_${userStore.userId}`
    );
    if (cachedProfile) {
      profileData.value = JSON.parse(cachedProfile);
    } else {
      profileData.value = {
        name: username.value || "",
        phone: "",
        email: "",
        favoriteRecipeCategory: "",
        favoriteFruitVeggieCategory: "",
        address: "",
      };
    }
  }
};

// 初始化
onMounted(() => {
  if (isLoggedIn.value) {
    loadUserData();
  }
});
</script>

<style scoped>
/* 外層容器 - 確保頁面至少佔據整個視窗高度 */
.profile-page-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f8f9fa;
}

/* 主要內容區域 - 自動擴展填滿剩餘空間 */
.member-profile-page {
  flex: 1;
  background-color: #f8f9fa;
}

/* 未登入狀態 */
.not-logged-in-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 20px;
}

.not-logged-in-card {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 400px;
}

.not-logged-in-card h2 {
  color: #2e7d32;
  margin-bottom: 16px;
}

.not-logged-in-card p {
  color: #666;
  margin-bottom: 24px;
}

.btn-login {
  background-color: #2e7d32;
  color: white;
  padding: 12px 24px;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.3s ease;
}

.btn-login:hover {
  background-color: #27682b;
}

/* 會員中心主要內容 */
.member-center-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  display: flex;
  gap: 0;
}

/* 左側選單 */
.sidebar {
  flex: 0 0 200px;
  background: #f0f8f0;
  border-radius: 12px 0 0 12px;
  padding: 0;
  overflow: hidden;
  border: 1px solid #e0e0e0;
  border-right: none;
  display: flex;
  flex-direction: column;
}

.member-center-title {
  background: #f0f8f0;
  color: #2e7d32;
  padding: 20px;
  text-align: center;
  border-bottom: none;
}

.member-center-title h1 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.avatar-section {
  padding: 20px;
  text-align: center;
  background: #f0f8f0;
}

.avatar-circle {
  width: 100%;
  height: auto;
  margin: 0 auto;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.user-avatar {
  width: 100%;
  height: auto;
  object-fit: contain;
  color: #2e7d32;
}

.menu-nav {
  background: #f0f8f0;
  padding: 0 0 0px 0;
  flex: 1;
}

.menu-item {
  width: 100%;
  padding: 15px 20px;
  border: none;
  background: transparent;
  text-align: center;
  font-size: 16px;
  color: #2e7d32;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 8px;
  font-weight: 500;
}

.menu-item:hover {
  background-color: rgba(46, 125, 50, 0.1);
}

.menu-item.active {
  background-color: #2e7d32;
  color: white;
  margin: 0 15px 8px 15px;
  border-radius: 25px;
}

/* 登出按鈕區域 */
.logout-section {
  padding: 20px;
  background: #f0f8f0;
  border-top: 1px solid rgba(46, 125, 50, 0.1);
}

.logout-btn {
  width: 100%;
  padding: 12px 20px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.logout-btn:hover {
  background-color: #d32f2f;
  transform: translateY(-1px);
}

/* 右側內容區域 */
.content-area {
  flex: 1;
  background: white;
  border-radius: 0 12px 12px 0;
  padding: 0;
  border: 1px solid #e0e0e0;
  border-left: none;
  overflow: visible;
  display: flex;
  flex-direction: column;
}

.section-title {
  background: transparent;
  margin: 0;
  padding: 30px 30px 20px 30px;
  font-size: 20px;
  font-weight: 600;
  color: #2e7d32;
  border: none;
}

.profile-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.profile-form {
  padding: 30px;
  flex: 1;
}

.form-row {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.form-group {
  flex: 1;
  margin-bottom: 20px;
}

.form-group.full-width {
  width: 100%;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

.form-input,
.form-select {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 16px;
  box-sizing: border-box;
  transition: border-color 0.3s ease;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #2e7d32;
}

.form-input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
  color: #999;
}

.form-select {
  background: white;
  cursor: pointer;
}

.password-link {
  margin: 20px 0;
}

.change-password-link {
  color: #2e7d32;
  text-decoration: none;
  font-size: 14px;
}

.change-password-link:hover {
  text-decoration: underline;
}

.form-actions {
  margin-top: 30px;
  text-align: right;
}

.save-btn {
  background-color: #2e7d32;
  color: white;
  padding: 12px 30px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.save-btn:hover:not(:disabled) {
  background-color: #27682b;
}

.save-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* 食譜收藏頁面樣式 */
.food-collection-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* 蔬菜收藏頁面樣式 */
.veggie-collection-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: visible;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .member-center-container {
    flex-direction: column;
    padding: 20px;
    gap: 20px;
  }

  .sidebar {
    flex: none;
    border-radius: 12px;
    border-right: 1px solid #e0e0e0;
  }

  .content-area {
    border-radius: 12px;
    border-left: 1px solid #e0e0e0;
  }

  .form-row {
    flex-direction: column;
    gap: 0;
  }

  .profile-form {
    padding: 20px;
  }

  .section-title {
    padding: 15px 20px;
    font-size: 18px;
  }

  /* 手機版登出按鈕 */
  .logout-section {
    padding: 15px;
  }

  .logout-btn {
    padding: 10px 16px;
    font-size: 14px;
  }
}
</style>
