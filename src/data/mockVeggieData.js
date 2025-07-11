export const veggieMockData = {
  // 蔬菜基本資訊
  id: "001",
  name: "紅蘿蔔", //中文名稱
  englishName: "Carrot", //英文名稱
  image: "/src/assets/images/veggies/carrot.png", //作物示意圖
  category: "根莖類蔬菜", //作物分類
  usage: "適合涼拌、熱炒、燉煮", //作物用途
  pricePerKg: "35", //最新均價
  date: "2025/04/25",

  // AI智慧推薦
  aiSuggestion: {
    bestBuyTiming: "當前價格處於近3個月高點，建議等待7-10天後再購買，預計價格將下跌15-20%。", //最佳購買時機
    alternative: "白蘿蔔、牛蒡等根莖類蔬菜價格較低，營養價值相近，可作為替代選擇。", //同等替代選擇
    bestMarket: "附近南門市場的價格比平均低12%，週二、週五為進貨日，品質最佳。", //最佳購買地點
  },

  // 營養與健康資訊
  nutrition: {
    //主要營養成分
    macros: [
      { id: 'carbs', label: '碳水化合物', value: 9.6, unit: 'g', color: '#ff9800' },
      { id: 'protein', label: '蛋白質', value: 0.9, unit: 'g', color: '#4caf50' },
      { id: 'fat', label: '脂肪', value: 0.2, unit: 'g', color: '#f44336' },
      { id: 'vitaminA', label: '維生素A', value: 835, unit: 'µg', color: '#2196f3' },
    ],
    //健康益處
    benefits: [
      '豐富的β-胡蘿蔔素有助於視力健康',
      '抗氧化成分可降低心血管疾病風險',
      '膳食纖維促進腸道健康與消化',
      '有助於增強免疫系統功能'
    ],
    //適合人群
    audience: '視力保健需求者、需要減重的人、高血脂患者、需要增強免疫力的人群。孕婦食用可幫助胎兒視力發展。'
  },

  // 多通路價格比較與CP值排行
  marketCompare: [
    {
      id: 'm1',
      name: '批發市場-未洗紅蘿蔔',
      image: '/src/assets/images/veggies/carrot1.png', // 作物示意圖
      pricePerKg: 30, //作物價格
      qualityScore: 50, //品質分數
      cpValue: 3.68, //CP值
      description:
        '以30元/公斤的價格提供最高CP值，是最經濟實惠的選擇。雖需自行清洗，但品質分數高達110.45，性價比極高。', // 綜合評價
      tags: ['經濟實惠', '需清洗'], //標籤
    },
    {
      id: 'm2',
      name: '古坑有機紅蘿蔔',
      image: '/src/assets/images/veggies/carrot2.png',
      pricePerKg: 65,
      qualityScore: 95,
      cpValue: 1.21,
      description:
        '65元/公斤，雖然價格較高，但品質分數達90分，為有機認證產品，適合重視有機種植的消費者。',
      tags: ['高品質', '不需清洗'],
    },
    {
      id: 'm3',
      name: '批發市場-未洗紅蘿蔔',
      image: '/src/assets/images/veggies/carrot3.png',
      pricePerKg: 20,
      qualityScore: 70,
      cpValue: 1.18,
      description:
        '以30元/公斤的價格提供最高CP值，是最經濟實惠的選擇。雖需自行清洗，但品質分數高達110.45，性價比極高。',
      tags: ['經濟實惠', '需清洗'],
    }
  ],

  // 保存與烹飪技巧
  storageTips: {
    method: {
      title: '保存方式',
      icon: 'snowflake',
      content:
        '紅蘿蔔應去除頂部綠葉，用紙巾包裹後放入保鮮袋，置於冰箱保鮮層可保存2-3週。避免與蘋果等釋放乙烯的水果放在一起，以免變苦。'
    },
    cooking: {
      title: '烹飪技巧',
      icon: 'flame',
      content:
        '紅蘿蔔先蒸後炒更易於人體吸收營養。切丁前先冷凍15分鐘可減少流淚。搭配油脂烹調更能促進維生素A的吸收。'
    },
    waste: {
      title: '減少浪費',
      icon: 'recycle',
      content:
        '紅蘿蔔葉可用於製作湯底增添風味。過熟的紅蘿蔔可製作成蛋糕或餅乾。削皮後的外層可用來熬製高湯。'
    },
    bestBefore: {
      title: '最佳食用期限',
      icon: 'clock',
      content:
        '新鮮紅蘿蔔：購買後2-3週內\n冷凍紅蘿蔔：可保存8-12個月\n熟食紅蘿蔔：冷藏3-5天'
    }
  },
  // 相似產品比較
  similarVeggies: [
    {
      id: '002',
      name: '有機紅蘿蔔',
      subtitle: '無農藥栽培', //相關敘述
      pricePerKg: 58, //價格
      trend: 'up', //漲跌趨勢 (判斷未定可先不管)
      icon: '/src/assets/images/icons/carrot-organic.png' //作物示意圖
    },
    {
      id: '003',
      name: '進口紅蘿蔔',
      subtitle: '澳洲進口',
      pricePerKg: 45,
      trend: 'up',
      icon: '/src/assets/images/icons/carrot-import.png'
    },
    {
      id: '004',
      name: '迷你紅蘿蔔',
      subtitle: '適合即食',
      pricePerKg: 65,
      trend: 'down',
      icon: '/src/assets/images/icons/carrot-mini.png'
    },
    {
      id: '005',
      name: '白蘿蔔',
      subtitle: '替代選擇',
      pricePerKg: 22,
      trend: 'down',
      icon: '/src/assets/images/icons/daikon.png'
    }
  ],


  // 食譜推薦
  recipes: [
    {
      id: 'r1',
      name: '香濃紅蘿蔔湯', //食譜名稱
      image: '/src/assets/images/recipes/carrot-soup.png', //食譜示意圖
      time: 30,           // 分鐘
      servings: 4,        // 人份
      difficulty: '簡單'  // 難度
    },
    {
      id: 'r2',
      name: '健康紅蘿蔔蛋糕',
      image: '/src/assets/images/recipes/carrot-cake.png',
      time: 90,
      servings: 8,
      difficulty: '中等'
    },
    {
      id: 'r3',
      name: '韓式涼拌紅蘿蔔',
      image: '/src/assets/images/recipes/korean-carrot.png',
      time: 15,
      servings: 2,
      difficulty: '簡單'
    }
  ],
 
  // 農民資訊 (這邊未確定也可先不管)
  farmer: {
    id: 'f001',
    image: '/src/assets/images/farmers/zhangming.png', //農民照片
    name: '張大明',
    farm: '綠野農場',
    location: '宜蘭縣',
    certification: '有機認證',
    rating: 3.7, //農民評價(星星)
    reviewCount: 38, //評價數量
    specialPrice: 28, //優惠價格
    unit: '公斤', //單位
    minQty: 5, //最低購買量
    shipping: '週一、四出貨，3-5天送達', //送貨時間
    traceCertification: '產銷履歷認證，可追溯生產過程' //追溯認證資訊
  },
};
