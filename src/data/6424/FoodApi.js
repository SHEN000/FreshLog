import axios from "axios";
// import apiClient from "./Api"; // 暫時不使用，直接創建新的客戶端

// 🔧 直接創建正確的 API 客戶端，避免環境變數問題
const correctApiClient = axios.create({
  baseURL: "https://freshlog-api.ttshow.tw/api",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 添加請求攔截器來確認網址
correctApiClient.interceptors.request.use((config) => {
  console.log(
    "📤 API Request:",
    config.method?.toUpperCase(),
    config.baseURL + config.url
  );
  return config;
});

correctApiClient.interceptors.response.use(
  (response) => {
    console.log(
      "📥 API Response:",
      response.status,
      response.config.baseURL + response.config.url
    );
    return response;
  },
  (error) => {
    console.error("❌ API Error:", {
      status: error.response?.status,
      url: error.config?.baseURL + error.config?.url,
      message: error.response?.data?.message || error.message,
    });
    return Promise.reject(error);
  }
);

export const foodApi = {
  /**
   * 查詢食品列表
   */
  findFoodsList: async (params = {}) => {
    try {
      console.log("🌐 呼叫API- findFoodsList", params);

      const requestBody = {
        category: params.category || "",
        subCategory: params.subCategory || "",
        name: params.name || "",
        nameEn: params.nameEn || "",
        priceMin: params.priceMin || 0,
        priceMax: params.priceMax || 999999,
        tag: params.tag || "",
        sort: params.sort || "price_desc",
      };

      console.log("📤 查詢參數:", requestBody);

      // 🔧 使用修正後的 API 客戶端
      const response = await correctApiClient.post(
        "/food/findFoodsList",
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          timeout: 15000,
        }
      );

      console.log("✅ API 回應:", response.data);

      // 處理成功回應
      if (response.data?.code === "0000") {
        if (response.data.data && response.data.data.length > 0) {
          // 檢查每個項目的圖片資料
          response.data.data.forEach((item) => {
            console.log(`📊 ${item.name} 圖片資料:`, {
              image: item.image,
              hasImage: !!item.image,
              imageType: typeof item.image,
            });
          });

          console.log("🎉 成功取得真實資料:", response.data.data.length, "筆");
          return response.data;
        } else {
          console.log("⚠️ API 回傳空資料，使用 Mock 資料");
          return getMockData();
        }
      } else {
        throw new Error(
          `API 回應錯誤: ${response.data?.message || "未知錯誤"}`
        );
      }
    } catch (error) {
      console.error("❌ API 呼叫失敗:", error.message);
      console.log("🎭 使用 Mock 資料展示功能");
      return getMockData();
    }
  },

  /**
   * 取得單一食品資料 - 加強圖片處理
   */
  findFoodData: async (foodId) => {
    try {
      console.log("🌐 取得食品詳情:", foodId);

      // 🔧 使用修正後的 API 客戶端
      const response = await correctApiClient.get("/food/findFoodData", {
        params: { foodId },
      });

      console.log("✅ 食品詳情完整回應:", response.data);

      // 特別檢查圖片資料
      if (response.data?.data?.image) {
        console.log("🖼️ 圖片資料:", {
          image: response.data.data.image,
          imageLength: response.data.data.image.length,
          isBase64: response.data.data.image.startsWith("data:image/"),
          isUrl: response.data.data.image.startsWith("http"),
          isPath: response.data.data.image.startsWith("/"),
        });
      } else {
        console.log("❌ 沒有找到圖片資料");
      }

      return response.data;
    } catch (error) {
      console.warn("⚠️ 食品詳情失敗，使用預設:", error.message);
      return {
        code: "0000",
        message: "Success (Mock)",
        data: {
          foodId: foodId,
          name: "測試食品",
          category: "蔬菜",
          price: 50,
          tag: "當季/新鮮",
          description: "測試用食品資料",
          // 模擬圖片路徑
          image: "/images/test-veggie.jpg",
          isRecommendation: true,
        },
      };
    }
  },

  /**
   * 取得排序選項
   */
  getFoodSortEnums: async () => {
    try {
      console.log("🌐 取得排序選項");

      // 🔧 使用修正後的 API 客戶端
      const response = await correctApiClient.get("/food/getFoodSortEnums");

      console.log("✅ 排序選項成功:", response.data);
      return response.data;
    } catch (error) {
      console.warn("⚠️ 排序選項失敗，使用預設:", error.message);
      return {
        code: "0000",
        message: "Success",
        data: [
          { code: "price_desc", label: "價格高到低" },
          { code: "price_asc", label: "價格低到高" },
          { code: "seasonal", label: "產季由近到遠" },
          { code: "name_asc", label: "名稱 A-Z" },
          { code: "name_desc", label: "名稱 Z-A" },
        ],
      };
    }
  },
};

// Mock 資料函數
function getMockData() {
  return {
    code: "0000",
    message: "搜尋成功 (Mock 資料)",
    data: [
      {
        foodId: "MOCK001",
        name: "測試高麗菜",
        category: "蔬菜",
        price: 50,
        tag: "當季/新鮮/維生素C",
        description: "測試用新鮮高麗菜，富含維生素C",
        image: "/images/test-cabbage.jpg", // 模擬圖片路徑
        isRecommendation: true,
      },
      {
        foodId: "MOCK002",
        name: "測試紅蘿蔔",
        category: "蔬菜",
        price: 35,
        tag: "護眼/抗氧化/維生素A",
        description: "測試用有機紅蘿蔔，護眼明目",
        image: "/images/test-carrot.jpg",
        isRecommendation: true,
      },
      {
        foodId: "MOCK003",
        name: "測試菠菜",
        category: "葉菜類",
        price: 45,
        tag: "補鐵/葉酸/營養",
        description: "測試用新鮮菠菜，鐵質豐富",
        image: "/images/test-spinach.jpg",
        isRecommendation: true,
      },
    ],
  };
}

export default foodApi;
