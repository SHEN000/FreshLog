<template>
    <div class="price-card-outer">
        <div class="price-card-inner">
            <h3 class="title">主要食材當前價格</h3>
            <div class="main-row">
                <div class="money-icon">
                    <img src="@/assets/icons/money-bag.png" alt="icon" />
                </div>
                <div class="info-block">
                    <div v-for="item in items" :key="item.name" class="main-price-row">
                        <!-- 食材名稱 -->
                        <span class="item-name">{{ item.name }}</span>
                        <!-- 價格數字 -->
                        <span class="item-price">${{ item.displayPrice }}</span>
                        <!-- 漲跌顯示 -->
                        <span class="item-unit">/{{ item.unit }}</span>
                        <span class="item-change"
                            :class="{ up: item.trend.startsWith('+'), down: item.trend.startsWith('-') }">
                            <!-- 根據漲跌顯示箭頭 -->
                            {{ item.trend.startsWith('+') ? '↑' : '↓' }}
                            比上週{{ item.trend.startsWith('+') ? '貴' : '便宜' }}
                            {{ item.trend.replace(/[+-]/, '') }}
                        </span>
                    </div>
                    <!-- <div class="cost-summary">
                        主要食材預估成本約 <span class="cost-value">${{ cost }}</span>
                    </div> -->
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    items: {
        type: Array,
        default: () => []
    },
    cost: {
        type: [Number, String],
        default: ''
    }
})
</script>

<style scoped>
/* 外層 */
.price-card-outer {
    border: 2px solid #22a135;
    border-radius: 16px;
    background: #f8fefa;
    padding: 20px;
    box-shadow: 0 2px 8px #eaf7ea;
    display: flex;
    justify-content: center;
}

/* 內層 */
.price-card-inner {
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 8px #CCC;
    padding: 20px;
    min-width: 280px;
    max-width: 340px;
    width: 100%;
}

/* 標題樣式 */
.title {
    color: #2e7d32;
    font-size: 18px;
    font-weight: bold;
    text-align: center;
    margin: 0 0 16px 0;
    letter-spacing: 1px;
}

/* 主要內容行：圖示 + 資訊 */
.main-row {
    display: flex;
    align-items: center;
    gap: 16px;
}

/* 圖示圓圈 */
.money-icon {
    width: 48px;
    height: 48px;
    background: #22a135;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 4px;
    flex-shrink: 0;
    box-shadow: 0 2px 8px #eaf7ea;
}

/* 圖示內部 Icon */
.money-icon img {
    width: 28px;
    height: 28px;
}

/* 資訊區塊*/
.info-block {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

/* 單列價格資料 */
.main-price-row {
    font-size: 16px;
    margin-bottom: 4px;
    display: flex;
    align-items: baseline;
    flex-wrap: wrap;
}

/* 食材名稱 */
.item-name {
    color: #666;
    font-weight: 500;
    margin-right: 4px;
}

/* 價格文字 */
.item-price {
    color: #22a135;
    font-size: 20px;
    font-weight: bold;
    margin-right: 2px;
}

/* 單位 */
.item-unit {
    color: #22a135;
    font-size: 15px;
    font-weight: 500;
    margin-right: 8px;
}

/* 漲跌文字預設顏色 */
.item-change {
    color: #8dd48c;
    font-size: 14px;
    margin-left: 2px;
}

/* 漲 (紅色) */
.item-change.up {
    color: #f44336;
}

/* 跌 (綠色) */
.item-change.down {
    color: #22a135;
}

/* 小計文字 */
.cost-summary {
    margin-top: 6px;
    font-size: 15px;
    color: #888;
}

/* 小計成本數值 */
.cost-value {
    color: #22a135;
    font-size: 18px;
    font-weight: bold;
    margin-left: 2px;
}
</style>
