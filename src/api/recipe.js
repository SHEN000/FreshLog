import { request } from "./client";

export const recipeApi = {
  findRecipesList(params = {}) {
    const defaultParams = {
      category: "",
      name: "",
      sort: "recommend",
    };
    return request.post("/api/recipe/findRecipesList", {
      ...defaultParams,
      ...params,
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
