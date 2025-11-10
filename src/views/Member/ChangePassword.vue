<template>
  <div class="change-password-page">
    <!-- 尚未登入時的顯示區塊 -->
    <div v-if="!isLoggedIn" class="not-logged-in-container">
      <div class="not-logged-in-card">
        <h2>請先登入</h2>
        <p>您尚未登入，請先登入以修改密碼。</p>
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
            class="menu-item"
            @click="navigateTo('/member/profile')"
          >
            個人資訊
          </button>

          <button
            class="menu-item"
            @click="navigateTo('/member/profile')"
          >
            食譜收藏
          </button>

          <button
            class="menu-item"
            @click="navigateTo('/member/profile')"
          >
            蔬菜收藏
          </button>

          <button
            class="menu-item"
            @click="navigateTo('/member/profile')"
          >
            到價追蹤
          </button>
        </nav>

        <!-- 登出按鈕 -->
        <div class="logout-section">
          <button class="logout-btn" @click="handleLogout">登出</button>
        </div>
      </div>

      <!-- 右側內容區域 - 修改密碼 -->
      <div class="content-area">
        <div class="password-content">
          <h2 class="section-title">修改密碼</h2>

          <div class="password-form-container">
            <p class="form-description">請輸入舊密碼以驗證身份設定</p>

            <form @submit.prevent="handleSubmit" class="password-form">
              <!-- 舊密碼 -->
              <div class="form-group">
                <label for="oldPassword">舊密碼</label>
                <input
                  type="password"
                  id="oldPassword"
                  v-model="formData.oldPassword"
                  class="form-input"
                  placeholder="請輸入舊密碼"
                  required
                />
              </div>

              <!-- 新密碼 -->
              <div class="form-group">
                <label for="newPassword">新密碼</label>
                <input
                  type="password"
                  id="newPassword"
                  v-model="formData.newPassword"
                  class="form-input"
                  placeholder="請輸入新密碼"
                  required
                />
              </div>

              <!-- 確認密碼 -->
              <div class="form-group">
                <label for="confirmPassword">確認密碼</label>
                <input
                  type="password"
                  id="confirmPassword"
                  v-model="formData.confirmPassword"
                  class="form-input"
                  placeholder="請再次輸入新密碼"
                  required
                />
              </div>

              <!-- 密碼規則說明與忘記密碼連結 -->
              <div class="password-hint-row">
                <p class="password-hint">
                  密碼須至少8字，含英文字母與數字，建議混合大小寫與符號。
                </p>
                <RouterLink to="/member/forgot-password" class="forgot-link">
                  忘記密碼？
                </RouterLink>
              </div>

              <!-- 按鈕區域 -->
              <div class="form-actions">
                <button
                  type="button"
                  class="cancel-btn"
                  @click="handleCancel"
                >
                  取消
                </button>
                <button
                  type="submit"
                  class="save-btn"
                  :disabled="isSaving"
                >
                  {{ isSaving ? "處理中..." : "儲存變更" }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Footer - 獨立在外層 -->
  <Footer />
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/user.js";
import { memberApi } from "@/api/member.js";
import Footer from "@/components/Footer.vue";

// 引入 logo 圖片
import logoImg from "@/assets/logo.png";

const router = useRouter();
const userStore = useUserStore();

// 登入狀態
const isLoggedIn = computed(() => userStore.isAuthenticated);

// Logo 頭像
const userAvatar = ref(logoImg);

// 儲存狀態
const isSaving = ref(false);

// 表單數據
const formData = ref({
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
});

// 導航到其他頁面
const navigateTo = (path) => {
  router.push(path);
};

// 取消按鈕
const handleCancel = () => {
  // 返回個人資訊頁面
  router.push("/member/profile");
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

// 提交表單
const handleSubmit = async () => {
  // 驗證密碼
  if (formData.value.newPassword !== formData.value.confirmPassword) {
    alert("新密碼與確認密碼不一致！");
    return;
  }

  // 驗證密碼強度
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
  if (!passwordRegex.test(formData.value.newPassword)) {
    alert("密碼須至少8字，含英文字母與數字");
    return;
  }

  isSaving.value = true;

  try {
    console.log("📤 準備修改密碼...");

    // 呼叫修改密碼 API
    const response = await memberApi.changePassword({
      oldPassword: formData.value.oldPassword,
      newPassword: formData.value.newPassword,
    });

    console.log("📥 API 完整回應:", response);

    // 檢查回應是否成功 (code === '0000' 表示成功)
    if (response.data && response.data.code === '0000') {
      console.log("✅ 密碼修改成功");
      alert("密碼修改成功！");

      // 清空表單
      formData.value = {
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      };

      // 返回個人資訊頁面
      router.push("/member/profile");
    } else {
      // API 回傳錯誤訊息
      console.warn("⚠️ API 回應異常:", response.data);
      const errorMessage = response.data?.message || "修改密碼失敗";
      alert(errorMessage);
    }
  } catch (error) {
    console.error("❌ 修改密碼失敗:", error);
    console.error("錯誤詳情:", error.response?.data);

    // 顯示錯誤訊息
    const errorMessage = error.response?.data?.message || "修改密碼失敗，請確認舊密碼是否正確";
    alert(errorMessage);
  } finally {
    isSaving.value = false;
  }
};
</script>

<style scoped>
.change-password-page {
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

.password-content {
  flex: 1;
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

.password-form-container {
  padding: 0 30px 30px 30px;
  flex: 1;
}

.form-description {
  color: #666;
  font-size: 14px;
  margin-bottom: 30px;
}

.password-form {
  max-width: 600px;
}

.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
  font-size: 16px;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 16px;
  box-sizing: border-box;
  transition: border-color 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #2e7d32;
}

.password-hint-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  gap: 20px;
}

.password-hint {
  color: #666;
  font-size: 13px;
  margin: 0;
  flex: 1;
}

.forgot-link {
  color: #2e7d32;
  text-decoration: none;
  font-size: 14px;
  white-space: nowrap;
  transition: color 0.3s ease;
}

.forgot-link:hover {
  color: #27682b;
  text-decoration: underline;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 30px;
}

.cancel-btn {
  background-color: white;
  color: #2e7d32;
  padding: 12px 30px;
  border: 2px solid #2e7d32;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn:hover {
  background-color: #f0f8f0;
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

  .password-form-container {
    padding: 0 20px 20px 20px;
  }

  .section-title {
    padding: 15px 20px;
    font-size: 18px;
  }

  .password-hint-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .form-actions {
    flex-direction: column;
    gap: 10px;
  }

  .cancel-btn,
  .save-btn {
    width: 100%;
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
