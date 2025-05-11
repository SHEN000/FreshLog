<template>
  <div class="farmer-card">
    <div class="header">
      <h2 class="title">小農直購專區</h2>
    </div>

    <div class="profile">
      <img :src="farmer.image" alt="farmer avatar" class="avatar" />
      <div class="info">
        <div class="name">{{ farmer.name }} – {{ farmer.farm }}</div>
        <div class="meta">{{ farmer.location }} / {{ farmer.certification }}</div>
        <div class="rating">
          <span class="stars">
            <!-- 滿星 -->
            <span
              v-for="(_, i) in fullStars"
              :key="'full-' + i"
              class="star full"
            >★</span>
            <!-- 半顆星 -->
            <span v-if="hasHalfStar" class="star half"></span>
            <!-- 空星 -->
            <span
              v-for="(_, i) in emptyStars"
              :key="'empty-' + i"
              class="star empty"
            >★</span>
          </span>
          <span class="value">
            {{ displayRating }}（{{ farmer.reviewCount || 0 }} 則評價）
          </span>
        </div>
      </div>
    </div>

    <div class="price-section">
      <div class="special-price">
        特惠價：${{ farmer.specialPrice || 0 }}/{{ farmer.unit || '公斤' }}
      </div>
      <div class="min-qty">
        最低購買量：{{ farmer.minQty || 0 }}{{ farmer.unit || '公斤' }}
      </div>
    </div>

    <button class="btn-buy">直接購買</button>

    <div class="footer">
      <div class="footer-item">
        <img :src="icons.shipping" alt="" class="icon" />
        <span>{{ farmer.shipping }}</span>
      </div>
      <div class="footer-item">
        <img :src="icons.traceCertification" alt="" class="icon" />
        <span>{{ farmer.traceCertification }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { veggieMockData } from '@/data/mockVeggieData.js'
import truckIcon from '@/assets/icons/truck.png'
import shieldIcon from '@/assets/icons/shield.png'

// 取得 farmer 資料，若不存在則預設空物件
const farmer = veggieMockData.farmer || {}

// 計算要顯示的評分數值：
// 先轉成數字，clamp 在 0~5 範圍內，四捨五入到小數 1 位
const displayRating = computed(() => {
  const r = Number(farmer.rating)
  if (isNaN(r) || r < 0) return 0
  if (r > 5) return 5
  return Math.round(r * 10) / 10
})

// 計算「滿星」數量：直接取整數部分
const fullStars = computed(() => Math.floor(displayRating.value))

// 是否要顯示半顆星：
// 若小數部份 >= 0.5，則顯示一顆半星
const hasHalfStar = computed(() => {
  return displayRating.value - Math.floor(displayRating.value) >= 0.5
})

// 計算「空星」數量：總共有 5 顆，扣掉滿星與半星後剩餘的
const emptyStars = computed(() => {
  const used = fullStars.value + (hasHalfStar.value ? 1 : 0)
  return Math.max(0, 5 - used)
})

const icons = {
  shipping: truckIcon,
  traceCertification: shieldIcon
}
</script>

<style scoped>
.farmer-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
  box-sizing: border-box;
}

/* 標題 */
.header .title {
  font-size: 18px;
  font-weight: bold;
  color: #2e7d32;
  margin: 0 0 16px;
}

.profile {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

/* 大頭照圓形 */
.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
}
.info .name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}
.info .meta {
  font-size: 14px;
  color: #777;
  margin: 4px 0;
}

/* 星等 */
.rating {
  display: flex;
  align-items: center;
  gap: 8px;
}
.stars {
  display: inline-flex;
  align-items: center;
  gap: 2px;
}

.star {
  position: relative;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 14px;
  height: 14px;
  font-size: 14px;
  line-height: 1;
}

/* 滿星 */
.star.full {
  color: #fbc02d;
}

/* 空星 */
.star.empty {
  color: #eee;
}

/* 半星：先畫一顆空星，再用 ::before 覆蓋左半 */
.star.half {
  color: #eee;
}
.star.half::before {
  content: '★';
  position: absolute;
  top: 0;
  left: 0;
  width: 50%;
  height: 100%;
  overflow: hidden;
  color: #fbc02d;
}
.value {
  font-size: 14px;
  color: #555;
}

/* 價格區 */
.price-section {
  margin-bottom: 16px;
}
.special-price {
  font-size: 18px;
  font-weight: bold;
  color: #2e7d32;
  margin-bottom: 4px;
}
.min-qty {
  font-size: 14px;
  color: #777;
}

/* 購買按鈕 */
.btn-buy {
  width: 100%;
  background: #2e7d32;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 10px 0;
  font-size: 16px;
  cursor: pointer;
  margin-bottom: 16px;
}

/* 底部資訊 */
.footer {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.footer-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #555;
}
.footer-item .icon {
  width: 18px;
  height: 18px;
}

/* 手機版調整 */
@media (max-width: 768px) {
  .farmer-card {
    padding: 16px;
  }
  .profile {
    flex-direction: column;
    align-items: flex-start;
  }
  .avatar {
    width: 50px;
    height: 50px;
  }
  .btn-buy {
    font-size: 14px;
  }
}
</style>
