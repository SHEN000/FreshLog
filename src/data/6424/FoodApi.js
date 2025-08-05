// src/services/foodApi.js
import apiClient from "./Api";

export const foodApi = {
  /**
   * 查詢食品列表
   * @param {Object} params - 查詢參數
   * @param {string} params.category - 食品主分類 (如: "醃菜品")
   * @param {string} params.subCategory - 食品子分類 (如: "水果")
   * @param {string} params.name - 食品中文名稱
   * @param {string} params.nameEn - 食品英文名稱
   * @param {number} params.priceMin - 最低價格
   * @param {number} params.priceMax - 最高價格
   * @param {string} params.tag - 標籤 (如: "超級名店")
   * @param {string} params.sort - 排序方式 (如: "price_desc")
   * @returns {Promise} API 回應
   */
  findFoodsList: async (params = {}) => {
    try {
      // 建立請求參數，過濾掉空值
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

      const response = await apiClient.post(
        "/api/food/findFoodsList",
        requestData
      );
      return response.data;
    } catch (error) {
      console.error("查詢食品列表失敗:", error);
      throw error;
    }
  },

  /**
   * 取得食品排序下拉選單
   * @returns {Promise} API 回應
   */
  getFoodSortEnums: async () => {
    try {
      const response = await apiClient.get("/api/food/getFoodSortEnums");
      return response.data;
    } catch (error) {
      console.error("取得排序選項失敗:", error);
      throw error;
    }
  },

  /**
   * 回傳食品資訊
   * @param {string} foodId - 食品 ID (例如: F001)
   * @returns {Promise} API 回應
   */
  findFoodData: async (foodId) => {
    try {
      const response = await apiClient.get("/api/food/findFoodData", {
        params: { foodId: foodId },
      });
      return response.data;
    } catch (error) {
      console.error("取得食品資訊失敗:", error);
      throw error;
    }
  },
};
