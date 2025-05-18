// 蔬菜資訊頁面的資料

export const veggieData = [
  {
    id: 1,
    name: "高麗菜",
    latestPrice: 50,
    priceChange: 18,
    isTracked: true,
    images: ["/veggies/cabbage1.jpg", "/veggies/cabbage2.jpg"],
  },
  {
    id: 2,
    name: "蔬果",
    latestPrice: 50,
    priceChange: 18,
    isTracked: true,
    images: ["/veggies/veggie1.jpg", "/veggies/veggie2.jpg"],
  },
  {
    id: 3,
    name: "香蕉",
    latestPrice: 50,
    priceChange: 18,
    isTracked: true,
    images: ["/veggies/banana1.jpg", "/veggies/banana2.jpg"],
  },
  {
    id: 4,
    name: "菠菜",
    latestPrice: 50,
    priceChange: 18,
    isTracked: true,
    isHighlighted: true,
    images: ["/veggies/spinach1.jpg", "/veggies/spinach2.jpg"],
  },
];

// 排序選項
export const sortOptions = [
  { id: "price-asc", label: "價格由低到高" },
  { id: "price-desc", label: "價格由高到低" },
  { id: "name-asc", label: "名稱A-Z" },
  { id: "name-desc", label: "名稱Z-A" },
  { id: "change-asc", label: "漲幅由小到大" },
  { id: "change-desc", label: "漲幅由大到小" },
];

// 分類選項
export const categoryOptions = [
  { id: "all", label: "全部" },
  { id: "leafy", label: "葉菜類" },
  { id: "fruit", label: "水果類" },
  { id: "root", label: "根莖類" },
  { id: "beans", label: "豆類" },
  { id: "others", label: "其他" },
];
