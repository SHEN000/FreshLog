import { defineStore } from 'pinia';

// 定義名為 'user' 的 Pinia 狀態管理 store
export const useUserStore = defineStore('user', {
  state: () => ({
    // 根據 localStorage 判斷是否登入（是否有 token）
    // !! 轉成布林值
    isAuthenticated: !!localStorage.getItem('userToken'),
    // 使用者角色，預設為 consumer
    userRole: localStorage.getItem('userRole') || 'consumer',
    // 使用者詳細資訊，初始為空物件
    userInfo: {}
  }),
  actions: {
    // 設定登入狀態
    setIsAuthenticated(status) {
      this.isAuthenticated = status;
      if (status) {
        // 登入時寫入 token
        localStorage.setItem('userToken', 'sample-token');
      } else {
        // 登出時移除 token
        localStorage.removeItem('userToken');
      }
    },
    // 設定使用者角色，並同步至 localStorage
    setUserRole(role) {
      this.userRole = role;
      localStorage.setItem('userRole', role);
    },
    // 儲存使用者個人資料
    setUserInfo(info) {
      this.userInfo = info;
    },
     // 新增 logout：呼叫 setIsAuthenticated(false) 並清掉 username/userInfo
    logout() {
      this.setIsAuthenticated(false)
      this.userInfo = {}
      // 如果有存在 localStorage 的 username，要清就清：
      localStorage.removeItem('username')
    }
  }
});