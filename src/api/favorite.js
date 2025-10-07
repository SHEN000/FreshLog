import { request } from "./client";

export const favoriteApi = {
  addRecipeFavorite(recipeId) {
    return request.post("/api/favorite/recipe/add", { recipeId });
  },

  removeRecipeFavorite(recipeId) {
    return request.delete("/api/favorite/recipe/remove", { recipeId });
  },

  getRecipeFavoriteList() {
    return request.get("/api/favorite/recipe/list");
  },

  checkRecipeFavorite(recipeId) {
    return request.get("/api/favorite/recipe/check", { recipeId });
  },

  addFoodFavorite(foodId) {
    return request.post("/api/favorite/food/add", { foodId });
  },

  removeFoodFavorite(foodId) {
    return request.delete("/api/favorite/food/remove", { foodId });
  },

  getFoodFavoriteList() {
    return request.get("/api/favorite/food/list");
  },

  checkFoodFavorite(foodId) {
    return request.get("/api/favorite/food/check", { foodId });
  },
};
