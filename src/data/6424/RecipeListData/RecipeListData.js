export const recipeListData = [
  {
    id: 1,
    name: "經典紅蘿蔔濃湯",
    description: "香濃滑甜的紅蘿蔔濃湯，營養滿滿又暖胃",
    image: "/images/recipes/carrot-soup.jpg",
    difficulty: "簡單",
    cookTime: "30分",
    servings: 4,
    category: "湯品",
    tags: ["素食", "簡單"],
    isRecommended: true,
  },
  {
    id: 2,
    name: "香蕉磅蛋糕",
    description: "濕潤香甜的香蕉蛋糕，完美的下午茶點心",
    image: "/images/recipes/banana-cake.jpg",
    difficulty: "中等",
    cookTime: "60分",
    servings: 8,
    category: "甜點",
    tags: ["烘焙", "甜點"],
    isRecommended: false,
  },
  {
    id: 3,
    name: "蒜香青江菜",
    description: "簡單快炒的青江菜，保持蔬菜的鮮甜口感",
    image: "/images/recipes/garlic-vegetables.jpg",
    difficulty: "簡單",
    cookTime: "15分",
    servings: 4,
    category: "蔬菜",
    tags: ["素食", "簡單"],
    isRecommended: false,
  },
  {
    id: 4,
    name: "經典番茄蛋花湯",
    description: "酸甜開胃的番茄蛋花湯，營養豐富又暖胃",
    image: "/images/recipes/tomato-egg-soup.jpg",
    difficulty: "簡單",
    cookTime: "20分",
    servings: 4,
    category: "湯品",
    tags: ["素食", "簡單"],
    isRecommended: false,
  },
  {
    id: 5,
    name: "彩虹蔬菜沙拉",
    description: "營養豐富的彩虹蔬菜沙拉，新鮮爽脆又健康",
    image: "/images/recipes/rainbow-salad.jpg",
    difficulty: "簡單",
    cookTime: "10分",
    servings: 2,
    category: "沙拉",
    tags: ["素食", "簡單"],
    isRecommended: true,
  },
  {
    id: 6,
    name: "麻婆茄子",
    description: "香辣下飯的麻婆茄子，茄子軟糯入味十分開胃",
    image: "/images/recipes/mapo-eggplant.jpg",
    difficulty: "中等",
    cookTime: "25分",
    servings: 4,
    category: "蔬菜",
    tags: ["素食", "辣味"],
    isRecommended: false,
  },
];

// 篩選選項數據
export const filterOptions = {
  // 特色篩選
  features: [
    { id: "all", label: "全部", checked: true },
    { id: "vegetarian", label: "純素食品", checked: false },
  ],

  // 料理時間
  cookTime: [
    { id: "15min", label: "15分鐘內", checked: false },
    { id: "30min", label: "30分鐘內", checked: false },
    { id: "1hour", label: "1小時內", checked: false },
  ],

  // 難易度
  difficulty: [
    { id: "easy", label: "新手", checked: false },
    { id: "medium", label: "普通", checked: false },
    { id: "hard", label: "進階", checked: false },
  ],
};

// 食譜分類標籤
export const categoryTags = [
  { id: "all", label: "全部", color: "#4CAF50" },
  { id: "stir_fry", label: "熱炒", color: "#FF5722" },
  { id: "cold_dish", label: "涼拌", color: "#4CAF50" },
  { id: "dessert", label: "甜點", color: "#E91E63" },
  { id: "soup", label: "湯品", color: "#FF9800" },
  { id: "stew", label: "燉煮", color: "#795548" },
  { id: "frying", label: "煎炸", color: "#F44336" },
];

// 排序選項
export const sortOptions = [
  { value: "recommend", label: "智慧推薦" },
  { value: "difficulty", label: "難易度" },
  { value: "time", label: "料理時間" },
  { value: "popular", label: "熱門程度" },
];
