import { createApp } from "vue"; // 匯入 Vue 創建應用的 API
import { createPinia } from "pinia"; // 匯入 Pinia 作為全域狀態管理工具
import App from "./App.vue";
import router from "./router"; // 匯入 Vue Router 設定
import Footer from "./components/Footer.vue";

import "./assets/style.css"; // 匯入全域樣式
import { resolveImg } from "@/utils/resolveImg"


const app = createApp(App); // 建立 Vue App 實體，並掛載 App.vue 為根組件
app.component("Footer", Footer); //我直接全域註冊footer

// 全域方法 $img
app.config.globalProperties.$img = (p) => resolveImg(p)

app.use(createPinia()); // 掛載 Pinia 狀態管理
app.use(router); // 掛載 Vue Router 路由功能

app.mount("#app");
