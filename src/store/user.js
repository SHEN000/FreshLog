import { defineStore } from 'pinia';

// 定義名為 'user' 的 Pinia 狀態管理 store
export const useUserStore = defineStore('user', {
  state: () => ({
    // 根據 "localStorage" 判斷是否登入（是否有 token）
    isAuthenticated: localStorage.getItem('userToken') !== null,
    // 使用者角色，預設為 consumer
    userRole: localStorage.getItem('userRole') || 'consumer',
    // 使用者詳細資訊，初始為空物件
    userInfo: {}
  }),
  actions: {
    // 設定登入狀態
    setIsAuthenticated(status) {
      this.isAuthenticated = status;
      // 若為登入則存入 sample token，否則清空
      localStorage.setItem('userToken', status ? 'sample-token' : null);
    },
    // 設定使用者角色，並同步至 localStorage
    setUserRole(role) {
      this.userRole = role;
      localStorage.setItem('userRole', role);
    },
    // 儲存使用者個人資料
    setUserInfo(info) {
      this.userInfo = info;
    }
  }
});
