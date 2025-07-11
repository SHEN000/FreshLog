export default {
    // 基本資訊
    title: '經典紅蘿蔔濃湯',
    desc: '香濃滑甜的紅蘿蔔濃湯，營養滿滿又暖胃，冬天喝暖身又暖心。',
    image: '/images/recipes/carrot-soup.png',
    cookTime: '45 分鐘',
    servings: 4,
    difficulty: '中等',

    // 料理步驟
    steps: [
        '準備食材：紅蘿蔔 500g、洋蔥 1 顆、蒜頭 2 瓣、奶油 1 大匙、雞高湯 800ml。',
        '切塊與爆香：紅蘿蔔切滾刀塊，洋蔥與蒜頭切末；鍋中溶奶油，放入洋蔥、蒜頭爆香。',
        '煮軟食材：加入紅蘿蔔拌炒 2 分鐘，再倒入雞高湯，小火煮約 15 分鐘至紅蘿蔔軟爛。',
        '打成泥：用手持攪拌棒將鍋中食材打成泥，或倒入食物調理機攪打均勻。',
        '調味完成：加鹽、黑胡椒調味，若喜歡濃郁可加入 50ml 鮮奶，再次加熱後熄火即可。'
    ],
    // 對應的時間（與 steps 一一對應）
    times: ['10 分鐘', '8 分鐘', '20 分鐘', '5 分鐘', '2 分鐘'],
    // 料理類型
    tags: ['湯品料理', '素食', '低卡', '營養豐富'],

    // 食材清單
    ingredients: [
        { name: '紅蘿蔔', quantity: '500g' },
        { name: '洋蔥', quantity: '1 顆' },
        { name: '蒜頭', quantity: '2 瓣' },
        { name: '無鹽奶油', quantity: '30g' },
        { name: '雞高湯', quantity: '800ml' },
        { name: '鮮奶油', quantity: '100ml' },
        { name: '鹽', quantity: '適量' },
        { name: '黑胡椒', quantity: '適量' }
    ],

    // 主要食材當前價格
    mainPrices: [
        { name: '紅蘿蔔', price: 28, unit: '斤', change: '+5%' }
    ],
    mainPriceCost: 45,


    // 營養資訊
    nutrition: {
        卡路里: '150 kcal',
        蛋白質: '4 g',
        脂肪: '6 g',
        碳水化合物: '18 g'
    },

    // 當季推薦食材
    seasonalItems: [
        { name: '紅蘿蔔', image: '/images/ingredients/carrot.png', price: '28 元/斤', recommended: true },
        { name: '馬鈴薯', image: '/images/ingredients/potato.png', price: '20 元/斤', recommended: true },
        { name: '洋蔥', image: '/images/ingredients/onion.png', price: '25 元/斤' },
        { name: '南瓜', image: '/images/ingredients/pumpkin.png', price: '30 元/斤', recommended: true },
        { name: '高麗菜', image: '/images/ingredients/cabbage.png', price: '28 元/斤' },
        { name: '黃瓜', image: '/images/ingredients/cucumber.png', price: '20 元/斤' },
        { name: '紅豆', image: '/images/ingredients/redbeans.png', price: '25 元/斤' },
        { name: '花椰菜', image: '/images/ingredients/cauliflower.png', price: '30 元/斤', recommended: true }
    ],


    // 替代食材建議
    substitutes: [
        { name: '南瓜濃湯', image: '/images/recipes/pumpkin-soup.png', save: '$12', desc: '南瓜當季盛產，價格比紅蘿蔔更便宜，口感同樣香甜濃郁' },
        { name: '大頭菜湯', image: '/images/recipes/kohlrabi-soup.png', save: '$18', desc: '大頭菜清甜爽口，是目前最便宜的根莖類蔬菜選擇' },
        { name: '蘿蔔排骨湯', image: '/images/recipes/radish-pork-ribs-soup.png', save: '$15', desc: '白蘿蔔當季價格實惠，搭配排骨營養更豐富' }
    ],

    // 市場行情
    marketTrends: [
        { name: '紅蘿蔔', image: '/images/ingredients/carrot.png', price: 28, unit: '元/斤', change: '+5%' },
        { name: '洋蔥', image: '/images/ingredients/onion.png', price: 22, unit: '元/斤', change: '-3%' },
        { name: '南瓜', image: '/images/ingredients/pumpkin.png', price: 35, unit: '元/斤', change: '-7%' },
        { name: '馬鈴薯', image: '/images/ingredients/potato.png', price: 25, unit: '元/斤', change: '+0%' }
    ],
    // 加上一個「省錢小提醒」文字
    marketTip: '本週南瓜與洋蔥價格下跌，建議可趁機入手製作更多濃湯！',

    // 食譜推薦
    recipes: [
        {
            id: 'r4',
            name: '奶油蘑菇湯', //食譜名稱
            image: '/images/recipes/1.png', //食譜示意圖
            time: 30,           // 分鐘
            servings: 4,        // 人份
            difficulty: '中等'  // 難度
        },
        {
            id: 'r5',
            name: '蒜香青江菜',
            image: '/images/recipes/2.png',
            time: 15,
            servings: 4,
            difficulty: '簡單'
        },
        {
            id: 'r6',
            name: '紫菜蛋花湯',
            image: '/images/recipes/3.png',
            time: 10,
            servings: 2,
            difficulty: '簡單'
        }
    ],
}
