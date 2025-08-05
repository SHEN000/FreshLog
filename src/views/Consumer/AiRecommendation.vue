<script setup>
import { ref, computed, onMounted, reactive } from "vue";
import { useRouter } from "vue-router";
import { foodApi } from "@/data/6424/FoodApi.js";

// 引入子元件
import FilterSidebar from "@/components/CCC/Sidebar.vue";
import PageHeader from "@/components/CCC/PageHeader.vue";
import CategoryTabs from "@/components/CCC/CategoryTag.vue";
import MarketInsight from "@/components/CCC/MarketSight.vue";
import RecipeGrid from "@/components/CCC/Recipe.vue";
import PaginationControls from "@/components/CCC/PageControls.vue";
import SiteFooter from "@/components/Footer.vue";

const router = useRouter();

// 基本狀態
const searchQuery = ref("");
const activeCategory = ref("all");
const currentPage = ref(1);
const itemsPerPage = 6;
const isLoading = ref(false);
const currentSort = ref("seasonal"); // 預設排序

// API 資料
const allDishes = ref([]); // 從 API 取得的所有菜餚
const sortOptions = ref([]); // 從 API 取得的排序選項

// 分類選項
const categories = [
  { id: "all", name: "全部" },
  { id: "breakfast", name: "早餐" },
  { id: "main", name: "主食" },
  { id: "soup", name: "湯品" },
  { id: "leftover", name: "剩菜飯" },
  { id: "international", name: "異國料理" },
];

// 篩選條件
const filters = reactive({
  antioxidant: true,
  supplement: true,
  eyecare: false,
  energy: false,
  superFood: false,
});

// 價格區間
const priceRange = ref([0, 200]);

// 營養需求篩選條件
const nutritionFilters = reactive({
  vitaminA: false,
  vitaminC: false,
  calcium: false,
  iron: false,
  antioxidant: false,
});

// 營養標籤
const activeNutritionTab = ref("vitaminA");

// 從 API 載入食品列表
const loadFoodsList = async () => {
  isLoading.value = true;
  try {
    // 準備請求參數
    const params = {
      category:
        activeCategory.value === "all"
          ? ""
          : getCategoryMapping(activeCategory.value),
      subCategory: "",
      name: searchQuery.value,
      nameEn: "",
      priceMin: priceRange.value[0],
      priceMax: priceRange.value[1],
      tag: getTagFromFilters(filters),
      sort: currentSort.value,
    };

    const response = await foodApi.findFoodsList(params);

    // 處理回應資料
    if (Array.isArray(response)) {
      // 將 API 資料轉換成元件需要的格式
      allDishes.value = response.map((item) => ({
        id: item.foodId,
        name: item.name,
        type: mapCategoryToType(item.category),
        difficulty: "難易度:3顆星",
        time: "15分鐘",
        ingredients: item.tag ? item.tag.split("/").filter((t) => t) : [],
        price: item.price,
        description: item.description,
        image: getFullImageUrl(item.image),
        lastModifyDate: item.lastModifyDate,
        isRecommendation: item.isRecommendation,
        // 保存原始資料
        originalData: item,
      }));
    } else if (response && response.code === "8008") {
      console.log("API 成功:", response.message);
      // 如果資料在 response.data 中
      if (response.data && Array.isArray(response.data)) {
        allDishes.value = response.data.map((item) => ({
          id: item.foodId,
          name: item.name,
          type: mapCategoryToType(item.category),
          difficulty: "難易度:3顆星",
          time: "15分鐘",
          ingredients: item.tag ? item.tag.split("/").filter((t) => t) : [],
          price: item.price,
          description: item.description,
          image: getFullImageUrl(item.image),
          lastModifyDate: item.lastModifyDate,
          isRecommendation: item.isRecommendation,
          originalData: item,
        }));
      }
    }
  } catch (error) {
    console.error("載入食品列表失敗:", error);
    allDishes.value = [];
  } finally {
    isLoading.value = false;
  }
};

// 載入排序選項
const loadSortOptions = async () => {
  try {
    const response = await foodApi.getFoodSortEnums();

    // 處理 API 回應
    if (response && response.code === "8000") {
      // 將排序選項轉換為元件需要的格式
      sortOptions.value = response.data.map((item) => ({
        value: item.code,
        label: item.label,
      }));

      // 設定預設排序
      if (sortOptions.value.length > 0 && !currentSort.value) {
        currentSort.value = sortOptions.value[0].value;
      }
    } else {
      console.error("API 錯誤:", response?.message || "未知錯誤");
      useDefaultSortOptions();
    }
  } catch (error) {
    console.error("載入排序選項失敗:", error);
    useDefaultSortOptions();
  }
};

