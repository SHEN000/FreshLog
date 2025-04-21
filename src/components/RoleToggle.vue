<template>
  <div class="role-toggle">
    <button :class="{ active: role === 'consumer' }" @click="setRole('consumer')">消費者</button>
    <button :class="{ active: role === 'farmer' }" @click="setRole('farmer')">農民</button>
  </div>
</template>

<script setup>
import { useUserStore } from '@/store/user'

const userStore = useUserStore()
// 讀取目前的角色
const role = userStore.userRole

// 設定角色並刷新頁面
const setRole = (newRole) => {
  if (newRole !== userStore.userRole) {
    userStore.setUserRole(newRole)
    window.location.reload() // 強制刷新畫面讓元件重新載入
  }
}
</script>

<style scoped>
/* 容器置中，增加上下間距 */
.role-toggle {
  margin: 20px;
  text-align: center;
}

/* 切換按鈕樣式 */
button {
  margin: 0 10px;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
}

/* 被選取角色按鈕（active class）樣式 */
.active {
  background-color: #59c2b9;
  color: white;
}
</style>
