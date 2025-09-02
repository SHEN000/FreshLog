import axios from "axios";

const apiClient = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "/api" // 開發環境：使用代理
      : "https://freshlog-api.ttshow.tw/api", // 生產環境：直連新的 API 基礎 URL
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// debug log
if (import.meta.env.MODE === "development") {
  apiClient.interceptors.request.use((config) => {
    console.log(
      "📤 API Request:",
      config.method?.toUpperCase(),
      config.baseURL + config.url, // 顯示完整 URL 以便除錯
      config.data || config.params
    );
    return config;
  });

  apiClient.interceptors.response.use(
    (response) => {
      console.log(
        "📥 API Response:",
        response.status,
        response.config.baseURL + response.config.url, // 顯示完整 URL
        response.data
      );
      return response;
    },
    (error) => {
      console.error("❌ API Error:", {
        status: error.response?.status,
        url: error.config?.baseURL + error.config?.url,
        message: error.response?.data?.message || error.message,
        fullError: error.response?.data || error.message,
      });
      return Promise.reject(error);
    }
  );
}

// TODO: 未來要加入會員系統時，取消註解
/*
// 請求攔截器 - 添加認證 Token
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

// 響應攔截器 - 處理認證錯誤
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
*/

export default apiClient;
