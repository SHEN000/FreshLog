import apiClient from "./Api";

// Mock 資料（擴充版）
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
    {
      foodId: "F006",
      name: "小白菜",
      category: "葉菜類",
      price: 30,
      tag: "當季/新鮮/維生素C",
      description: "新鮮小白菜，口感清脆",
      image: "/images/pakchoi.jpg",
      lastModifyDate: "2025-01-10",
      isRecommendation: true,
    },
    {
      foodId: "F007",
      name: "蘋果",
      category: "水果",
      price: 80,
      tag: "進口/新鮮/維生素",
      description: "進口蘋果，香甜可口",
      image: "/images/apple.jpg",
      lastModifyDate: "2025-01-09",
      isRecommendation: false,
    },
    {
      foodId: "F008",
      name: "番茄",
      category: "水果",
      price: 55,
      tag: "當季/茄紅素/營養",
      description: "新鮮番茄，富含茄紅素",
      image: "/images/tomato.jpg",
      lastModifyDate: "2025-01-08",
      isRecommendation: true,
    },
  ],
};

// Mock 排序選項
const mockSortEnums = {
  code: "8000",
  message: "Success",
  data: [
    { code: "seasonal", label: "產季由近到遠" },
    { code: "price_asc", label: "價格由低到高" },
    { code: "price_desc", label: "價格由高到低" },
    { code: "name_asc", label: "名稱 A-Z" },
    { code: "name_desc", label: "名稱 Z-A" },
    { code: "popular", label: "熱門度" },
    { code: "nutrition", label: "營養價值" },
  ],
};

export const foodApi = {
  /**
   * 查詢食品列表 - 暫時只用Mock資料（避免CORS錯誤）
   */
  findFoodsList: async (params = {}) => {
    console.log("🎭 使用Mock資料 - findFoodsList", params);

    // 模擬API延遲，讓體驗更真實
    await new Promise((resolve) => setTimeout(resolve, 600));

    // 根據參數篩選Mock資料
    let filteredData = [...mockFoodsList.data];

    // 分類篩選
    if (
      params.category &&
      params.category !== "all" &&
      params.category !== ""
    ) {
      filteredData = filteredData.filter((item) =>
        item.category.toLowerCase().includes(params.category.toLowerCase())
      );
      console.log(
        "🔍 分類篩選 '" + params.category + "' 後:",
        filteredData.length,
        "個項目"
      );
    }

    // 名稱搜尋
    if (params.name && params.name.trim() !== "") {
      const searchTerm = params.name.toLowerCase();
      filteredData = filteredData.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm) ||
          item.description.toLowerCase().includes(searchTerm) ||
          item.tag.toLowerCase().includes(searchTerm)
      );
      console.log(
        "🔍 名稱搜尋 '" + params.name + "' 後:",
        filteredData.length,
        "個項目"
      );
    }

    // 價格範圍篩選
    if (params.priceMin > 0 || params.priceMax < 999999) {
      filteredData = filteredData.filter(
        (item) => item.price >= params.priceMin && item.price <= params.priceMax
      );
      console.log(
        "🔍 價格篩選 $" + params.priceMin + "-$" + params.priceMax + " 後:",
        filteredData.length,
        "個項目"
      );
    }

    // 標籤篩選
    if (params.tag && params.tag.trim() !== "") {
      const tagTerm = params.tag.toLowerCase();
      filteredData = filteredData.filter((item) =>
        item.tag.toLowerCase().includes(tagTerm)
      );
      console.log(
        "🔍 標籤篩選 '" + params.tag + "' 後:",
        filteredData.length,
        "個項目"
      );
    }

    // 排序處理
    if (params.sort) {
      switch (params.sort) {
        case "price_asc":
          filteredData.sort((a, b) => a.price - b.price);
          console.log("🔀 價格由低到高排序");
          break;
        case "price_desc":
          filteredData.sort((a, b) => b.price - a.price);
          console.log("🔀 價格由高到低排序");
          break;
        case "name_asc":
          filteredData.sort((a, b) => a.name.localeCompare(b.name));
          console.log("🔀 名稱A-Z排序");
          break;
        case "name_desc":
          filteredData.sort((a, b) => b.name.localeCompare(a.name));
          console.log("🔀 名稱Z-A排序");
          break;
        case "popular":
          filteredData.sort((a, b) => b.isRecommendation - a.isRecommendation);
          console.log("🔀 熱門度排序");
          break;
        case "seasonal":
        default:
          // 預設：推薦的在前面，然後按日期排序
          filteredData.sort((a, b) => {
            if (a.isRecommendation !== b.isRecommendation) {
              return b.isRecommendation - a.isRecommendation;
            }
            return new Date(b.lastModifyDate) - new Date(a.lastModifyDate);
          });
          console.log("🔀 產季排序（推薦優先）");
      }
    }

    console.log("✅ 最終結果:", filteredData.length, "個項目");

    return {
      code: "8008",
      message: "Success (Mock Data)",
      data: filteredData,
    };
  },

  /**
   * 取得食品排序下拉選單
   */
  getFoodSortEnums: async () => {
    try {
      console.log("🌐 使用真實API - getFoodSortEnums");
      const response = await apiClient.get("/food/getFoodSortEnums");
      console.log("✅ 排序選項API成功:", response.data);
      return response.data;
    } catch (error) {
      console.warn("⚠️ 排序選項API失敗，使用Mock:", error.response?.status);

      await new Promise((resolve) => setTimeout(resolve, 300));
      console.log("🎭 使用Mock排序選項");
      return mockSortEnums;
    }
  },

  /**
   * 取得單一食品詳細資料
   */
  findFoodData: async (foodId) => {
    try {
      console.log("🌐 使用真實API - findFoodData:", foodId);
      const response = await apiClient.get("/food/findFoodData", {
        params: { foodId: foodId },
      });
      console.log("✅ 食品詳情API成功:", response.data);
      return response.data;
    } catch (error) {
      console.warn("⚠️ 食品詳情API失敗，使用Mock:", error.response?.status);
      // mock data
      // 模擬延遲
      await new Promise((resolve) => setTimeout(resolve, 400));

      // 從Mock資料中找對應的食品
      const mockFood = mockFoodsList.data.find(
        (item) => item.foodId === foodId
      );

      console.log("🎭 使用Mock食品詳情:", mockFood?.name || "未找到");

      return {
        code: "8000",
        message: "Success (Mock Data)",
        data: mockFood || mockFoodsList.data[0],
      };
    }
  },

  /**
   * 測試API連接狀態
   */
  testConnection: async () => {
    try {
      console.log("🧪 測試API連接...");
      const response = await apiClient.get("/food/getFoodSortEnums");
      console.log("✅ API連接正常");
      return { success: true, message: "API連接正常" };
    } catch (error) {
      console.error("❌ API連接失敗:", error.message);
      return {
        success: false,
        message: `API連接失敗: ${error.response?.status || error.message}`,
      };
    }
  },
};

export default foodApi;
