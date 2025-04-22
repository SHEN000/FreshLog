//以下為測試用的假資料

//價格趨勢快報
export const marketTrend = [
  {
    name: "水果類",
    values: [
      { date: "2024/10", value: 38.5 },
      { date: "2024/11", value: 25.8 },
      { date: "2024/12", value: 28.4 },
      { date: "2025/01", value: 13.6 },
      { date: "2025/02", value: 21.4 },
      { date: "2025/03", value: 28.2 },
    ],
  },
  {
    name: "根莖類",
    values: [
      { date: "2024/10", value: 16.9 },
      { date: "2024/11", value: 16.0 },
      { date: "2024/12", value: 11.9 },
      { date: "2025/01", value: 34.9 },
      { date: "2025/02", value: 38.7 },
      { date: "2025/03", value: 15.0 },
    ],
  },
  {
    name: "菇蕈類",
    values: [
      { date: "2024/10", value: 18.2 },
      { date: "2024/11", value: 24.8 },
      { date: "2024/12", value: 25.0 },
      { date: "2025/01", value: 19.3 },
      { date: "2025/02", value: 35.2 },
      { date: "2025/03", value: 25.4 },
    ],
  },
  {
    name: "花果類",
    values: [
      { date: "2024/10", value: 11.6 },
      { date: "2024/11", value: 21.8 },
      { date: "2024/12", value: 28.4 },
      { date: "2025/01", value: 22.0 },
      { date: "2025/02", value: 27.6 },
      { date: "2025/03", value: 36.8 },
    ],
  },
];

//食譜清單列表
export const recipeList = [
  { id: 1, name: "番茄炒蛋", ingredients: ["番茄", "雞蛋", "蔥"] },
  { id: 2, name: "青江菜蒜炒", ingredients: ["青江菜", "大蒜"] },
  { id: 3, name: "麻油香菇麵線", ingredients: ["香菇", "麻油", "麵線"] },
];

//本日/本週精選食材
export const featuredIngredients = [
  { name: "番茄", tag: "本日推薦" },
  { name: "香菇", tag: "本週精選" },
  { name: "玉米筍", tag: "新鮮上市" },
];

//社群共創內容
export const communityPosts = [
  { id: 1, author: "農夫阿勇", message: "今天採收的空心菜品質超讚！" },
  { id: 2, author: "小青菜園", message: "有機肥料實驗分享文已更新！" },
];

//食安資訊列表
export const foodSafetyItems = [
  { date: "2025/04/15", title: "農藥殘留超標事件通報" },
  { date: "2025/04/13", title: "農產品產地標示新規上路" },
];

//蔬食時事新聞
export const vegNews = [
  { date: "2025/04/14", title: "農委會推行疏食生活週" },
  { date: "2025/04/12", title: "全聯推廣在地蔬食料理" },
  { date: "2025/04/07", title: "農委會推行疏食生活週" },
];
