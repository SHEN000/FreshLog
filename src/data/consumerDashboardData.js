// ===== 市場走勢（給 MarketTrendCard 用） =====
export const marketTrend = {
  unit: '斤',
  items: ['白蘿蔔', '高麗菜', '番茄', '菠菜', '馬鈴薯'],
  last7days: [
    { date: '2025-04-01', 白蘿蔔: 34, 高麗菜: 108, 番茄: 98,  菠菜: 42, 馬鈴薯: 39 },
    { date: '2025-04-02', 白蘿蔔: 52, 高麗菜: 96,  番茄: 134, 菠菜: 66, 馬鈴薯: 61 },
    { date: '2025-04-03', 白蘿蔔: 41, 高麗菜: 87,  番茄: 112, 菠菜: 50, 馬鈴薯: 45 },
    { date: '2025-04-04', 白蘿蔔: 63, 高麗菜: 103, 番茄: 141, 菠菜: 69, 馬鈴薯: 59 },
    { date: '2025-04-05', 白蘿蔔: 37, 高麗菜: 82,  番茄: 106, 菠菜: 44, 馬鈴薯: 43 },
    { date: '2025-04-06', 白蘿蔔: 59, 高麗菜: 88,  番茄: 145, 菠菜: 65, 馬鈴薯: 63 },
    { date: '2025-04-07', 白蘿蔔: 75, 高麗菜: 76,  番茄: 160, 菠菜: 48, 馬鈴薯: 46 },
  ],
};

// ===== 食譜清單（給 RecipeListCard 用，tags 一律為陣列） =====
const img85 = new URL('../assets/recipe/image 85.png', import.meta.url).href;
const img01 = new URL('../assets/recipe/image 01.png', import.meta.url).href;

export const recipeList = [
  // 家常菜
  { id: 101, category: '家常菜', title: '辣椒炒蛋',    time: 15, protein: '蛋白',          image: img85 },
  { id: 102, category: '家常菜', title: '麻婆豆腐',    time: 25, protein: '蛋白',          image: img85 },
  { id: 103, category: '家常菜', title: '番茄炒蛋',    time: 12, protein: '蛋白',          image: img85 },

  // 健康沙拉
  { id: 201, category: '健康沙拉', title: '鮮蔬沙拉', time: 12, nutrients: '膳食纖維',   image: img01 },
  { id: 202, category: '健康沙拉', title: '涼拌菠菜',  time: 10, nutrients: '低熱量、維生素C', image: img85 },
  { id: 203, category: '健康沙拉', title: '雞胸沙拉',  time: 18, nutrients: '高蛋白',        image: img85 },

  // 熱門
  { id: 301, category: '熱門',   title: '三杯雞',      time: 30, protein: '蛋白',          image: img85 },
  { id: 302, category: '熱門',   title: '蒜香義大利麵', time: 20, nutrients: '碳水',       image: img85 },
  { id: 303, category: '熱門',   title: '彩椒牛肉',    time: 22, protein: '蛋白',          image: img85 },
];

// ===== 新聞/快訊（給 NewsCard 用） =====
export const vegNews = [
  { id: 'n1', title: '5天前 新規定!! 管制農藥使用'},
  { id: 'n2', title: '4月5日 如何辨識有機標章技巧'},
  { id: 'n3', title: '蔬果季節到來！價格波動提醒'}
];
