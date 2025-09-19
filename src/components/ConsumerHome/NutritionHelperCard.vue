<template>
    <Card class="trend-card">
        <div class="nutrition-card">
            <div class="title">營養小幫手</div>
            <div class="sub">每 100g 營養成分</div>

            <!-- 搜尋區 -->
            <div class="searchbar">
                <div class="searchbox" ref="searchWrap">
                    <input v-model="keyword" type="text" class="search-input" placeholder="輸入蔬果名稱" @input="onType"
                        @compositionstart="onCompStart" @compositionend="onCompEnd" @keydown.down.prevent="move(1)"
                        @keydown.up.prevent="move(-1)" @keydown.enter.prevent="onEnter" aria-label="輸入蔬果名稱" />
                    <button class="icon-btn" @click="search" aria-label="查詢">
                        <img :src="magnifierIcon" class="icon-img" alt="" />
                    </button>

                    <!-- 同時顯示 name 與 aliases 的命中項 -->
                    <ul v-if="showDropdown" class="dropdown" role="listbox">
                        <li v-for="(s, i) in suggestions" :key="s.label + '@' + s.prod.name + i" class="dropdown-item"
                            :class="{ active: i === activeIndex }" role="option"
                            @mousedown.prevent="apply(s.prod, s.label)" @mouseenter="activeIndex = i">
                            {{ s.label }}
                        </li>
                        <li v-if="!suggestions.length" class="dropdown-empty">沒有相符項目</li>
                    </ul>
                </div>

                <!-- 狀態列：顯示所選作物 or 錯誤訊息 -->
                <div class="status-row">
                    <span v-if="chosenName" class="chosen-pill">{{ chosenName }}</span>
                    <span v-else-if="errorMsg" class="error">{{ errorMsg }}</span>
                    <span v-else class="placeholder"></span>
                </div>
            </div>

            <!-- 指標 -->
            <div class="nutrient-grid">
                <div class="nutrient">
                    <div class="val">{{ display.cal }}</div>
                    <div class="label">卡路里</div>
                </div>
                <div class="nutrient">
                    <div class="val">{{ display.carb }}</div>
                    <div class="label">碳水化合物</div>
                </div>
                <div class="nutrient">
                    <div class="val">{{ display.fat }}</div>
                    <div class="label">脂肪</div>
                </div>
                <div class="nutrient">
                    <div class="val">{{ display.vitC }}</div>
                    <div class="label">維生素C</div>
                </div>
            </div>
        </div>
    </Card>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import Card from './Card.vue'
import { produceNutrition } from '@/data/nutritionData.js'
import magnifierIcon from '@/assets/magnifier-icon.png'

const keyword = ref('')
const selected = ref(null)
const chosenName = ref('') 
const errorMsg = ref('')
const searchWrap = ref(null)
const dropdownOpen = ref(false)

const isComposing = ref(false)  
const activeIndex = ref(-1)  

const norm = s => (s || '').toString().toLowerCase().replace(/\s+/g, '').trim()

function matchProduce(kw) {
    const key = norm(kw)
    if (!key) return null
    return produceNutrition.find(p =>
        norm(p.name).includes(key) ||
        (p.aliases || []).some(a => norm(a).includes(key))
    ) || null
}

/* suggestions：把 name 與 aliases 分開建立清單項 */
const suggestions = computed(() => {
    const key = norm(keyword.value)
    if (!key) return []
    const out = []
    for (const p of produceNutrition) {
        // 正式名稱命中
        if (norm(p.name).includes(key)) out.push({ prod: p, label: p.name, isAlias: false })
        // 別名命中
        for (const a of (p.aliases || [])) {
            if (norm(a).includes(key)) out.push({ prod: p, label: a, isAlias: true })
        }
    }
    // 以顯示字串去重
    const seen = new Set()
    return out.filter(x => {
        if (seen.has(x.label)) return false
        seen.add(x.label)
        return true
    }).slice(0, 8)
})

const showDropdown = computed(() => dropdownOpen.value && keyword.value.length > 0)
function onType(e) {
    if (e && e.target) keyword.value = e.target.value
    errorMsg.value = ''
    dropdownOpen.value = true
    activeIndex.value = suggestions.value.length ? 0 : -1
}
function onCompStart() {
    isComposing.value = true
}
function onCompEnd(e) {
    isComposing.value = false
    keyword.value = e.target.value
    dropdownOpen.value = true
    activeIndex.value = suggestions.value.length ? 0 : -1
}

