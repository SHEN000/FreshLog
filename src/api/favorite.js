import { request } from "./client";

export const favoriteApi = {
  /**
   * 加入食譜收藏
   * @param {string} recipeId - 食譜 ID
   * @returns {Promise} CommonRespFavoriteResp
   */
  addRecipeFavorite(recipeId) {
    return request.post(`/api/memberUser/favorites/recipe/${recipeId}`);
  },

  /**
   * 取消食譜收藏
   * @param {string} recipeId - 食譜 ID
   * @returns {Promise} CommonRespVoid
   */
  removeRecipeFavorite(recipeId) {
    return request.delete(`/api/memberUser/favorites/recipe/${recipeId}`);
  },

  /**
   * 查詢收藏食譜列表
   * @param {string} category - 分類 (預設 "ALL")
   * @returns {Promise} CommonRespListUserRecipesPreferenceVo
   * 回應資料格式: UserRecipesPreferenceVo[]
   * {
   *   recipeId: string,
   *   name: string,
   *   category: string,
   *   cookTimeMinutes: number,
   *   image: string
   * }
   */
  getRecipeFavoriteList(category = "ALL") {
    return request.get("/api/memberUser/favorites/recipe", { category });
  },

  checkRecipeFavorite(recipeId) {
    return request.get("/api/favorite/recipe/check", { recipeId });
  },

  /**
   * 加入蔬菜收藏
   * @param {string} foodId - 蔬菜 ID
   * @returns {Promise} CommonRespFavoriteResp
   */
  addFoodFavorite(foodId) {
    return request.post(`/api/memberUser/favorites/food/${foodId}`);
  },

  /**
   * 取消蔬菜收藏
   * @param {string} foodId - 蔬菜 ID
   * @returns {Promise} CommonRespVoid
   */
  removeFoodFavorite(foodId) {
    return request.delete(`/api/memberUser/favorites/food/${foodId}`);
  },

  /**
   * 查詢收藏蔬菜列表
   * @param {string} subCategory - 子分類 (預設 "ALL")
   * @returns {Promise} CommonRespListUserRecipesPreferenceVo
   * 回應資料格式: UserRecipesPreferenceVo[]
   * {
   *   recipeId: string,
   *   name: string,
   *   category: string,
   *   cookTimeMinutes: number,
   *   image: string
   * }
   */
  getFoodFavoriteList(subCategory = "ALL") {
    return request.get("/api/memberUser/favorites/food", { subCategory });
  },

  checkFoodFavorite(foodId) {
    return request.get("/api/favorite/food/check", { foodId });
  },
};
