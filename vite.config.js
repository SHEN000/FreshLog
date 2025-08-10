import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  base: "/",
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)), // 路徑別名
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://43.199.27.51',  // 你的後端 API 主機
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'), // 保留 /api 開頭
      },
    },
  },
})