function apply(prod, label) {
    selected.value = prod
    chosenName.value = label     // 直接帶入點擊的那個字
    keyword.value = ''           // 清空輸入
    dropdownOpen.value = false
    errorMsg.value = ''
}
function search() {
    dropdownOpen.value = false
    const p = matchProduce(keyword.value)
    if (p) {
        selected.value = p
        chosenName.value = p.name  // Enter 搜尋時顯示正式名稱
        keyword.value = ''
        errorMsg.value = ''
    } else {
        selected.value = null
        chosenName.value = ''
        if (keyword.value) {
            errorMsg.value = `找不到「${keyword.value}」的蔬果資料，請換個關鍵字。`
        }
    }
}

function onClickOutside(e) {
    if (!searchWrap.value) return
    if (!searchWrap.value.contains(e.target)) dropdownOpen.value = false
}
onMounted(() => document.addEventListener('click', onClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', onClickOutside))

const display = computed(() => {
    if (!selected.value) return { cal: '—', carb: '—', fat: '—', vitC: '—' }
    const { cal, carb, fat, vitaminC } = selected.value
    return {
        cal: String(Number(cal)),
        carb: `${Number(carb)}g`,
        fat: `${Number(fat)}g`,
        vitC: `${Number(vitaminC)}mg`
    }
})
</script>

<style scoped>
.nutrition-card {
    padding: 16px 16px 18px;
}

/* 標題 */
.title {
    font-size: 22px;
    font-weight: 900;
    color: #0f172a;
    margin: 0 0 4px;
}

.sub {
    color: #64748b;
    font-size: 14px;
    margin-bottom: 12px;
}

/* 搜尋列 */
.searchbar {
    width: 100%;
    max-width: 100%;
}

.searchbox {
    position: relative;
    display: flex;
    align-items: center;
    gap: 8px;
    border: 1px solid #e5e7eb;
    border-radius: 14px;
    background: #fff;
    padding: 8px 12px;
    box-sizing: border-box;
}

.search-input {
    flex: 1;
    min-width: 0;
    border: 0;
    outline: none;
    background: transparent;
    font-size: 14px;
    line-height: 22px;
    padding: 0;
}

.icon-btn {
    -webkit-appearance: none;
    appearance: none;
    width: 28px;
    height: 28px;
    border: 0;
    background: transparent;
    padding: 0;
    display: grid;
    place-items: center;
    cursor: pointer;
}

.icon-img {
    width: 18px;
    height: 18px;
    display: block;
}

/* 下拉建議 */
.dropdown {
    position: absolute;
    left: 0;
    right: 0;
    top: calc(100% + 6px);
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    box-shadow: 0 8px 18px rgba(0, 0, 0, .06);
    z-index: 10;
    max-height: 240px;
    overflow: auto;
    list-style: none;
    margin: 6px 0 0;
    padding: 6px 0;
}

.dropdown-item {
    padding: 10px 12px;
    cursor: pointer;
    list-style: none;
}

.dropdown-item.active,
.dropdown-item:hover {
    background: #f4f7f5;
}

.dropdown-empty {
    padding: 10px 12px;
    color: #94a3b8;
    list-style: none;
}

/* 狀態列：固定高度，避免排版跳動 */
.status-row {
    min-height: 24px;
    margin-top: 8px;
    display: flex;
    align-items: center;
    gap: 8px;
}

.placeholder {
    visibility: hidden;
}

.error {
    font-size: 12px;
    color: #b91c1c;
    line-height: 1.4;
    overflow-wrap: anywhere;
}

.chosen-pill {
    font-size: 20px;
    font-weight: 700;
    color: #166534;
    padding: 8px 10px;
    border-radius: 999px;
}

/* 指標格 */
.nutrient-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
}

.nutrient {
    background: #f6faf7;
    border: 1px solid #ebf2ed;
    border-radius: 14px;
    padding: 18px 12px;
    text-align: center;
}

.val {
    color: #1a7f3c;
    font-weight: 900;
    font-size: 20px;
    line-height: 1;
    margin-bottom: 2px;
}

.label {
    color: #475569;
    font-size: 13px;
}

@media (max-width:768px) {
    .title {
        font-size: 20px;
    }

    .val {
        font-size: 20px;
    }
}
</style>
