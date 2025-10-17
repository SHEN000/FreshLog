import { request } from "./client";

export const memberApi = {
  /**
   * 取得會員個人資訊
   * @returns {Promise<{data: CommonRespMemberInfoVo}>}
   * CommonRespMemberInfoVo: {
   *   success: boolean,
   *   message: string,
   *   data: {
   *     name: string,
   *     phone: string,
   *     email: string,
   *     favoriteRecipeCategory: string,
   *     favoriteFruitVeggieCategory: string,
   *     address: string
   *   }
   * }
   */
  getMemberInfo() {
    return request.get("/api/memberUser/find-information");
  },

  /**
   * 更新會員個人資訊
   * @param {Object} data - 更新資料
   * @param {string} data.name - 姓名
   * @param {string} data.phone - 電話
   * @param {string} data.address - 地址
   * @param {string} data.favoriteRecipeCategory - 偏好食譜類別
   * @param {string} data.favoriteFruitVeggieCategory - 偏好蔬果類別
   * @returns {Promise<{data: CommonRespVoid}>}
   */
  updateMemberInfo(data) {
    return request.post("/api/memberUser/update-information", data);
  },
};
