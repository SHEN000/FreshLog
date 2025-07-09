<template>
    <div class="steps-card">
        <h3 class="card-title">
            <img src="@/assets/icons/step.png" alt="步驟" class="title-icon" />
            料理步驟
        </h3>
        <!-- 步驟列表：遍歷 steps 陣列 -->
        <div v-for="(text, idx) in steps" :key="idx" class="step-item">
            <!-- 步驟標題列：編號 + 標題 -->
            <div class="step-header">
                <div class="step-num">{{ idx + 1 }}</div>
                <div class="step-title">
                    {{ splitTitle(text) }}
                </div>
            </div>
            <!-- 步驟描述：冒號後的文字 -->
            <p class="step-desc">
                {{ splitDesc(text) }}
            </p>

            <!-- 若有對應的 time，顯示時間區塊 -->
            <div v-if="times[idx]" class="step-time">
                <img src="@/assets/icons/clock.png" alt="時間" class="time-icon" />
                {{ times[idx] }}
            </div>
        </div>

        <div v-if="tags.length" class="tags">
            <span v-for="(tag, i) in tags" :key="i" class="tag">{{ tag }}</span>
        </div>
    </div>
</template>

<script setup>

defineProps({
    /** 
     * steps：字串陣列，每個元素格式為「標題：描述」
     * e.g. ['切塊：將紅蘿蔔切塊', ...]
   */
    steps: {
        type: Array,
        default: () => []
    },
    /**
     * times：可選的字串陣列，每個元素為該步驟的時間
     * e.g. ['10 分鐘', '5 分鐘', ...]
     */
    times: {
        type: Array,
        default: () => []
    },
    /**
     * tags：可選的標籤陣列，顯示於步驟區塊下方
     * e.g. ['湯品料理', '素食']
    */
    tags: {
        type: Array,
        default: () => []
    }
})

// 回傳「冒號前」文字
const splitTitle = (text) => {
    const parts = text.split('：')
    return parts[0] || text
}
// 回傳「冒號後」文字
const splitDesc = (text) => {
    const parts = text.split('：')
    return parts.slice(1).join('：')
}
</script>

<style scoped>
/* 卡片整體 */
.steps-card {
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
    padding: 24px;
}

/* 標題列 */
.card-title {
    display: flex;
    align-items: center;
    font-size: 18px;
    font-weight: 500;
    margin-bottom: 16px;
    color: #333;
}

/* 標題圖示 */
.title-icon {
    width: 20px;
    height: 32px;
    margin-right: 8px;
}

/* 單一步驟區塊 */
.step-item {
    padding: 16px 0;
    border-bottom: 1px solid #f0f0f0;
}

/* 最後一個步驟不顯示分隔線 */
.step-item:last-child {
    border-bottom: none;
}

/* 步驟標題列 */
.step-header {
    display: flex;
    align-items: center;
    gap: 12px;
}

/* 編號 */
.step-num {
    width: 32px;
    height: 32px;
    background: #22a135;
    border-radius: 50%;
    color: #fff;
    font-size: 16px;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* 步驟標題文字 */
.step-title {
    font-size: 16px;
    font-weight: bold;
    color: #333;
}

/* 步驟描述文字 */
.step-desc {
    margin: 8px 0 0 44px;    /* 往右縮排對齊 step-title */
    font-size: 14px;
    color: #777;
    line-height: 1.6;
}

/* 時間區塊 */
.step-time {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    background: #fff4e5;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 13px;
    color: #d9822b;
    margin-left: 44px;
    /* 同步縮排 */
    margin-top: 8px;
}

/* 時間圖示 */
.time-icon {
    width: 16px;
    height: 16px;
}

/* 標籤 */
.tags {
    margin-top: 16px;
    display: flex;
    gap: 8px;
    flex-wrap: wrap; /* 手機版換行 */
}

/* 單一標籤樣式 */
.tag {
    background: #eaf7ea;
    color: #22a135;
    padding: 6px 12px;
    border-radius: 9999px;
    font-size: 13px;
}
</style>
