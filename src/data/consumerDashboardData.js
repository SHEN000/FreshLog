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
const img01 = new URL('../assets/recipe/image 01.jpg', import.meta.url).href;
const img02 = new URL('../assets/recipe/image 02.jpg', import.meta.url).href;
const img03 = new URL('../assets/recipe/image 03.jpg', import.meta.url).href;
const img04 = new URL('../assets/recipe/image 04.jpg', import.meta.url).href;
const img05 = new URL('../assets/recipe/image 05.jpg', import.meta.url).href;
const img06 = new URL('../assets/recipe/image 06.jpg', import.meta.url).href;
const img07 = new URL('../assets/recipe/image 07.jpg', import.meta.url).href;
const img08 = new URL('../assets/recipe/image 08.jpg', import.meta.url).href;
const img09 = new URL('../assets/recipe/image 09.jpg', import.meta.url).href;

export const recipeList = [
  // 熱炒
  { id: 101, category: '熱炒', title: '金鑽鳳梨雞丁彩椒', time: 20, protein: '這道家常料理結合了鳳梨-金鑽鳳梨的酸甜多汁與雞丁的滑嫩，搭配彩椒增添色彩與口感', image: img01, route: '/ai-recommendation/N05B2_R1'  },
  { id: 102, category: '熱炒', title: '蒜香蠔油黃秋葵', time: 15, protein: '蒜香與蠔油的鹹甜完美融合，簡單又美味，是快速上桌的健康選擇', image: img02, route: '/ai-recommendation/N04FA1_R1'},
  { id: 103, category: '熱炒', title: '清炒越瓜佐蝦米', time: 20, protein: '清炒越瓜搭配蝦米，口感清爽，營養豐富，是一道簡單又美味的家常菜', image: img03, route: '/ai-recommendation/N04FS2_R1'},

  // 甜點
  { id: 201, category: '甜點', title: '桑椹蜂蜜優格杯', time: 5, nutrients: '桑椹與蜂蜜的天然甜味，搭配優格，清爽又健康，是完美的下午茶點心', image: img04, route: '/ai-recommendation/N0543_R1'},
  { id: 202, category: '甜點', title: '香蕉肉桂法式吐司', time: 15, nutrients: '香蕉的香甜與肉桂的獨特風味，搭配法式吐司，美味的早餐或點心', image: img05, route: '/ai-recommendation/N05A1_R1'},
  { id: 203, category: '甜點', title: '香蕉香煎佐蜂蜜優格', time: 15, nutrients: '旦蕉煎至外表微焦糖化，內裡軟糯香甜', image: img06, route: '/ai-recommendation/N05A3_R1'},

  // 熱門
  { id: 301, category: '熱門', title: '水梨玉米排骨湯', time: 60, protein: '結合了水梨的清甜與排骨的鮮美，湯頭清澈不油膩，溫潤滋補', image: img07, route: '/ai-recommendation/N05O8_R1'},
  { id: 302, category: '熱門', title: '柳橙雞胸藜麥沙拉', time: 25, nutrients: '口感豐富，酸甜開胃，是健康輕食的絕佳選擇', image: img08, route: '/ai-recommendation/N05E1_R1'},
  { id: 303, category: '熱門', title: '牛番茄滑蛋', time: 20, protein: '製作簡單快速，是餐桌上受歡迎的健康選擇', image: img09, route: '/ai-recommendation/N04FJ3_R1'},
];

// ===== 新聞/快訊（給 NewsCard 用） =====
export const vegNews = [
  { id: 'n1', date: '2025-11-06', title: '進口蔬菜農藥檢測合格公告', summary: '本周進口番茄、洋蔥等蔬菜已通過農科院檢測，農藥殘留均在安全標準內，消費者可安心食用。' },
  { id: 'n2', date: '2025-11-05', title: '冷鏈運輸新標準上路',       summary: '為保證生鮮蔬果品質，農委會推行冷鏈運輸新規範，確保從農場到餐桌的溫度控制。' },
  { id: 'n3', date: '2025-11-03', title: '有機認證農場巡查完成',     summary: '第四季有機認證巡查已完成，全台15家農場通過複評，維持有機認證資格。' },
  { id: 'n4', date: '2025-11-01', title: '秋季蔬菜盛產營養加倍',     summary: '入秋後葉菜類營養價值提升，建議多食用白蘿蔔、小白菜等時令蔬菜，增強免疫力。' },
  { id: 'n5', date: '2025-10-29', title: '食品溯源平台上線試用',     summary: '新開發的蔬果溯源QR碼系統已上線，掃描可查詢生產地點、農藥檢測紀錄及農民資訊。' }
];
