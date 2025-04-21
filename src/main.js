import { createApp } from 'vue' // 匯入 Vue 創建應用的 API
import { createPinia } from 'pinia' // 匯入 Pinia 作為全域狀態管理工具
import App from './App.vue'
import router from './router' // 匯入 Vue Router 設定

import './assets/style.css' // 匯入全域樣式

const app = createApp(App) // 建立 Vue App 實體，並掛載 App.vue 為根組件

app.use(createPinia()) // 掛載 Pinia 狀態管理
app.use(router) // 掛載 Vue Router 路由功能

app.mount('#app')