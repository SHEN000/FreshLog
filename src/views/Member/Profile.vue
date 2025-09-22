<template>
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
              />
            </div>

            <!-- 偏好設定 -->
            <div class="form-group full-width">
              <label for="foodPreference">偏好設定</label>
              <select
                id="foodPreference"
                v-model="profileData.foodPreference"
                class="form-select"
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
              <label for="seasonPreference">蔬菜季節</label>
              <select
                id="seasonPreference"
                v-model="profileData.seasonPreference"
                class="form-select"
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
                to="/member/forgot-password"
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

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/user.js";

// 引入模組化元件
import Favorites from "./6424/favorites.vue";
import VeggieFav from "./6424/VeggieFav.vue";

const router = useRouter();
const userStore = useUserStore();

// 登入狀態
const isLoggedIn = computed(() => userStore.isAuthenticated);
const username = computed(() => userStore.userName || "使用者");

// 當前選中的標籤
const activeTab = ref("profile");

// 個人資料表單數據
const profileData = ref({
  name: "",
  phone: "",
  email: "",
  foodPreference: "",
  seasonPreference: "",
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

// 預設頭像
const userAvatar = ref("/images/default-avatar.png");

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

// 更新個人資料
const updateProfile = async () => {
  isSaving.value = true;

  try {
    // 這裡可以加入 API 呼叫來更新使用者資料
    await new Promise((resolve) => setTimeout(resolve, 1000)); // 模擬 API 請求

    alert("個人資料更新成功！");
  } catch (error) {
    console.error("更新失敗:", error);
    alert("更新失敗，請稍後再試");
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
    // 這裡可以加入 API 呼叫來載入使用者資料
    // 目前使用假資料示範
    profileData.value = {
      name: username.value || "",
      phone: "",
      email: "",
      foodPreference: "",
      seasonPreference: "",
      address: "",
    };
  } catch (error) {
    console.error("載入使用者資料失敗:", error);
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
.member-profile-page {
  min-height: 100vh;
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
  padding: 25px 20px;
  text-align: center;
  background: #f0f8f0;
}

.avatar-circle {
  width: 70px;
  height: 70px;
  margin: 0 auto;
  border-radius: 50%;
  background: white;
  border: 2px solid #2e7d32;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.user-avatar {
  width: 60%;
  height: 60%;
  object-fit: cover;
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
  overflow: hidden;
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
