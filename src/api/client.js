import axios from "axios";
import { useUserStore } from "@/store/user";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://freshlog-api.ttshow.tw";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const userStore = useUserStore();
    const token = userStore.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (import.meta.env.DEV) {
      console.log("📤 API Request:", {
        method: config.method?.toUpperCase(),
        url: config.baseURL + config.url,
        params: config.params,
        data: config.data,
      });
    }
    return config;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log("📥 API Response:", {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }
    return response;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      switch (status) {
        case 401:
          console.error("❌ 未授權，請重新登入");
          const userStore = useUserStore();
          userStore.logout();
          window.location.href = "/member/login";
          break;
        case 403:
          console.error("❌ 無權限訪問");
          break;
        case 404:
          console.error("❌ 請求的資源不存在");
          break;
        case 500:
          console.error("❌ 服務器錯誤");
          break;
        default:
          console.error("❌ API Error:", {
            status,
            message: data?.message || error.message,
            url: error.config?.url,
          });
      }
    } else if (error.request) {
      console.error("❌ 網絡錯誤，請檢查網絡連接");
    } else {
      console.error("❌ 請求配置錯誤:", error.message);
    }
    return Promise.reject(error);
  }
);

export const request = {
  get: (url, params = {}, config = {}) => {
    return apiClient.get(url, { params, ...config });
  },
  post: (url, data = {}, config = {}) => {
    return apiClient.post(url, data, config);
  },
  put: (url, data = {}, config = {}) => {
    return apiClient.put(url, data, config);
  },
  delete: (url, params = {}, config = {}) => {
    return apiClient.delete(url, { params, ...config });
  },
  patch: (url, data = {}, config = {}) => {
    return apiClient.patch(url, data, config);
  },
};

export default apiClient;
