import { request } from "./client";

export const recipeApi = {
  /**
   * 查詢食譜列表
   * @param {Object} bodyParams - Request Body 參數
   * @param {string} bodyParams.category - 分類 (例: "熱炒")
   * @param {string} bodyParams.name - 名稱（模糊搜尋）
   * @param {number} bodyParams.maxCookMinutes - 烹調時間上限(分鐘)
   * @param {string} bodyParams.servings - 人數份量 (例: "3-4人份")
   * @param {string} bodyParams.difficulty - 難易度 (例: "新手")
   * @param {string} bodyParams.tag - 標籤（模糊搜尋）
   * @param {string} bodyParams.sort - 排序方式 (newest, cooktime_asc, cooktime_desc, difficulty_asc, difficulty_desc)
   * @param {Object} queryParams - Query String 參數
   * @param {number} queryParams.pageNo - 頁碼 (0起算，預設0)
   * @param {number} queryParams.pageSize - 每頁筆數 (預設20)
   * @param {string|string[]} queryParams.sort - 排序條件 (格式: property,asc|desc)
   * @returns {Promise}
   */
  findRecipesList(bodyParams = {}, queryParams = {}) {
    // Request Body 的預設值
    const defaultBodyParams = {
      category: "",
      name: "",
      maxCookMinutes: null,
      servings: "",
      difficulty: "",
      tag: "",
      sort: "newest",
    };

    // Query String 的預設值
    const defaultQueryParams = {
      pageNo: 0,
      pageSize: 20,
      sort: null,
    };

    // 合併參數，過濾掉空值
    const body = Object.fromEntries(
      Object.entries({ ...defaultBodyParams, ...bodyParams }).filter(
        ([_, value]) => value !== "" && value !== null && value !== undefined
      )
    );

    const query = Object.fromEntries(
      Object.entries({ ...defaultQueryParams, ...queryParams }).filter(
        ([_, value]) => value !== null && value !== undefined
      )
    );

    // 使用 config.params 來傳遞 Query String
    return request.post("/api/recipe/findRecipesList", body, {
      params: query,
    });
  },

  findRecipeData(recipeId) {
    return request.get("/api/recipe/findRecipeData", { recipeId });
  },

  getRecipeSortEnums() {
    return request.get("/api/recipe/getRecipeSortEnums");
  },

  getRecipeCategories() {
    return request.get("/api/recipe/getRecipeCategories");
  },
};
