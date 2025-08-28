<template>
  <div>
    <ConsumerHome v-if="role === 'consumer'" />
    <!-- <FarmerHome v-else-if="role === 'farmer'" /> -->
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

// 引入不同角色的首頁元件
import ConsumerHome from "./Consumer/ConsumerHome.vue";
//import FarmerHome from "./Farmer/FarmerHome.vue";

// 引入角色切換元件（消費者 / 農民）
//import RoleToggle from "@/components/RoleToggle.vue";

// 定義一個響應式變數，用來儲存當前使用者角色，預設為 consumer
const role = ref("consumer");

// 在元件掛載時，從 localStorage 取得使用者選擇的角色
onMounted(() => {
  const savedRole = localStorage.getItem("userRole");
  role.value = savedRole || "consumer";
});
</script>
