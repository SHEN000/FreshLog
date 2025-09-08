import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  base: "/",
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)), // 路徑別名
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "https://freshlog-api.ttshow.tw", // 你的後端 API 主機
        changeOrigin: true,
        secure: true, // test
        rewrite: (path) => path.replace(/^\/api/, "/api"), // 保留 /api 開頭
      },
    },
  },
});
