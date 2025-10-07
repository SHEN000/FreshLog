// src/api/food.js
import { request } from "./client";

export const foodApi = {
  /**
   * 查詢食品列表（帶分頁）
   * POST /api/food/findFoodsList
   *
   * @param {Object} params - 篩選參數（Request Body）
   * @param {string} params.category - 分類
   * @param {string} params.subCategory - 子分類
   * @param {string} params.name - 名稱
   * @param {string} params.nameEn - 英文名稱
   * @param {number} params.priceMin - 最低價格
   * @param {number} params.priceMax - 最高價格
   * @param {string} params.tag - 標籤
   * @param {string} params.sort - 排序方式
   *
   * @param {Object} pagination - 分頁參數（Query String）
   * @param {number} pagination.pageNo - 頁碼（0-based）
   * @param {number} pagination.pageSize - 每頁筆數
   * @param {string} pagination.sort - 排序（例如：price,desc）
   *
   * @returns {Promise} 回應格式：
   * {
   *   code: "0000",
   *   message: "搜尋成功",
   *   data: {
   *     pageNo: 0,
   *     pageSize: 20,
   *     totalElements: 100,
   *     totalPages: 5,
   *     content: [ {...}, {...}, ... ]
   *   }
   * }
   */
  findFoodsList(params = {}, pagination = {}) {
    // 預設的篩選條件
    const defaultParams = {
      category: "",
      subCategory: "",
      name: "",
      nameEn: "",
      priceMin: 1,
      priceMax: 1000,
      tag: "",
      sort: "PRICE_DESC",
    };

    // 預設的分頁參數
    const defaultPagination = {
      pageNo: 0,
      pageSize: 20,
      sort: "price,desc",
    };

    return request.post(
      "/api/food/findFoodsList",
      { ...defaultParams, ...params },
      { params: { ...defaultPagination, ...pagination } }
    );
  },

  /**
   * 取得單一食品資料
   * GET /api/food/findFoodData
   */
  findFoodData(foodId) {
    return request.get("/api/food/findFoodData", { foodId });
  },

  /**
   * 取得食品排序選項
   * GET /api/food/getFoodSortEnums
   */
  getFoodSortEnums() {
    return request.get("/api/food/getFoodSortEnums");
  },

  /**
   * 取得食品子分類
   * GET /api/food/getFoodSubCategories
   */
  getFoodSubCategories(category) {
    return request.get("/api/food/getFoodSubCategories", { category });
  },
};
