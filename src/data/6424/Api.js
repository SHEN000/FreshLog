// src/services/api.js
import axios from "axios";

// 建立 axios 實例
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://43.199.27.51", // 你的 API 基礎網址
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 請求攔截器 (如果需要加入 token)
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("userToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 響應攔截器
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 未授權，可能需要重新登入
      localStorage.removeItem("userToken");
      window.location.href = "/member/login";
    }
    return Promise.reject(error);
  }
);

export default apiClient;