// 使用預設排序選項
const useDefaultSortOptions = () => {
  sortOptions.value = [
    { value: "seasonal", label: "產季由近到遠" },
    { value: "price_asc", label: "價格由低到高" },
    { value: "price_desc", label: "價格由高到低" },
  ];
  if (!currentSort.value) {
    currentSort.value = "seasonal";
  }
};

// 處理完整圖片路徑
const getFullImageUrl = (imagePath) => {
  if (!imagePath) return "/placeholder-image.jpg";
  if (imagePath.startsWith("http")) return imagePath;
  return `${import.meta.env.VITE_API_BASE_URL}${imagePath}`;
};

// 分類對應函數
const getCategoryMapping = (category) => {
  const mapping = {
    breakfast: "早餐",
    main: "主食",
    soup: "湯品",
    leftover: "剩菜飯",
    international: "異國料理",
  };
  return mapping[category] || category;
};

// 將 API 分類轉換為元件類型
const mapCategoryToType = (apiCategory) => {
  const typeMapping = {
    醃菜品: "dish1",
    主食: "dish2",
    湯品: "dish3",
    早餐: "dish1",
    剩菜飯: "dish2",
    異國料理: "dish3",
  };
  return typeMapping[apiCategory] || "dish1";
};

// 從篩選條件產生標籤
const getTagFromFilters = (filters) => {
  const tags = [];
  if (filters.antioxidant) tags.push("抗氧化");
  if (filters.supplement) tags.push("補鈣佳品");
  if (filters.eyecare) tags.push("護眼明目");
  if (filters.energy) tags.push("運動能量");
  if (filters.superFood) tags.push("超級食物");
  return tags.join("/");
};

// 計算總頁數 (前端分頁)
const totalItems = computed(() => allDishes.value.length);
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage));

// 當前頁面的菜餚 (前端分頁)
const filteredDishes = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return allDishes.value.slice(start, end);
});

// 查看食譜詳情
const viewRecipeDetails = async (recipeId) => {
  try {
    // 預載食品詳細資料
    const response = await foodApi.findFoodData(recipeId);
    if (response && response.code === "8000" && response.data) {
      // 可以將資料存到 localStorage 或 store
      localStorage.setItem(`recipe_${recipeId}`, JSON.stringify(response.data));
    }
  } catch (error) {
    console.error("載入食譜詳情失敗:", error);
  }

  // 無論成功與否都導向詳情頁
  router.push(`/ai-recommendation/${recipeId}`);
};

// 更新搜尋
const updateSearchQuery = (query) => {
  searchQuery.value = query;
};

const searchRecipes = () => {
  currentPage.value = 1;
  loadFoodsList();
};

// 更新分類
const setCategory = (categoryId) => {
  activeCategory.value = categoryId;
  currentPage.value = 1;
  loadFoodsList();
};

// 更新篩選條件
const updateFilters = (newFilters) => {
  Object.assign(filters, newFilters);
  currentPage.value = 1;
  loadFoodsList();
};

// 更新價格區間
const updatePriceRange = (newRange) => {
  priceRange.value = newRange;
  currentPage.value = 1;
  loadFoodsList();
};

// 更新營養篩選
const updateNutritionFilters = (newFilters) => {
  Object.assign(nutritionFilters, newFilters);
  currentPage.value = 1;
  loadFoodsList();
};

// 更新營養標籤
const updateNutritionTab = (tab) => {
  activeNutritionTab.value = tab;
};

// 處理排序變更
const handleSortChange = () => {
  currentPage.value = 1;
  loadFoodsList();
};

// 分頁功能
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const goToPage = (page) => {
  currentPage.value = page;
};

// 初始化
onMounted(async () => {
  // 先載入排序選項
  await loadSortOptions();

  // 處理 URL 參數
  const categoryParam = router.currentRoute.value.query.category;
  if (categoryParam && categories.some((c) => c.id === categoryParam)) {
    activeCategory.value = categoryParam;
  }

  // 載入食品列表
  await loadFoodsList();
});
</script>
