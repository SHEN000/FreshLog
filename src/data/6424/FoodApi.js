import apiClient from "./Api";

// Mock 資料
const mockFoodsList = {
  code: "8008",
  message: "Success",
  data: [
    {
      foodId: "F001",
      name: "高麗菜",
      category: "蔬菜",
      price: 50,
      tag: "當季/新鮮/營養",
      description: "新鮮高麗菜，富含維生素C",
      image: "/images/cabbage.jpg",
      lastModifyDate: "2025-01-15",
      isRecommendation: true,
    },
    {
      foodId: "F002",
      name: "紅蘿蔔",
      category: "蔬菜",
      price: 35,
      tag: "護眼/抗氧化/維生素A",
      description: "有機紅蘿蔔，護眼明目",
      image: "/images/carrot.jpg",
      lastModifyDate: "2025-01-14",
      isRecommendation: false,
    },
    {
      foodId: "F003",
      name: "菠菜",
      category: "葉菜類",
      price: 45,
      tag: "補鐵/葉酸/營養",
      description: "新鮮菠菜，鐵質豐富",
      image: "/images/spinach.jpg",
      lastModifyDate: "2025-01-13",
      isRecommendation: true,
    },
    {
      foodId: "F004",
      name: "青花菜",
      category: "蔬菜",
      price: 60,
      tag: "抗氧化/維生素C/營養",
      description: "新鮮青花菜，營養豐富",
      image: "/images/broccoli.jpg",
      lastModifyDate: "2025-01-12",
      isRecommendation: true,
    },
    {
      foodId: "F005",
      name: "白蘿蔔",
      category: "根莖類",
      price: 25,
      tag: "清熱/利水/營養",
      description: "白蘿蔔，清熱利水",
      image: "/images/radish.jpg",
      lastModifyDate: "2025-01-11",
      isRecommendation: false,
    },
  ],
};

export const foodApi = {
  /**
   * 查詢食品列表 - 暫時使用 Mock 資料（因為 POST 403）
   */
  findFoodsList: async (params = {}) => {
    // 先嘗試真實 API，失敗則用 Mock
    try {
      console.log("🌐 嘗試真實 API - findFoodsList", params);

      const requestData = {
        category: params.category || "",
        subCategory: params.subCategory || "",
        name: params.name || "",
        nameEn: params.nameEn || "",
        priceMin: params.priceMin || 0,
        priceMax: params.priceMax || 999999,
        tag: params.tag || "",
        sort: params.sort || "",
      };

      const response = await apiClient.post("/food/findFoodsList", requestData);

      console.log("✅ 真實 API 成功:", response.data);
      return response.data;
    } catch (error) {
      console.warn("⚠️ 真實 API 失敗，使用 Mock 資料:", error.response?.status);

      // 模擬 API 延遲
      await new Promise((resolve) => setTimeout(resolve, 500));

      // 根據參數篩選 Mock 資料
      let filteredData = [...mockFoodsList.data];

      // 簡單的分類篩選
      if (params.category && params.category !== "all") {
        filteredData = filteredData.filter((item) =>
          item.category.includes(params.category)
        );
      }

      // 簡單的名稱搜尋
      if (params.name) {
        filteredData = filteredData.filter((item) =>
          item.name.toLowerCase().includes(params.name.toLowerCase())
        );
      }

      // 價格範圍篩選
      if (params.priceMin > 0 || params.priceMax < 999999) {
        filteredData = filteredData.filter(
          (item) =>
            item.price >= params.priceMin && item.price <= params.priceMax
        );
      }

      console.log("🎭 使用 Mock 資料，篩選後:", filteredData.length, "項目");

      return {
        code: "8008",
        message: "Success (Mock Data)",
        data: filteredData,
      };
    }
  },

  /**
   * 取得食品排序下拉選單 - 使用真 API
   */
  getFoodSortEnums: async () => {
    try {
      console.log("🌐 使用真實 API - getFoodSortEnums");

      const response = await apiClient.get("/food/getFoodSortEnums");

      console.log("✅ 排序選項成功:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ 取得排序選項失敗:", error);

      // 備用 Mock 排序選項
      console.log("🎭 使用備用排序選項");
      return {
        code: "8000",
        message: "Success (Fallback)",
        data: [
          { code: "seasonal", label: "產季由近到遠" },
          { code: "price_asc", label: "價格由低到高" },
          { code: "price_desc", label: "價格由高到低" },
          { code: "name_asc", label: "名稱 A-Z" },
          { code: "popular", label: "熱門度" },
        ],
      };
    }
  },

  /**
   * 回傳食品資訊 - 暫用 Mock 資料
   */
  findFoodData: async (foodId) => {
    try {
      console.log("🌐 嘗試真實 API - findFoodData:", foodId);

      const response = await apiClient.get("/food/findFoodData", {
        params: { foodId: foodId },
      });

      console.log("✅ 食品資料成功:", response.data);
      return response.data;
    } catch (error) {
      console.warn("⚠️ 真實 API 失敗，使用 Mock 資料");

      await new Promise((resolve) => setTimeout(resolve, 400));

      const mockFood = mockFoodsList.data.find(
        (item) => item.foodId === foodId
      );
      return {
        code: "8000",
        message: "Success (Mock Data)",
        data: mockFood || mockFoodsList.data[0],
      };
    }
  },
};
